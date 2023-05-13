import {useEffect, useState} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';
import {HasSavedKey} from "../wailsjs/go/main/App";
import ApiKeyForm from './components/ApiKeyForm';
import Chat from './components/Chat';
import AddAction from './components/AddAction';

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    HasSavedKey().then((res) => {
      console.log(res)
      setHasApiKey(res)
    })
  }, [])


  return (
    <div id="App" className="h-screen">
      { !hasApiKey
        ? <ApiKeyForm setHasApiKey={setHasApiKey}/>
        : <AddAction />
      }
    </div>
  )
}

export default App
