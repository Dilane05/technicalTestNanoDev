import { Router } from 'express';
import {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getTransactionById,
} from '../controllers/transactionController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - value
 *         - timestamp
 *         - receiver
 *         - sender
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique de la transaction
 *         value:
 *           type: number
 *           description: Montant de la transaction
 *         timestamp:
 *           type: number
 *           description: Horodatage de la transaction
 *         receiver:
 *           type: string
 *           description: Destinataire de la transaction
 *         sender:
 *           type: string
 *           description: Émetteur de la transaction
 *         confirmed:
 *           type: boolean
 *           description: Statut de confirmation de la transaction
 *           default: false
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Créer une nouvelle transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - timestamp
 *               - receiver
 *               - sender
 *             properties:
 *               value:
 *                 type: number
 *               timestamp:
 *                 type: number
 *               receiver:
 *                 type: string
 *               sender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Données de transaction invalides
 */
router.post('/transactions', createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Mettre à jour une transaction existante
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la transaction à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               confirmed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Transaction mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction non trouvée
 *       400:
 *         description: Données de mise à jour invalides
 */
router.put('/transactions/:id', updateTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Récupérer toutes les transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Liste des transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/transactions', getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Récupérer une transaction par ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la transaction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction non trouvée
 */
router.get('/transactions/:id', getTransactionById);

export default router;