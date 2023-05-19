import {useEffect, useState} from "react";
import ViewBase from "./ViewBase";
import {GetActions} from "../../wailsjs/go/main/App"
import Chat from "./Chat";
import AddAction from "./AddAction";

function ActionElement ({name, shortcut, onClick}) {
  // TODO: fetch actions from backend
  return (
    <div className="flex justify-between px-3 py-2 mx-5 mb-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={onClick}>
      <span>{name}</span>
      <div className="space-x-1">
        {shortcut.map((key, index) => {
          return <span key={index} className="px-2 py-1 bg-gray-900">{key.toLowerCase()}</span>
        })}
      </div>
    </div>
  )
}

export default function Main() {
  const [actions, setActions] = useState([]);
  const [actionSelected, setActionSelected] = useState(null)
  const [addingAction, setAddingAction] = useState(false)
  const [title, setTitle] = useState("Search Action")

  const fetchActions = () => {
    GetActions().then((actions) => {
      setActions([...[{Name: 'Ask a question', Shortcut: ['ctrl', 'f']}], ...actions])
    })
  }

  useEffect(() => {
    fetchActions()
  }, [])

  useEffect(() => {
    console.log('actionSelected', actionSelected)
  }, [actionSelected])

  const backFromAction = () => {
    if (actionSelected) {
      setActionSelected(null)
      setTitle("Search Action")
    }
  }

  const backFromAddingAction = () => {
     setAddingAction(false)
    fetchActions()
  }

  const onClick = (action) => {
    setActionSelected(action)
    setTitle(action.Name)
  }

  if (addingAction) {
    return (
      <AddAction onBack={backFromAddingAction} />
    )
  }

  return (
    <ViewBase title={title} onBack={actionSelected ? backFromAction : null} buttons={[{text: 'Add new action', onClick: () => setAddingAction(true)}]}>
      {
        actionSelected
        ? <Chat action={actionSelected} />
        : actions.map((action, index) =>
            <ActionElement key={index} name={action.Name} shortcut={action.Shortcut} onClick={() => onClick(action)} />
        )
      }
    </ViewBase>
  )
}
