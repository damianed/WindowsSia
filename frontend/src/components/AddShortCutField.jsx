import {useCallback, useEffect, useState} from "react";
import {GetKeys} from "../../wailsjs/go/main/App";

export default function AddShortcutField({ setShortCut, shortcutError = null }) {
  const [keysPressed, setKeysPressed] = useState({mods: [], key: null})
  const [keysDisplay, setKeysDisplay] = useState([])
  const [recording, setRecording] = useState(false)
  const [validKeys, setValidKeys] = useState(null)

  useEffect(() => {
    GetKeys().then((keys) => {
      setValidKeys(new Set(keys))
    })
  }, [])

  const handleKeyPress = useCallback((event) => {
    let key = event.key
    console.log(key);
    if (!validKeys || (validKeys && !validKeys.has(key))) { return } 

    let display = event.key
    if (key === 'Meta') {
      display = 'Alt'
    }

    if (key === ' ') {
      display = 'Space'
    }

    if (key === 'Shift') {
      display = '⇧'
    }

    if (key === 'Control') {
      display = 'CTRL'
    }

    if (key === 'Super') {
      display = '❖'
    }

    display = display.toLowerCase()

    if (keysDisplay.includes(display)) {
      return
    }

    setKeysDisplay((keysDisplay) => [...keysDisplay, display])
    if (! ['Shift', 'Alt', 'Control', 'Super', 'Meta'].includes(event.key)) {
      setRecording(false)
      setKeysPressed((keysPressed) => {
        const currShortcut = {mods: keysPressed.mods, key: key}
        setKeysPressed(currShortcut)
        setShortCut(currShortcut)
      })
    } else {
      setKeysPressed({mods: [...keysPressed.mods, key], key: keysPressed.key})
    }
  }, [keysPressed])

  function addEventListeners() {
    document.addEventListener('keydown', handleKeyPress)
  }

  function removeEventListener() {
    document.removeEventListener('keydown', handleKeyPress)
  }

  useEffect(() => {
    if (recording) {
      addEventListeners()
    }

    return () => {
      removeEventListener()
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (recording) {
      setKeysDisplay([])
      setKeysPressed({mods: [], key: null})
      addEventListeners()
    } else {
      removeEventListener()
    }
  }, [recording])

  return (
    <div onClick={() => setRecording(true)} className="w-1/2 py-2 text-center bg-gray-700">
      {shortcutError && <p className="text-red-500">{shortcutError}</p>}
      {keysDisplay.map((key, index) => {
        let element = key 
        if (index < keysDisplay.length - 1)
          element = `${element} +`

        if (index > 0)
          element = ` ${element}`

        return <span key={index} className="font-bold">{element}</span>
      })}
      { recording ? <p>Recording...</p> : <p>Click to change shortcut</p> }
    </div>
  )
}
