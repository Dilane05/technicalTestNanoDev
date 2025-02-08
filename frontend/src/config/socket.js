import { io } from "socket.io-client";

const socket = io(`http://localhost:3010`); // Mettez l'URL correcte en production

socket.on("connect_error", (err) => {
  console.error("Erreur de connexion :", err);
});

socket.on("error", (err) => {
  console.error("Erreur Socket.IO :", err);
});

export default socket;
