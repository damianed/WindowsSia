package main

import "fmt"

type Action struct {
  Name string
  Prompt string
  Shortcut []string
}

func (a *Action) store(configStore ConfigStore) error {
  fmt.Println("saving action")
  cfg, err := configStore.Config()

  if (err != nil) {
    return err
  }

  cfg.Actions = append(cfg.Actions, *a)
  fmt.Println(cfg)
  err = configStore.SaveConfig(cfg)
  return err
}
