import {useEffect, useState} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';
import {HasSavedKey} from "../wailsjs/go/main/App";
import ApiKeyForm from './components/ApiKeyForm';
import Chat from './components/Chat';

function App() {
  const updateResultText = (result) => setResultText(result);
  const [hasApiKey, setHasApiKey] = useState(false);


  useEffect(() => {
    HasSavedKey().then((res) => {
      console.log(res)
      setHasApiKey(res)
    })
  }, [])


  return (
    <div id="App">
      { !hasApiKey
        ? <ApiKeyForm setHasApiKey={setHasApiKey}/>
        : <Chat />
      }
    </div>
  )
}

export default App
