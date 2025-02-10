# Utiliser une image officielle de Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port du serveur
EXPOSE 5000

# Démarrer le serveur
CMD ["node", "index.js"]
