package main

import (
	"fmt"

	"golang.design/x/hotkey"
)

type ShortcutRequest struct {
	Mods []string `json:"mods"`
	Key  string   `json:"key"`
}

type Shortcut struct {
	Mods []hotkey.Modifier `json:"mods"`
	Key  hotkey.Key        `json:"key"`
}

var modMapping = map[string]hotkey.Modifier{
	"Shift":   hotkey.ModShift,
	"Control": hotkey.ModCtrl,
	"Alt":     hotkey.ModAlt,
	"Meta":    hotkey.ModWin,
}

var modToStringMapping = map[hotkey.Modifier]string{
	hotkey.ModShift: "Shift",
	hotkey.ModCtrl:  "Control",
	hotkey.ModAlt:   "Alt",
	hotkey.ModWin:   "Meta",
}

var keyMapping = map[string]hotkey.Key{
	" ": hotkey.KeySpace,
	"0": hotkey.Key0,
	"1": hotkey.Key1,
	"2": hotkey.Key2,
	"3": hotkey.Key3,
	"4": hotkey.Key4,
	"5": hotkey.Key5,
	"6": hotkey.Key6,
	"7": hotkey.Key7,
	"8": hotkey.Key8,
	"9": hotkey.Key9,

	"a": hotkey.KeyA,
	"b": hotkey.KeyB,
	"c": hotkey.KeyC,
	"d": hotkey.KeyD,
	"e": hotkey.KeyE,
	"f": hotkey.KeyF,
	"g": hotkey.KeyG,
	"h": hotkey.KeyH,
	"i": hotkey.KeyI,
	"j": hotkey.KeyJ,
	"k": hotkey.KeyK,
	"l": hotkey.KeyL,
	"m": hotkey.KeyM,
	"n": hotkey.KeyN,
	"o": hotkey.KeyO,
	"p": hotkey.KeyP,
	"q": hotkey.KeyQ,
	"r": hotkey.KeyR,
	"s": hotkey.KeyS,
	"t": hotkey.KeyT,
	"u": hotkey.KeyU,
	"v": hotkey.KeyV,
	"w": hotkey.KeyW,
	"x": hotkey.KeyX,
	"y": hotkey.KeyY,
	"z": hotkey.KeyZ,

	"Enter":  hotkey.KeyReturn,
	"Escape": hotkey.KeyEscape,
	"Delete": hotkey.KeyDelete,
	"Tab":    hotkey.KeyTab,

	"ArrowLeft":  hotkey.KeyLeft,
	"ArrowUp":    hotkey.KeyUp,
	"ArrowRight": hotkey.KeyRight,
	"KeyDown":    hotkey.KeyDown,

	"F1":  hotkey.KeyF1,
	"F2":  hotkey.KeyF2,
	"F3":  hotkey.KeyF3,
	"F4":  hotkey.KeyF4,
	"F5":  hotkey.KeyF5,
	"F6":  hotkey.KeyF6,
	"F7":  hotkey.KeyF7,
	"F8":  hotkey.KeyF8,
	"F9":  hotkey.KeyF9,
	"F10": hotkey.KeyF10,
	"F11": hotkey.KeyF11,
	"F12": hotkey.KeyF12,
}

var keyToStringMapping = map[hotkey.Key]string{
	hotkey.KeySpace: " ",
	hotkey.Key0:     "0",
	hotkey.Key1:     "1",
	hotkey.Key2:     "2",
	hotkey.Key3:     "3",
	hotkey.Key4:     "4",
	hotkey.Key5:     "5",
	hotkey.Key6:     "6",
	hotkey.Key7:     "7",
	hotkey.Key8:     "8",
	hotkey.Key9:     "9",

	hotkey.KeyA: "a",
	hotkey.KeyB: "b",
	hotkey.KeyC: "c",
	hotkey.KeyD: "d",
	hotkey.KeyE: "e",
	hotkey.KeyF: "f",
	hotkey.KeyG: "g",
	hotkey.KeyH: "h",
	hotkey.KeyI: "i",
	hotkey.KeyJ: "j",
	hotkey.KeyK: "k",
	hotkey.KeyL: "l",
	hotkey.KeyM: "m",
	hotkey.KeyN: "n",
	hotkey.KeyO: "o",
	hotkey.KeyP: "p",
	hotkey.KeyQ: "q",
	hotkey.KeyR: "r",
	hotkey.KeyS: "s",
	hotkey.KeyT: "t",
	hotkey.KeyU: "u",
	hotkey.KeyV: "v",
	hotkey.KeyW: "w",
	hotkey.KeyX: "x",
	hotkey.KeyY: "y",
	hotkey.KeyZ: "z",

	hotkey.KeyReturn: "Enter",
	hotkey.KeyEscape: "Escape",
	hotkey.KeyDelete: "Delete",
	hotkey.KeyTab:    "Tab",

	hotkey.KeyLeft:  "ArrowLeft",
	hotkey.KeyUp:    "ArrowUp",
	hotkey.KeyRight: "ArrowRight",
	hotkey.KeyDown:  "ArrowDown",

	hotkey.KeyF1:  "F1",
	hotkey.KeyF2:  "F2",
	hotkey.KeyF3:  "F3",
	hotkey.KeyF4:  "F4",
	hotkey.KeyF5:  "F5",
	hotkey.KeyF6:  "F6",
	hotkey.KeyF7:  "F7",
	hotkey.KeyF8:  "F8",
	hotkey.KeyF9:  "F9",
	hotkey.KeyF10: "F10",
	hotkey.KeyF11: "F11",
	hotkey.KeyF12: "F12",
}

func (sr *ShortcutRequest) toShortcut() Shortcut {
	parsedMods := []hotkey.Modifier{}
	for _, mod := range sr.Mods {
		parsedMods = append(parsedMods, modMapping[mod])
	}

	parsedKey := keyMapping[sr.Key]

	return Shortcut{
		Mods: parsedMods,
		Key:  parsedKey,
	}
}

func (s *Shortcut) toShortcutRequest() ShortcutRequest {
	parsedMods := []string{}
	for _, mod := range s.Mods {
		parsedMods = append(parsedMods, modToStringMapping[mod])
	}

	parsedKey := keyToStringMapping[s.Key]

	return ShortcutRequest{
		Mods: parsedMods,
		Key:  parsedKey,
	}
}

type ActionResponse struct {
	Id             int
	Name           string
	Prompt         string
	PromptResponse string
	Shortcut       ShortcutRequest
}

type Action struct {
	Id             int
	Name           string
	Prompt         string
	PromptResponse string
	Shortcut       Shortcut
}

func (a *Action) store(configStore ConfigStore) error {
	cfg, err := configStore.Config()

	if err != nil {
		return err
	}

	index := len(cfg.Actions)
	a.Id = index

	if cfg.Actions == nil {
		cfg.Actions = map[int]Action{}
	}

	fmt.Print(cfg.Actions[index].Shortcut.Mods)
	fmt.Print(cfg.Actions[index].Shortcut.Key)
	cfg.Actions[index] = *a
	err = configStore.SaveConfig(cfg)
	return err
}

func (a *Action) ToActionResponse() ActionResponse {
	return ActionResponse{
		Id:             a.Id,
		Name:           a.Name,
		Prompt:         a.Prompt,
		PromptResponse: a.PromptResponse,
		Shortcut:       a.Shortcut.toShortcutRequest(),
	}
}
