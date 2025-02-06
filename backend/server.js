const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Définition de la route d'accueil
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
