package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/adrg/xdg"
	openai "github.com/sashabaranov/go-openai"
)

type ChatHistory struct {
  Messages []openai.ChatCompletionMessage
}

func NewChatHistory() (*ChatHistory, error) {
  return &ChatHistory{}, nil
}

func (s *ChatHistory) Save() error {
  bytes, err := json.Marshal(s)

  if err != nil {
    return fmt.Errorf("could not marshal config to JSON: %w", err)
  }

  path, err := xdg.ConfigFile("gptdesktop/chat_history.json")

  if err != nil {
    return fmt.Errorf("could not write the configuration file: %w", err)
  }

  err = os.WriteFile(path, bytes, 0644)

  if err != nil {
    return fmt.Errorf("could not write the configuration file: %w", err)
  }

  return err
}

func GetChatHistory () ( *ChatHistory, error) {
  return NewChatHistory()
  path, err := xdg.ConfigFile("gptdesktop/chat_history.json")

  if err != nil {
    return nil, err
  }

  file, err := os.Open(path)

  if  err != nil {
    return NewChatHistory()
  }

  byteValue, err := ioutil.ReadAll(file)

  if err != nil {
    fmt.Println("error")
    return nil, err
  }

  fmt.Println("bytValue")
  fmt.Println(string(byteValue))

  chatHistory := &ChatHistory{}

  json.Unmarshal(byteValue, &chatHistory)

  return chatHistory, err
}
