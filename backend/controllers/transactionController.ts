import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
const { Transaction } = require("../models");
import { Transaction as TransactionType } from "../types/transaction";
import { validateTransaction } from "../utils/validation"; // Importer la fonction de validation

// Définir un type personnalisé pour les gestionnaires de requêtes
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createTransaction: AsyncRequestHandler = async (req, res) => {
  try {
    const { value, receiver, sender }: TransactionType = req.body;

    const validationError = validateTransaction(value, receiver, sender);
    if (validationError) {
       res.status(400).json(validationError);
    }

    const transaction = await Transaction.create({
      id: uuidv4(),
      value,
      timestamp: Date.now(),
      receiver,
      sender,
      confirmed: false,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error creating transaction" });
  }
};

export const updateTransaction: AsyncRequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
       res.status(404).json({ error: "Transaction not found" });
    }

    const validationError = validateTransaction(
      updates.value,
      updates.receiver,
      updates.sender
    );
    if (validationError) {
       res.status(400).json(validationError);
    }

    await transaction.update(updates);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error updating transaction" });
  }
};

export const getAllTransactions: AsyncRequestHandler = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

export const getTransactionById: AsyncRequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
       res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transaction" });
  }
};

export const getTransactionsByDateRange: AsyncRequestHandler = async (
  req,
  res
) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? Number(startDate) : 0;
    const end = endDate ? Number(endDate) : Date.now();

    const transactions = await Transaction.findAll({
      where: {
        timestamp: {
          [Op.between]: [start, end],
        },
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions by date range" });
  }
};
