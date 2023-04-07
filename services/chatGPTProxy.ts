import fetch from 'node-fetch';

function callChatGPTProxyApi(endpointName: any, data: any) {
  return fetch("https://chatgptproxy.me/api/v1" + endpointName, {
    "headers": [
      ["User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0"],
      ["Accept", "application/json, text/plain, */*"],
      ["Accept-Language", "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3"],
      ["Content-Type", "application/json"],
    ],
    "referrer": "https://chatgptproxy.me/",
    "body": JSON.stringify({
      "data": data
    }),
    "method": "POST"
  });
}

function generateRandomString(maxLength = 16) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < maxLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function generateSessionData() {
  return {
    "session_id": generateRandomString(16),
    "user_fake_id": generateRandomString(16)
  };
}

export async function keepSessionAlive(sessionID: string, userFakeID: string) {
  let response = await callChatGPTProxyApi("/chat/heart", {
    "session_id": sessionID,
    "user_fake_id": userFakeID
  });
  return await response.json();
}

export async function sendMessage(sessionID: string, userFakeID: string, question: string, parentID: string) {
  let response = await callChatGPTProxyApi("/chat/conversation", {
    "parent_id": parentID,
    "session_id": sessionID,
    "user_fake_id": userFakeID,
    "question": question
  });
  return await response.json();
}

export async function readResponse(sessionID: string, userFakeID: string, parentID: string) {
  const response = await callChatGPTProxyApi("/chat/result", {
    "chat_id": parentID,
    "session_id": sessionID,
    "user_fake_id": userFakeID
  });
  return await response.json();
}