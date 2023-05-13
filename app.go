package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	openai "github.com/sashabaranov/go-openai"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
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

  fmt.Println("set chat history" )
}

func (a *App) HasSavedKey() bool {
  cfg, _ := a.configStore.Config()
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

  if (res.StatusCode == 401) {
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
    runtime.EventsEmit(a.ctx, "Error", "Error saving api key to configuration: " + err.Error())
  }

  return ""
}

func (a *App) SendMessage(messages []openai.ChatCompletionMessage) string {
  fmt.Println(messages)
  cfg, _ := a.configStore.Config()

  client := openai.NewClient(cfg.ApiKey)
  resp, err := client.CreateChatCompletion(
    context.Background(),
    openai.ChatCompletionRequest{
      Model: openai.GPT3Dot5Turbo,
      Messages: messages,
    },
  )

  if err != nil {
    fmt.Println("Error", err.Error())
    runtime.EventsEmit(a.ctx, "Error", "Error requesting openai" + err.Error())
  }

  text := resp.Choices[0].Message.Content
  fmt.Println(text)
  return text
}

func (a *App) chatWithHistory(message string) (string) {
  messages := a.chatHistory.Messages

  messages = append(messages, openai.ChatCompletionMessage{
    Role: openai.ChatMessageRoleUser,
    Content: message,
  })

  fmt.Println(messages)
  return ""
}
