import request from "supertest";
import { app } from "../index";
import schedule, { Job } from "node-schedule";
import { Server } from "http";  // Importer Server depuis 'http'

describe("Transaction API", () => {
  let transactionId: string;
  let server: Server;
  let job: Job;

  beforeAll(() => {
    server = app.listen(3000, () => {
      console.log('Test server running on http://localhost:3000');
    });

    job = schedule.scheduleJob("*/1 * * * *", async () => {
      console.log('Job executed');
    });
  });

  afterAll(async () => {
    // Attendez que le serveur se ferme
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Server closed after tests');
          resolve();
        });
      });
    }

    // Annuler la tâche planifiée
    if (job) {
      job.cancel();
      console.log('Scheduled job cancelled');
    }

    // Fermer toute connexion sequelize
    // Vous pouvez également attendre que les connexions de Sequelize soient fermées proprement
    await new Promise<void>((resolve) => {
      const sequelize = require('sequelize');
      sequelize.close().then(() => resolve());
    });
  });

  // test("Créer une transaction via API", async () => {
  //   const response = await request(app)
  //     .post("/api/transactions")
  //     .send({
  //       value: 500,
  //       sender: "user1",
  //       receiver: "user2",
  //     });

  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty("id");
  //   transactionId = response.body.id;
  // });

  test("Récupérer une transaction existante", async () => {
    const response = await request(app).get(`/api/transactions`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("transaction getting");
  });
});
