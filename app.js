const peer = new Peer(); // Crée un identifiant unique pour chaque client
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const usernameInput = document.getElementById("username");

let conn; // Connexion avec un autre peer

// Afficher notre Peer ID
peer.on("open", (id) => {
  console.log("Mon Peer ID :", id);
  document.getElementById("peerId").textContent = id;
});

// Se connecter à un autre Peer
document.getElementById("connect").addEventListener("click", () => {
  const remotePeerId = document.getElementById("remotePeerId").value.trim();
  if (remotePeerId) {
    conn = peer.connect(remotePeerId);

    conn.on("open", () => {
      console.log("Connecté à", remotePeerId);

      sendButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        if (username && message) {
          const chatMessage = { username, message };
          conn.send(chatMessage);
          addMessage(username, message);
          messageInput.value = "";
        }
      });

      conn.on("data", (data) => {
        addMessage(data.username, data.message);
      });
    });
  }
});

// Accepter les connexions entrantes
peer.on("connection", (connection) => {
  conn = connection;
  console.log("Connexion entrante de", conn.peer);

  conn.on("data", (data) => {
    addMessage(data.username, data.message);
  });
});

// Fonction pour afficher un message dans le chat
function addMessage(username, message) {
  const msgElement = document.createElement("p");
  msgElement.textContent = `${username}: ${message}`;
  chat.appendChild(msgElement);
  chat.scrollTop = chat.scrollHeight;
}
