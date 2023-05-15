import {useEffect, useState} from "react"
import AddShortcutField from "./AddShortCutField"
import ViewBase from "./ViewBase"

// TODO: add option to insert text maybe, maybe should always do that if text is selected
export default function AddAction() {
  const [addingShortcut, setAddingShortcut] = useState(false)
  const [shortcutKeys, setShortcutKeys] = useState(false)

  useEffect(() => {
    console.log('shortgang', shortcutKeys)
  }, [shortcutKeys])

  function onSave() {

  }

  return (
    <ViewBase title="Add new action" buttons={[{'text': 'Save', onClick: onSave}]}>
      <div className="flex flex-col py-4 mx-10 space-y-4">
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
          <AddShortcutField setShortCut={setShortcutKeys} />
        </div>
      </div>
    </ViewBase>
  )
}

