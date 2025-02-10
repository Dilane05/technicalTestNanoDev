# Utilise l'image officielle de Node.js
FROM node:16

# Crée et définit le répertoire de travail
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source dans le conteneur
COPY . .

# Installe globalement nodemon et ts-node dans le conteneur
RUN npm install -g nodemon ts-node

# Expose le port 3050 (ou celui que tu utilises)
EXPOSE 3050

# Démarre l'application en mode développement avec nodemon et ts-node
CMD ["npm", "run", "dev"]
