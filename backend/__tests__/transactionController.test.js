import request from 'supertest';
import express from 'express';
import { createTransaction } from '../src/controllers/transactionController'; // Assurez-vous que le chemin est correct

const app = express();
app.use(express.json());
app.post('/api/transactions', createTransaction);

describe('Transaction Controller Tests', () => {
  test('should create a new transaction', async () => {
    const response = await request(app)
      .post('/api/transactions')
      .send({
        value: 100,
        receiver: 'receiver-1',
        sender: 'sender-1',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.value).toBe(100);
    expect(response.body.receiver).toBe('receiver-1');
    expect(response.body.sender).toBe('sender-1');
  });
});