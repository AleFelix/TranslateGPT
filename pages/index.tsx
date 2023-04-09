/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import mainStyles from "../styles/main-styles";
import darkStyles from "../styles/dark-styles";

export default function Home() {
  const [sessionID, setSessionID] = useState('');
  const [userFakeID, setUserFakeID] = useState('');
  const [message, setMessage] = useState('');
  const [messageHeader, setMessageHeader] = useState('Translate to english the following:');
  const [answer, setAnswer] = useState('');
  const [chatID, setChatID] = useState('0');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [intervalStarted, setIntervalStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copyMessageHidden, setCopyMessageHidden] = useState(true);
  const [clearMessageHidden, setClearMessageHidden] = useState(true);
  const [promptFontSize, setPromptFontSize] = useState('26px');
  const [answerFontSize, setAnswerFontSize] = useState('26px');

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
    } else if (result?.code_msg) {
      alert(result.code_msg);
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
      handleAnswerChange(result.resp_data.answer);
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

  const handleMessageChange = async (event: any) => {
    const message = event.target.value;
    setMessage(message);
    if (message.length < 16) {
      setPromptFontSize('26px');
    }
    if (message.length >= 16 && message.length < 64) {
      setPromptFontSize('24px');
    }
    if (message.length >= 64 && message.length < 128) {
      setPromptFontSize('20px');
    }
    if (message.length >= 128) {
      setPromptFontSize('18px');
    }
  }

  const handleAnswerChange = (answer: any) => {
    setAnswer(answer);
    if (answer.length < 16) {
      setAnswerFontSize('26px');
    }
    if (answer.length >= 16 && answer.length < 64) {
      setAnswerFontSize('24px');
    }
    if (answer.length >= 64 && answer.length < 128) {
      setAnswerFontSize('20px');
    }
    if (answer.length >= 128) {
      setAnswerFontSize('18px');
    }
  }

  const darkStylesCSS = darkMode ? darkStyles : ``;

  return (
    <>
      <link href="https://fonts.cdnfonts.com/css/roboto" rel="stylesheet"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
            crossOrigin="anonymous" referrerPolicy="no-referrer"/>
      <style jsx>{mainStyles}</style>
      <style jsx>{darkStylesCSS}</style>
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
                <div className={clearMessageHidden ? "clear-button-message hidden" : "clear-button-message"}>Cleared!
                </div>
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
              <textarea className="prompt-textarea textarea" style={{fontSize: promptFontSize}} value={message}
                        onChange={handleMessageChange}/>
              <button
                className={(waitingResponse || sendingMessage) ? "send-prompt-button rotate-and-scale" : "send-prompt-button"}
                onClick={handleButtonClick} disabled={waitingResponse || sendingMessage}>Send
              </button>
              <div className="answer-div textarea" style={{fontSize: answerFontSize}}>{answer}</div>
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