const peer = new Peer(); // Crée un identifiant unique pour chaque client
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const usernameInput = document.getElementById("username");

let connections = []; // Liste des connexions avec les autres peers

// Afficher notre Peer ID
peer.on("open", (id) => {
  console.log("Mon Peer ID :", id);
  document.getElementById("peerId").textContent = id;
});

// Accepter les connexions entrantes
peer.on("connection", (connection) => {
  console.log("Connexion entrante de", connection.peer);
  connections.push(connection);

  // Lorsque la connexion est ouverte
  connection.on("open", () => {
    // Lors de la réception des messages
    connection.on("data", (data) => {
      addMessage(data.username, data.message);
    });
  });
});

// Se connecter à un autre Peer
document.getElementById("connect").addEventListener("click", () => {
  const remotePeerId = document.getElementById("remotePeerId").value.trim();
  if (remotePeerId) {
    const conn = peer.connect(remotePeerId);

    conn.on("open", () => {
      console.log("Connecté à", remotePeerId);
      connections.push(conn);
    });

    conn.on("data", (data) => {
      addMessage(data.username, data.message);
    });
  }
});

// Quand un utilisateur clique sur le bouton "Envoyer"
sendButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();
  if (username && message) {
    const chatMessage = { username, message };
    addMessage(username, message);

    // Envoyer le message à toutes les connexions actives
    if (connections.length > 0) {
      connections.forEach((conn) => {
        conn.send(chatMessage); // Envoyer à chaque peer
      });
    } else {
      // Si aucune connexion, on s'envoie le message à soi-même
      addMessage(username, message); // On s'affiche aussi le message localement
    }

    // Vider le champ de saisie du message
    messageInput.value = "";
  }
});

// Fonction pour afficher un message dans le chat
function addMessage(username, message) {
  const msgElement = document.createElement("p");
  msgElement.textContent = `${username}: ${message}`;
  chat.appendChild(msgElement);
  chat.scrollTop = chat.scrollHeight;
}
