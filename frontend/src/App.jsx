import {useEffect, useState} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';
import {HasSavedKey} from "../wailsjs/go/main/App";
import ApiKeyForm from './components/ApiKeyForm';
import Main from './components/Main';

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    HasSavedKey().then((res) => {
      console.log(res)
      setHasApiKey(res)
    })
  }, [])


  return (
    <div id="App" className="h-screen overflow-y-hidden">
      {
        !hasApiKey
        ? <ApiKeyForm setHasApiKey={setHasApiKey}/>
        : <Main />
      }
    </div>
  )
}

export default App
