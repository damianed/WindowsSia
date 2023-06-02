import {useEffect, useState} from "react";
import ViewBase from "./ViewBase";
import {GetActions} from "../../wailsjs/go/main/App";
import Chat from "./Chat";
import AddAction from "./AddAction";

function ActionElement ({name, shortcut, onClick}) {
  return (
    <div className="flex justify-between px-3 py-2 mx-5 mb-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={onClick}>
      <span>{name}</span>
      <div className="space-x-1">
        {[...shortcut.mods, ...shortcut.key].map((key, index) => {
          return <span key={index} className="px-2 py-1 bg-gray-900">{key.toLowerCase()}</span>
        })}
      </div>
    </div>
  )
}

export default function Main() {
  const [actions, setActions] = useState([]);
  const [currentActions, setCurrentActions] = useState([])
  const [actionSelected, setActionSelected] = useState(null)
  const [addingAction, setAddingAction] = useState(false)
  const [title, setTitle] = useState("Search Action")
  const [search, setSearch] = useState('')
  const updateSearch = (e)  => setSearch(e.target.value)

  const fetchActions = () => {
    GetActions().then((actions) => {
      if (actions === null) {
        actions = {}
      }

      const allActions = Object.values(actions).sort((a, b) => b.Id - a.Id)
      console.log('actions', allActions)
      setActions(allActions)
      setCurrentActions(allActions)
    })
  }

  useEffect(() => {
    window.runtime.EventsOn('actionShortcut', (action) => {
      console.log('event', action)
      setActionSelected(action)
    })

    fetchActions()
  }, [])

  useEffect(() => {
    setCurrentActions(actions.filter((action) => action.Name.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  useEffect(() => {
    if (actionSelected === null) {
      setTitle("Search Action") 
      return
    }

    setTitle(actionSelected.Name)
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
      <AddAction onBack={backFromAddingAction} usedShortcuts={actions.map((action) => action.Shortcut)} />
    )
  }

  return (
    <ViewBase title={title} onBack={actionSelected ? backFromAction : null} buttons={[{text: 'Add new action', onClick: () => setAddingAction(true)}]}>
      {
        actionSelected
        ? <Chat action={actionSelected.id === -1 ? null : actionSelected} />
        :
        (
          <>
            <input type="text" className="flex p-1 mx-5 mb-4 bg-gray-700 rounded-lg" placeholder="Search action..." search={search} onChange={updateSearch}></input>
            {currentActions.map((action, index) => {
                if (index === 0) {
                  return <ActionElement key={index} name={action.Name} shortcut={action.Shortcut} onClick={() => onClick(action)} />
                }
                return <ActionElement key={index} name={action.Name} shortcut={action.Shortcut} onClick={() => onClick(action)} />
              }
            )}
          </>
        )
      }
    </ViewBase>
  )
}
