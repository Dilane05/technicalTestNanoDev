import express, { Request, Response } from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import { createServer } from 'http';
import transactionRoutes from './routes/transactionRoutes';
import { initSocket } from './config/socket';
import './services/transactionScheduler';
import { setupSwagger } from "./swaggerConfig";
import { scheduledJob } from './services/transactionScheduler';

import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Intégration Swagger
setupSwagger(app);

// Routes
app.use('/api', transactionRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Welcome To Technical Test!');
});

// Création du serveur HTTP pour Socket.io
const server = createServer(app);

// Initialisation de Socket.IO avec le serveur
initSocket(server);

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});


export { app, server, scheduledJob };