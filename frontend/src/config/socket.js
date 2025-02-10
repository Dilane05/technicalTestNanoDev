import { io } from "socket.io-client";

// const API_URL = import.meta.env.VITE_API_URL;

const socket = io(import.meta.env.VITE_API_URL); 

socket.on("connect_error", (err) => {
  console.error("Erreur de connexion :", err);
});

socket.on("error", (err) => {
  console.error("Erreur Socket.IO :", err);
});

export default socket;
