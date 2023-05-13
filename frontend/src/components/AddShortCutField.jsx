import {useCallback, useEffect, useState} from "react";

export default function AddShortcutField({ active, setShortCut, onClick=(() => {})}) {
  const [keysPressed, setKeysPressed] = useState([])
  const [addingGroup, setAddingGroup] = useState([])

  const handleKeyPress = useCallback((event) => {
    let currKeys = keysPressed
    if (!addingGroup) {
      currKeys = []
      setKeysPressed([])
      setAddingGroup(true)
    }

    console.log(`Keys pressed: ${currKeys.length}`)
    setKeysPressed([...keysPressed, event.key])
  }, [])

  const handleKeyUp = useCallback((event) => {
    setAddingGroup(false)
    setShortCut(keysPressed)
  }, [])

  function addEventListeners()
  {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('keyup', handleKeyUp)
  }

  function removeEventListener()
  {
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('keyup', handleKeyUp)
  }

  useEffect(() => {
    if (active) {
      addEventListeners()
    }

    return () => {
      removeEventListener()
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (active) {
      console.log('adding event listener')
      addEventListeners()
    } else {
      setShortCut(keysPressed)
      removeEventListener()
    }
  }, [active])

  return (
    <div onClick={onClick} className="w-16 h-12 bg-white">
      {keysPressed.map((key) => key)}
    </div>
  )
}
