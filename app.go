package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	openai "github.com/sashabaranov/go-openai"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/hotkey"
	"golang.design/x/hotkey/mainthread"
)

var defaultAction = Action{
	Id:             -1,
	Name:           "Ask a question",
	Prompt:         "",
	PromptResponse: "",
	Shortcut: Shortcut{
		Mods: []hotkey.Modifier{hotkey.ModCtrl},
		Key:  hotkey.KeyQ,
	},
}

// App struct
type App struct {
	ctx         context.Context
	configStore *ConfigStore
	chatHistory *ChatHistory
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	var err error
	a.configStore, err = NewConfigStore()
	if err != nil {
		runtime.EventsEmit(a.ctx, "Error", err.Error())
	}

	a.chatHistory, err = GetChatHistory()
	if err != nil {
		runtime.EventsEmit(a.ctx, "Error", err.Error())
	}

	go mainthread.Init(a.registerShortcuts)
}

func (a *App) registerHotkey(action Action, callback func(action Action)) {
	hk := hotkey.New(action.Shortcut.Mods, action.Shortcut.Key)
	if err := hk.Register(); err != nil {
		fmt.Printf("failed to register hotkey: %v", err)
		return
	}

	for {
		<-hk.Keydown()
		callback(action)
	}
}

func (a *App) registerShortcuts() {
	cfg, err := a.configStore.Config()

	if err != nil {
		fmt.Printf("Error reading config file %s\n", err)
		os.Exit(1)
	}

	allActions := cfg.Actions

	allActions[-1] = defaultAction

	for _, action := range allActions {
		go a.registerHotkey(action, func(currAction Action) {
			fmt.Println("shortcut pressed", currAction.Name)
			runtime.EventsEmit(a.ctx, "actionShortcut", currAction.ToActionResponse())
			runtime.WindowShow(a.ctx)
		})
	}
}

func (a *App) HasSavedKey() bool {
	cfg, err := a.configStore.Config()

	if err != nil {
		fmt.Printf("Error reading config file %s\n", err)
		os.Exit(1)
	}

	if cfg.ApiKey == "" {
		return false
	}

	return true
}

func (a *App) SaveOpenAIKey(key string) string {
	cfg, _ := a.configStore.Config()
	requestURL := fmt.Sprintf("https://api.openai.com/v1/chat/completions")
	req, err := http.NewRequest(http.MethodPost, requestURL, nil)

	if err != nil {
		fmt.Printf("client: could not create request: %s\n", err)
		os.Exit(1)
	}

	fmt.Printf("key %s", key)
	req.Header.Add("Content-Type", "application/json")
	bearer := "Bearer " + key
	req.Header.Add("Authorization", bearer)

	res, err := http.DefaultClient.Do(req)

	fmt.Printf("client: status code: %d\n", res.StatusCode)
	if err != nil {
		fmt.Printf("client: error making http request: %s\n", err)
		os.Exit(1)
	}

	if res.StatusCode == 401 {
		return "Api key is invalid, please check it and try again"
	}

	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("client: could not read response body: %s\n", err)
		os.Exit(1)
	}

	fmt.Printf("client: response body: %s\n", resBody)

	cfg.ApiKey = key
	err = a.configStore.SaveConfig(cfg)

	if err != nil {
		runtime.EventsEmit(a.ctx, "Error", "Error saving api key to configuration: "+err.Error())
	}

	return ""
}

func (a *App) SendMessage(messages []openai.ChatCompletionMessage, actionId int) string {
	cfg, _ := a.configStore.Config()

	client := openai.NewClient(cfg.ApiKey)

	if actionId != -1 {
		action := cfg.Actions[actionId]
		messages = append([]openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: action.Prompt,
			},
			{
				Role:    openai.ChatMessageRoleAssistant,
				Content: action.PromptResponse,
			},
		}, messages...)
	}

	fmt.Println("restarting")
	fmt.Println(messages)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    openai.GPT3Dot5Turbo,
			Messages: messages,
		},
	)

	if err != nil {
		fmt.Println("Error", err.Error())
		runtime.EventsEmit(a.ctx, "Error", "Error requesting openai"+err.Error())
	}

	text := resp.Choices[0].Message.Content
	fmt.Println(text)
	return text
}

func (a *App) chatWithHistory(message string) string {
	messages := a.chatHistory.Messages

	messages = append(messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: message,
	})

	fmt.Println(messages)
	return ""
}

func (a *App) SaveAction(action Action, shortcut ShortcutRequest) {
	action.Shortcut = shortcut.toShortcut()
	go a.saveActionResponse(action)
	err := action.store(*a.configStore)

	if err != nil {
		fmt.Println("Error", err.Error())
		runtime.EventsEmit(a.ctx, "Error", "Error saving action"+err.Error())
	}
}

func (a *App) GetActions() map[int]ActionResponse {
	cfg, err := a.configStore.Config()
	if err != nil {
		runtime.EventsEmit(a.ctx, "Error", "Error getting actions"+err.Error())
	}

	actionResponse := map[int]ActionResponse{}
	actionResponse[-1] = defaultAction.ToActionResponse()

	for _, action := range cfg.Actions {
		actionResponse[action.Id] = action.ToActionResponse()
	}

	return actionResponse
}

func (a *App) saveActionResponse(action Action) {
	messages := []openai.ChatCompletionMessage{{
		Role:    openai.ChatMessageRoleUser,
		Content: action.Prompt,
	}}

	res := a.SendMessage(messages, -1)
	action.PromptResponse = res
	err := action.store(*a.configStore)

	if err != nil {
		fmt.Println("Error", err.Error())
		runtime.EventsEmit(a.ctx, "Error", "Error saving action"+err.Error())
	}
}

func (a *App) GetKeys() []string {
	keys := make([]string, len(modMapping)+len(keyMapping))
	i := 0
	for k := range modMapping {
		keys[i] = k
		i++
	}

	for k := range keyMapping {
		keys[i] = k
		i++
	}

	return keys
}
