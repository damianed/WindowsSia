import {useCallback, useEffect, useState} from "react";

export default function AddShortcutField({ setShortCut }) {
  const [keysPressed, setKeysPressed] = useState([])
  const [recording, setRecording] = useState(false)

  const handleKeyPress = useCallback((event) => {
    let key = event.key
    if (key === 'Meta') {
      key = 'Alt'
    }

    if (key === ' ') {
      key = 'Space'
    }

    if (key === 'Shift') {
      key = '⇧'
    }

    if (key === 'Control') {
      key = 'CTRL'
    }

    if (key == 'Super') {
      key = '❖'
    }

    key = key.toUpperCase()

    if (keysPressed.includes(key)) {
      return
    }

    const currKeys = [...keysPressed, key]
    setKeysPressed(currKeys)

    if (! ['Shift', 'Alt', 'Control', 'Super', 'Meta'].includes(event.key)) {
      setRecording(false)
      setShortCut(currKeys)
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
      setKeysPressed([])
      addEventListeners()
    } else {
      removeEventListener()
    }
  }, [recording])

  return (
    <div onClick={() => setRecording(true)} className="w-1/2 py-2 text-center text-gray-400 bg-white">
      {keysPressed.map((key, index) => {
        let element = key
        if (index < keysPressed.length - 1)
          element = `${element} +`

        if (index > 0)
          element = ` ${element}`

        return <span key={index} className="font-bold text-gray-500">{element}</span>
      })}
      { recording ? <p>Recording...</p> : <p>Click to change shortcut</p> }
    </div>
  )
}
