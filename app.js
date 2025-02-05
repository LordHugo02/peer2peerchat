const ws = new WebSocket("ws://localhost:8080");
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const usernameInput = document.getElementById("username");

sendButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();
  if (username && message) {
    const chatMessage = JSON.stringify({ username, message });
    ws.send(chatMessage);
    messageInput.value = "";
  }
});

ws.onmessage = (event) => {
  event.data
    .text()
    .then((text) => {
      const { username, message } = JSON.parse(text);
      const msgElement = document.createElement("p");
      msgElement.textContent = `${username}: ${message}`;
      chat.appendChild(msgElement);
      chat.scrollTop = chat.scrollHeight;
    })
    .catch((err) =>
      console.error("Erreur lors de la lecture du message :", err)
    );
};
