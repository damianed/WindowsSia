import {useEffect, useState} from "react"
import AddShortcutField from "./AddShortCutField"
import ViewBase from "./ViewBase"
import {SaveAction} from "../../wailsjs/go/main/App"

// TODO: add option to insert text maybe, maybe should always do that if text is selected
export default function AddAction({ onBack = null}) {
  const [shortcutKeys, setShortcutKeys] = useState(false)
  const [name, setName] = useState('')
  const updateName = (e) => setName(e.target.value)
  const [prompt, setPrompt] = useState('')
  const updatePrompt = (e) => setPrompt(e.target.value)

  useEffect(() => {
    console.log('shortgang', shortcutKeys)
  }, [shortcutKeys])

  function onSave() {
    //TODO: check variables are not empty
    SaveAction({Name: name, Prompt: prompt, Shortcut: shortcutKeys}).then(() => {
      onBack()
    })
  }

  return (
    <ViewBase title="Add new action" onBack={onBack} buttons={[{'text': 'Save', onClick: onSave}]}>
      <div className="flex flex-col py-4 mx-10 space-y-4">
        <div className="flex flex-col w-full space-y-3">
          <div className="flex">Name of action</div>
          <input type="text" className="flex bg-gray-700" onChange={updateName}></input>
        </div>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex">Prompt</div>
          <textarea rows="8" className="bg-gray-700" onChange={updatePrompt}></textarea>
        </div>
       <div className="flex flex-col w-full space-y-3">
          <div className="flex">Click to add shortcut</div>
          <AddShortcutField setShortCut={setShortcutKeys} />
        </div>
      </div>
    </ViewBase>
  )
}

