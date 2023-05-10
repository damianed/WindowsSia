package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
  configStore *ConfigStore
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
  if (res.StatusCode == 401) {
    return "Api key is invalid, please check it and try again"
  }


  if err != nil {
		fmt.Printf("client: error making http request: %s\n", err)
		os.Exit(1)
	}

  resBody, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Printf("client: could not read response body: %s\n", err)
    os.Exit(1)
  }

  fmt.Printf("client: response body: %s\n", resBody)

  if err != nil {
    fmt.Printf("error making http request: %s\n", err)
    os.Exit(1)
  }

  cfg.ApiKey = key
  err = a.configStore.SaveConfig(cfg)

  if err != nil {
    runtime.EventsEmit(a.ctx, "Error", "Error saving api key to configuration: " + err.Error())
  }

  return ""
}
