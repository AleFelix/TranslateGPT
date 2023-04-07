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
  const [intervalStarted, setIntervalStarted] = useState(false);

  useEffect(() => {
    void getSessionData();
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
    const { session_id: sessionID, user_fake_id: userFakeID } = await response.json();
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
      body: JSON.stringify({ session_id: sessionID, user_fake_id: userFakeID }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const sendMessage = async () => {
    const response = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionID, user_fake_id: userFakeID, question: messageHeader + "\n\n" + message, parent_id: chatID }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (result?.resp_data?.chat_id) {
      setChatID(result.resp_data.chat_id);
      setWaitingResponse(true);}
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
      body: JSON.stringify({ session_id: sessionID, user_fake_id: userFakeID, parent_id: chatID }),
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

  return (
    <div className="container-gpt">
      <link href="https://fonts.cdnfonts.com/css/roboto" rel="stylesheet"></link>
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
            flex-direction: row;
            align-items: center;
            justify-content: center;
            height: 80%;
            width: 100%;
          }
          .textarea {
            margin: 10px;
            width: 30%;
            height: 70%;
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
            cursor: default;
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
      </style>
      <h1 className="title-gpt">TranslateGPT</h1>
      <div className="prompt-header-container">
        <input className="prompt-header" type="text" placeholder="Prompt header" value={messageHeader} onChange={(e) => setMessageHeader(e.target.value)} />
      </div>
      <div className="main-container">
        <textarea className="prompt-textarea textarea" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className={waitingResponse ? "send-prompt-button rotate-and-scale" : "send-prompt-button"} onClick={handleButtonClick} disabled={waitingResponse}>Enviar</button>
        <div className="answer-div textarea">{answer}</div>
      </div>
      {waitingResponse &&
          <div className="loading-container">
              <div className="letter-container">
                  <div>M</div>
                  <div>A</div>
                  <div>X</div>
                  <div>I</div>
              </div>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>
      }
    </div>
  );
}