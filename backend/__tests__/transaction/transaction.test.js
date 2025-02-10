const request = require('supertest');
const { app, server, scheduledJob } = require('../../index');
const db = require('../../models');
const { Transaction } = db;

describe('Transaction API Tests', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fermer proprement toutes les ressources
    await db.sequelize.close();
    scheduledJob.cancel(); // Annuler le job planifié
    await new Promise(resolve => server.close(resolve)); // Fermer le serveur
  });

  beforeEach(async () => {
    await Transaction.destroy({ where: {} }); // Nettoie les données avant chaque test
  });

  describe('POST /api/transactions', () => {
    const validTransaction = {
      value: 1000,
      timestamp: Date.now(),
      receiver: 'receiver@test.com',
      sender: 'sender@test.com'
    };

    test('should create a new transaction with valid data', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send(validTransaction);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.confirmed).toBe(false);
      expect(response.body.value).toBe(validTransaction.value);
    });

    test('should fail to create transaction with missing required fields', async () => {
      const invalidTransaction = {
        value: 1000
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidTransaction);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Créer quelques transactions de test
      await Transaction.bulkCreate([
        {
          value: 1000,
          timestamp: Date.now(),
          receiver: 'receiver1@test.com',
          sender: 'sender1@test.com',
          confirmed: false
        },
        {
          value: 2000,
          timestamp: Date.now(),
          receiver: 'receiver2@test.com',
          sender: 'sender2@test.com',
          confirmed: true
        }
      ]);
    });

    test('should return all transactions', async () => {
      const response = await request(app).get('/api/transactions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/transactions/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      testTransaction = await Transaction.create({
        value: 1000,
        timestamp: Date.now(),
        receiver: 'receiver@test.com',
        sender: 'sender@test.com',
        confirmed: false
      });
    });

    test('should return transaction by id', async () => {
      const response = await request(app)
        .get(`/api/transactions/${testTransaction.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTransaction.id);
    });

    test('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/transactions/999999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let testTransaction;

    beforeEach(async () => {
      testTransaction = await Transaction.create({
        value: 1000,
        timestamp: Date.now(),
        receiver: 'receiver@test.com',
        sender: 'sender@test.com',
        confirmed: false
      });
    });

    test('should update transaction', async () => {
      const updateData = {
        value: 2000,
        confirmed: true
      };

      const response = await request(app)
        .put(`/api/transactions/${testTransaction.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.value).toBe(updateData.value);
      expect(response.body.confirmed).toBe(updateData.confirmed);
    });

    test('should return 404 for updating non-existent transaction', async () => {
      const response = await request(app)
        .put('/api/transactions/999999')
        .send({ value: 2000 });

      expect(response.status).toBe(404);
    });
  });

});