import css from 'styled-jsx/css';

export default css`
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
    font-family: Roboto, Arial, sans-serif;
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
    font-family: Roboto, Arial, sans-serif;
    font-size: 20px;
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
    font-family: Roboto, Arial, sans-serif;
    font-size: 20px;
    background-color: #FFFFFF;
    border: 1px solid #CCCCCC;
    color: #000000;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.37);
  }
  .send-prompt-button {
    margin: 10px;
    font-family: Roboto, Arial, sans-serif;
    font-size: 20px;
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
    font-family: Roboto, Arial, sans-serif;
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
`