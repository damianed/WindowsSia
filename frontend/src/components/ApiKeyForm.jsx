import {useEffect, useState} from 'react';
import {SaveOpenAIKey} from "../../wailsjs/go/main/App";

function ApiKeyForm({setHasApiKey}) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const updateKey = (e) => setApiKey(e.target.value);

  function saveKey() {
    setLoading(true);
    if (apiKey != '') {
      SaveOpenAIKey(apiKey).then((errorMsg) => {
        console.log('error', errorMsg);
        if (errorMsg != '') {
          setError(errorMsg);
        } else {
          setHasApiKey(true)
        }
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    setError('')
  }, [apiKey]);

  return (
    <>
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
      <button className="btn" disabled={loading} onClick={saveKey}>Continue</button>
    </>
  )
}

export default ApiKeyForm;
