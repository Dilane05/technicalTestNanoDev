import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";
const { Transaction } = require("../models");
// const { getSocket } = require("../config/socket");

const generateMockTransaction = () => {
  return {
    id: uuidv4(),
    value: Math.floor(Math.random() * 1000) + 1, // S'assurer que le montant est positif et entier
    timestamp: Date.now(),
    receiver: `receiver-${Math.floor(Math.random() * 100)}`,
    sender: `sender-${Math.floor(Math.random() * 100)}`,
    confirmed: false,
  };
};

const confirmTransaction = async (transaction: any) => {
  try {
    await Transaction.update(
      { confirmed: true },
      { where: { id: transaction.id } }
    );

    // Vérifier que le socket est disponible avant d’émettre un événement
//     const socket = getSocket();
//     if (socket) {
//       socket.emit("transactionConfirmed", { id: transaction.id });
//     } else {
//       console.error("Socket not available, unable to emit transactionConfirmed event");
//     }
  } catch (error) {
    console.error("Error confirming transaction:", error);
  }
};

// Planifier la création de transactions toutes les minutes
schedule.scheduleJob("*/1 * * * *", async () => {
  try {
    const mockTransaction = generateMockTransaction();
    const transaction = await Transaction.create(mockTransaction);

    // Vérifier que le socket est disponible avant d’émettre un événement
//     const socket = getSocket();
//     if (socket) {
//       socket.emit("transactionCreated", { id: transaction.id });
//     } else {
//       console.error("Socket not available, unable to emit transactionCreated event");
//     }

    // Planifier la confirmation après 10 secondes
    setTimeout(() => confirmTransaction(transaction), 10000);
  } catch (error) {
    console.error("Error creating mock transaction:", error);
  }
});
