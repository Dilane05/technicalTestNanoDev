const request = require('supertest');
const { createServer } = require('http');
const { app, scheduledJob } = require('../../index');
const db = require('../../models');
const { Transaction } = require('../../models');
const { Server } = require('socket.io');
const { io: ioClient } = require('socket.io-client');

describe('Transaction Integration Tests', () => {
  let server;
  let io;
  let port;

  beforeAll(async () => {
    jest.setTimeout(60000);
    await db.sequelize.sync({ force: true });
    
    // Créer un serveur HTTP séparé pour les tests
    server = createServer(app);
    port = 3011; 
    server.listen(port);
    
    io = new Server(server, {
      cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"]
      }
    });
  });

  afterAll(async () => {
    // Fermer proprement toutes les ressources
    await db.sequelize.close();
    io.close(); 
    scheduledJob.cancel(); // Annuler le job planifié
    await new Promise(resolve => server.close(resolve)); // Fermer le serveur
  });

  beforeEach(async () => {
    await Transaction.destroy({ where: {} });
  });

  describe('Transaction Flow Tests', () => {
    test('should handle complete transaction lifecycle', async () => {
      const createResponse = await request(app)
        .post('/api/transactions')
        .send({
          value: 1000,
          timestamp: Date.now(),
          receiver: 'receiver@test.com',
          sender: 'sender@test.com'
        });

      expect(createResponse.status).toBe(201);
      const transactionId = createResponse.body.id;

      // Vérifier la création
      const getResponse = await request(app)
        .get(`/api/transactions/${transactionId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.confirmed).toBe(false);

      // Mettre à jour
      const updateResponse = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .send({ confirmed: true });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.confirmed).toBe(true);

      // Vérifier la mise à jour
      const listResponse = await request(app)
        .get('/api/transactions');
      const updatedTransaction = listResponse.body.find(t => t.id === transactionId);
      expect(updatedTransaction.confirmed).toBe(true);
    }); 
  });
});