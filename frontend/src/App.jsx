import {useEffect, useState} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';
import {SaveOpenAIKey} from "../wailsjs/go/main/App";

function App() {
    const [resultText, setResultText] = useState("Please enter your api key below");
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const updateKey = (e) => setApiKey(e.target.value);
    const updateResultText = (result) => setResultText(result);

    useEffect(() => {
      setError('')
    }, [apiKey]);

    function saveKey() {
      console.log('apikey', apiKey)
      if (apiKey != '') {
        SaveOpenAIKey(apiKey).then(setError);
      }
    }

    return (
        <div id="App">
        {/* <img src={logo} id="logo" alt="logo"/> */}
          <h2 id="result" className="result">Set your OpenAi key</h2>
          <div id="openai">
            <div>You need an OpenAI key to use {"name"}, it is stored locally and never sent anywhere else but to OpenAI.</div>
            <div>Get yours <a href="https://platform.openai.com/account/api-keys">here</a></div>
          </div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateKey} autoComplete="off" name="input" type="text"/>
                <div id="error">
                  {
                    error !== '' && <span>{error}</span>
                  }
                </div>
            </div>
            <button className="btn" onClick={saveKey}>Continue</button>
        </div>
    )
}

export default App
