import {useState} from "react"
import AddShortcutField from "./AddShortCutField"

// TODO: add option to insert text maybe, maybe should always do that if text is selected
export default function AddAction() {
  const [addingShortcut, setAddingShortcut] = useState(false)
  const [shortcutKeys, setShortcutKeys] = useState(false)

  function onAddShortcut() {
    console.log(!addingShortcut)
    setAddingShortcut(!addingShortcut)
  }

  return (
    <div>
      <div className="flex flex-col py-12 mx-20 space-y-12">
        <div className="flex flex-col w-full space-y-3">
          <div className="flex">Name of action</div>
          <input type="text" className="flex"></input>
        </div>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex">Prompt</div>
          <textarea rows="8"></textarea>
        </div>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex">Click to add shortcut</div>
          <AddShortcutField onClick={onAddShortcut} active={addingShortcut} setShortCut={setShortcutKeys} />
        </div>
      </div>
    </div>
  )
}

