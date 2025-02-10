import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
const { Transaction } = require("../models");
import { Transaction as TransactionType } from "../types/transaction";
import { validateTransaction } from "../utils/validation";

// Correction du type pour correspondre au retour des fonctions
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export const createTransaction: RequestHandler = async (req, res) => {
  try {
    const { value, receiver, sender }: TransactionType = req.body;

    const validationError = validateTransaction(value, receiver, sender);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const transaction = await Transaction.create({
      id: uuidv4(),
      value,
      timestamp: Date.now(),
      receiver,
      sender,
      confirmed: false,
    });
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: "Error creating transaction" });
  }
};

export const updateTransaction: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (updates.value || updates.receiver || updates.sender) {
      const validationError = validateTransaction(
        updates.value || transaction.value,
        updates.receiver || transaction.receiver,
        updates.sender || transaction.sender
      );
      if (validationError) {
        return res.status(400).json(validationError);
      }
    }

    await transaction.update(updates);
    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ error: "Error updating transaction" });
  }
};

export const getAllTransactions: RequestHandler = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching transactions" });
  }
};

export const getTransactionById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching transaction" });
  }
};
