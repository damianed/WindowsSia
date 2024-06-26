import {useState} from "react";
import {SendMessage} from "../../wailsjs/go/main/App"

function UserIcon({ color = "#ffffff" }) {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="16.000000pt" height="16.000000pt" viewBox="0 0 16.000000 16.000000"
    preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,16.000000) scale(0.100000,-0.100000)"
      fill={color} stroke="none">
      <path d="M46 138 c-11 -15 -12 -26 -5 -40 8 -16 5 -24 -15 -45 -14 -14 -26
      -32 -26 -39 0 -22 10 -16 20 11 20 52 100 52 120 0 10 -27 20 -33 20 -11 0 7
      -12 25 -26 39 -20 21 -23 29 -15 45 13 24 -11 62 -39 62 -10 0 -26 -10 -34
      -22z m52 3 c8 -4 12 -19 10 -32 -4 -34 -52 -34 -56 0 -5 32 20 49 46 32z"/>
      </g>
    </svg>
  )
}

function Chat({ action = null }) {
  const [message, setMessage] = useState("")
  const updateMessage = (e) => setMessage(e.target.value)
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const initialPrompt = action === null ? {} : {Role: 'user', 'Content': action.Prompt}

  console.log(action)
  function onSend() {
    let messageObj = {'Role': 'user', 'Content': message}
    setChatHistory([...chatHistory, messageObj])
    let messages = []

    if (action == null) {
      messages = [...chatHistory, messageObj]
    } else {
      messages = [messageObj]
    }

    setLoading(true)
    setMessage("")
    SendMessage(messages, (action?.Id ?? -1 )).then((res) => {
      setChatHistory((chatHistory) => [...chatHistory, {'Role': 'assistant', 'Content': res}])
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-full px-2 text-left">
        <div className="w-full px-5 py-3 overflow-y-scroll h-4/6 mb-50 bg-slate-900">
          <>
            {
              initialPrompt &&
              <div className="flex flex-row">
                <div className="mb-10 ml-5 text-gray-400">
                  {initialPrompt.Content}
                </div>
              </div>
            }
            {
              chatHistory.map((item, index) => {
                return (
                  <div key={index} className="flex flex-row">
                    {
                      item.Role == 'user'
                      ? <UserIcon />
                      : <UserIcon color="#000000"/>
                    }
                    <div className={`mb-10 ml-5 ${item.Role === 'user' ? 'text-gray-300' : 'text-white'}`} key={index}>
                      {item.Content}
                    </div>
                 </div>
                )
              })
            }
          </>
        </div>
      </div>
      <div className="fixed flex flex-row w-full px-2 py-3 bottom-12 h-1/6 max-h-24">
        <div className="flex w-full px-4 py-3 text-center text-white bg-slate-900">
          <textarea onChange={updateMessage} value={message} className="w-full p-2 bg-transparent border rounded-lg border-slate-400"></textarea>
          <button onClick={onSend} disabled={loading} className={`h-8 my-auto ml-3 font-bold bg-transparent ${loading ? 'text-slate-500' : 'text-slate-400'}`}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat;
