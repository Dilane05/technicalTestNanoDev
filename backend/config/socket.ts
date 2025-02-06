import { Server, Socket } from 'socket.io';

let io: Server;

const allowedOrigins = [
  "http://localhost:5174",
  "https://vercel.technicalnanotest.com"
];

const initSocket = (server: any): Server => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("Origine non autorisée :", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Utilisateur connecté :", socket.id);

    socket.on("clientError", (error: string) => {
      console.error("Erreur côté client : ", error);
      socket.disconnect(); // Utiliser disconnect() au lieu de destroy()
    });

    socket.on("sendMessage", (data: any) => {
      console.log("Message reçu :", data);
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", (reason: string) => {
      console.log(`Utilisateur déconnecté : ${socket.id}, raison : ${reason}`);
    });
  });

  return io;
};

const getSocket = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO n'a pas été initialisé. Appelez initSocket d'abord."
    );
  }
  return io;
};

export { initSocket, getSocket };