# Utiliser une image légère de Node.js
FROM node:18-alpine
WORKDIR /app

# Copier les fichiers et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install --production

# Copier les fichiers sources et builder le projet React
COPY . .
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Lancer le serveur Express
CMD ["node", "server.js"]
