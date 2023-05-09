package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

type Config struct {
  ApiKey string `json:apiKey`
}

func DefaultConfig() Config {
  return Config{
    ApiKey: "",
  }
}

type ConfigStore struct {
  configPath string
}

func NewConfigStore() (*ConfigStore, error) {
  configFilePath, err := xdg.ConfigFile("gptdesktop/config.json")
  if err != nil {
    return nil, fmt.Errorf("could not resolve path for config file: %w", err)
  }

  return &ConfigStore{
    configPath: configFilePath,
  }, nil
}

func (s *ConfigStore) Config() (Config, error) {
  _, err := os.Stat(s.configPath)
  if os.IsNotExist(err) {
    return DefaultConfig(), nil
  }

  dir, fileName := filepath.Split(s.configPath)
  if len(dir) == 0 {
    dir = "."
  }

  buf, err := fs.ReadFile(os.DirFS(dir), fileName)
  if err != nil {
    return Config{}, fmt.Errorf("could not read the configuration file %w", err)
  }

  if len(buf) == 0 {
    return DefaultConfig(), nil
  }

  cfg := Config{}
  if err := json.Unmarshal(buf, &cfg); err != nil {
    //TODO: Update error messages
    return Config{}, fmt.Errorf("configuration file does not have a valid format: %w", err)
  }

  return cfg, nil
}

func (s *ConfigStore) SaveConfig(cfg Config) error {
  bytes, err := json.Marshal(cfg)
  if err != nil {
    return fmt.Errorf("could not marshal config to JSON: %w", err)
  }

  err = os.WriteFile(s.configPath, bytes, 0644)

  log.Println(s.configPath)
  if err != nil {
    return fmt.Errorf("could not write the configuration file: %w", err)
  }

  return nil
}
