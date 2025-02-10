
FROM node:18-alpine AS build

WORKDIR /app

#Copier les fichiers package.json et package-lock.json
COPY package*.json ./

#  Installation des dépendances
RUN npm install

# Copier du code source
COPY . .

RUN npm run build

EXPOSE 3000

RUN npm install -g serve

# Lancer l'application
CMD ["serve", "-s", "dist", "-l", "3000"]
