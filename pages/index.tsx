/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';

export default function Home() {
  const [sessionID, setSessionID] = useState('');
  const [userFakeID, setUserFakeID] = useState('');
  const [message, setMessage] = useState('');
  const [messageHeader, setMessageHeader] = useState('Traducir al ingles lo siguiente:');
  const [answer, setAnswer] = useState('');
  const [chatID, setChatID] = useState('0');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [intervalStarted, setIntervalStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copyMessageHidden, setCopyMessageHidden] = useState(true);
  const [clearMessageHidden, setClearMessageHidden] = useState(true);

  useEffect(() => {
    void getSessionData();
    const isDarkMode = localStorage.getItem('darkMode');
    if (isDarkMode === null) {
      setDarkMode(true);
      localStorage.setItem('darkMode', 'true');
    } else {
      setDarkMode(JSON.parse(isDarkMode));
    }
  }, []);

  useEffect(() => {
    if (intervalStarted || !sessionID || !userFakeID) {
      return;
    }
    setInterval(() => {
      void keepSessionAlive();
    }, 30000);
    setIntervalStarted(true);
  }, [sessionID, userFakeID]);

  const getSessionData = async () => {
    const response = await fetch('/api/get-session-data');
    const {session_id: sessionID, user_fake_id: userFakeID} = await response.json();
    setSessionID(sessionID);
    setUserFakeID(userFakeID);
    console.log('sessionID', sessionID);
    console.log('userFakeID', userFakeID);
  };

  const keepSessionAlive = async () => {
    console.log('sessionID', sessionID);
    console.log('userFakeID', userFakeID);
    await fetch('/api/keep-session-alive', {
      method: 'POST',
      body: JSON.stringify({session_id: sessionID, user_fake_id: userFakeID}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const sendMessage = async () => {
    setSendingMessage(true);
    const response = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionID,
        user_fake_id: userFakeID,
        question: messageHeader + "\n\n" + message,
        parent_id: chatID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (result?.resp_data?.chat_id) {
      setChatID(result.resp_data.chat_id);
      setWaitingResponse(true);
    }
    setSendingMessage(false);
  }

  useEffect(() => {
    if (!waitingResponse) {
      return;
    }
    const interval = setInterval(() => {
      void readResponse();
    }, 2000);
    return () => clearInterval(interval);
  }, [waitingResponse]);

  const readResponse = async () => {
    const response = await fetch('/api/read-response', {
      method: 'POST',
      body: JSON.stringify({session_id: sessionID, user_fake_id: userFakeID, parent_id: chatID}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (result?.resp_data?.answer) {
      setAnswer(result.resp_data.answer);
    }
    if (result?.resp_data?.status === 3 || result?.resp_data?.status != 1) {
      setWaitingResponse(false);
    }
  }

  const handleButtonClick = async () => {
    await sendMessage();
  };

  const handleDarkModeClick = async () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  }

  const handleCopyClick = async () => {
    setCopyMessageHidden(false);
    setTimeout(() => {
      setCopyMessageHidden(true);
    }, 500);
    await navigator.clipboard.writeText(answer);
  }

  const handleClearClick = async () => {
    setClearMessageHidden(false);
    setTimeout(() => {
      setClearMessageHidden(true);
    }, 500);
    setMessage('');
  }

  return (
    <>
      <link href="https://fonts.cdnfonts.com/css/roboto" rel="stylesheet"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
            crossOrigin="anonymous" referrerPolicy="no-referrer"/>
      <style>
        {`
          .container-gpt {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #fafafa;
          }
          .dark-mode-button-container {
            display: block;
            padding: 20px;
            position: absolute;
            top: 0;
            right: 0;
          }
          .title-gpt {
            font-family: Roboto, Arial;
            font-size: 36px;
            font-weight: 700;
            color: #000000;
            margin: 30px;
          }
          .prompt-header-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .prompt-header {
            margin: 10px;
            width: 30%;
            height: 50px;
            font-family: Roboto, Arial;
            font-size: 16px;
            background-color: #FFFFFF;
            border: 1px solid #CCCCCC;
            color: #000000;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.37);
          }
          .main-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 80%;
            width: 100%;
          }
          .textarea {
            margin: 10px;
            width: 100%;
            height: 100%;
            font-family: Roboto, Arial;
            font-size: 16px;
            background-color: #FFFFFF;
            border: 1px solid #CCCCCC;
            color: #000000;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.37);
          }
          .send-prompt-button {
            margin: 10px;
            font-family: Roboto, Arial;
            font-size: 16px;
            background-color: #4CAF50;
            color: #FFFFFF;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 8px;
          }
          .rotate-and-scale {
            animation: rotate-and-scale 1s ease-in-out infinite;
          }
          @keyframes rotate-and-scale {
            0% {
              transform: scale(1) rotate(0deg);
            }
            50% {
              transform: scale(1.2) rotate(180deg);
            }
            100% {
              transform: scale(1) rotate(360deg);
            }
          }
          .send-prompt-button:hover {
            background-color: #3E8E41;
          }
          .send-prompt-button:disabled {
            background-color: #CCCCCC;
            cursor: default;
          }
          .answer-div {
            background-color: #f5f5f5;
            cursor: text;
          }
          .top-buttons-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: end;
            justify-content: space-between;
            padding: 10px;
            min-height: 70px;
          }
          .prompt-textarea-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: center;
            height: 100%;
            align-items: center;
          }
          .prompts-and-buttons-container {
            display: flex;
            width: 70%;
            flex-direction: column;
            height: 80%;
            justify-content: center;
            align-items: center;
          }
          .copy-button:hover {
            color: #4CAF50;
          }
          .clear-button:hover {
            color: #AF4C4C;
          }
          .copy-button-container {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
          }
          .clear-button-container {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .copy-button-message {
            margin-right: -20px;
            opacity: 0;
            animation: animation-fade-out-bottom-to-top 0.5s ease-in-out;
          }
          .clear-button-message {
            margin-left: -20px;
            opacity: 0;
            animation: animation-fade-out-bottom-to-top 0.5s ease-in-out;
          }
          @keyframes animation-fade-out-bottom-to-top {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-100%);
            }
          }
          .loading-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            opacity: 0.5;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
          .lds-ellipsis {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .lds-ellipsis div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: #4CAF50;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
          }
          @keyframes lds-ellipsis1 {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes lds-ellipsis3 {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(0);
            }
          }
          @keyframes lds-ellipsis2 {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(24px, 0);
            }
          }
          .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .letter-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-family: Roboto, Arial;
            font-size: 64px;
            color: #4CAF50;
            font-weight: bold;
          }
          .letter-container div {
            margin: 5px;
            animation: letter 1.2s infinite;
          }
          @keyframes letter {
            0% {
              transform: translate(0px);
            }
            25% {
              transform: translate(1px);
            }
            50% {
              transform: translate(1px);
              }
            75% {
              transform: translate(20px);
              }
            100% {
              transform: translate(0px);
              }
          }
          .letter-container div:nth-child(1) {
            animation-delay: 0s;
          }
          .letter-container div:nth-child(2) {
            animation-delay: 0.2s;
          }
          .letter-container div:nth-child(3) {
            animation-delay: 0.4s;
          }
          .letter-container div:nth-child(4) {
            animation-delay: 0.6s;
          }
      `}
        {darkMode && `
        .container-gpt {
          background-color: #111827;
          color: #FFFFFF;
        }
        .title-gpt {
          color: #FFFFFF;
        }
        .prompt-header {
          background-color: #1f2937;
          color: #FFFFFF;
          border: none;
        }
        .textarea {
          background-color: #1f2937;
          color: #FFFFFF;
          border: none;
        }
        .send-prompt-button {
          background-color: #1f2937;
          color: #FFFFFF;
        }
        .send-prompt-button:hover {
          background-color: #11151c;
        }
        .send-prompt-button:disabled {
          background-color: #11151c;
          cursor: default;
        }
        .answer-div {
          background-color: #19212d;
          color: #FFFFFF;
        }
        .dark-mode-button {
          color: #FFFFFF;
        }
        .loading-container {
          background-color: #1f2937;
          color: #FFFFFF;
        }
        .lds-ellipsis div {
          background: #FFFFFF;
        }
        .letter-container {
          color: #FFFFFF;
        }
      `}
      </style>
      <div className="container-gpt">
        <div className="dark-mode-button-container">
          <button className="dark-mode-button" onClick={handleDarkModeClick}>
            {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>
        </div>
        <h1 className="title-gpt">TranslateGPT</h1>
        <div className="prompt-header-container">
          <input className="prompt-header" type="text" placeholder="Prompt header" value={messageHeader}
                 onChange={(e) => setMessageHeader(e.target.value)}/>
        </div>
        <div className="main-container">
          <div className="prompts-and-buttons-container">
          <div className="top-buttons-container">
            <div className="clear-button-container">
              <div className={clearMessageHidden ? "clear-button-message hidden" : "clear-button-message"}>Cleared!</div>
              <button className="clear-button" onClick={handleClearClick}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="copy-button-container">
              <div className={copyMessageHidden ? "copy-button-message hidden" : "copy-button-message"}>Copied!</div>
              <button className="copy-button" onClick={handleCopyClick}>
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div className="prompt-textarea-container">
            <textarea className="prompt-textarea textarea" value={message}
                      onChange={(e) => setMessage(e.target.value)}/>
            <button
              className={(waitingResponse || sendingMessage) ? "send-prompt-button rotate-and-scale" : "send-prompt-button"}
              onClick={handleButtonClick} disabled={waitingResponse || sendingMessage}>Enviar
            </button>
            <div className="answer-div textarea">{answer}</div>
          </div>
          </div>
        </div>
        {(waitingResponse || sendingMessage) &&
            <div className="loading-container">
                <div className="letter-container">
                    <div>M</div>
                    <div>A</div>
                    <div>X</div>
                    <div>I</div>
                </div>
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        }
      </div>
    </>
  );
}