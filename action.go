package main

import (
	"fmt"

)

type Action struct {
  Id int
  Name string
  Prompt string
  PromptResponse string
  Shortcut []string
}

func (a *Action) store(configStore ConfigStore) error {
  fmt.Println("saving action")
  cfg, err := configStore.Config()

  if (err != nil) {
    return err
  }

  index := len(cfg.Actions)
  a.Id = index
  cfg.Actions[index] = *a
  fmt.Println(cfg)
  err = configStore.SaveConfig(cfg)
  return err
}
