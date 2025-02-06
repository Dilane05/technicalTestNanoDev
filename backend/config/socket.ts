import { Server, Socket } from 'socket.io';  // Importation des types nécessaires

let io: Server;

// Liste des origines autorisées
const allowedOrigins = [
  "http://localhost:5174", // Origine de développement
  "https://vercel.technicalnanotest.com" // Origine de production
];

// Fonction pour initialiser Socket.IO
const initSocket = (server: any): Server => {  // Typage de `server` comme `any` pour simplifier
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Autorise l'origine si elle est dans la liste
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("Origine non autorisée :", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true, // Si vous utilisez des cookies
    },
  });

  // Gérer les connexions des utilisateurs
  io.on("connection", (socket: Socket) => {  // Typage de `socket` comme `Socket`
    console.log("Utilisateur connecté :", socket.id);

    socket.on("clientError", (error: string) => {  // Typage de `error` comme `string`
      console.error("Erreur côté client : ", error);
      socket.destroy(); // Fermer correctement le socket en cas d'erreur
    });

    // Exemple d'écoute d'événements
    socket.on("sendMessage", (data: any) => {  // Typage de `data` comme `any` ou un type spécifique
      console.log("Message reçu :", data);
      // Diffuser à tous les clients
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", (reason: string) => {  // Typage de `reason` comme `string`
      console.log(`Utilisateur déconnecté : ${socket.id}, raison : ${reason}`);
    });
  });

  return io;
};

// Fonction pour obtenir l'instance de Socket.IO
const getSocket = (): Server => {  // Typage de la fonction pour retourner `Server`
  if (!io) {
    throw new Error(
      "Socket.IO n'a pas été initialisé. Appelez initSocket d'abord."
    );
  }
  return io;
};

export { initSocket, getSocket };  // Utilisation de `export` pour TypeScript
