FROM node:18-alpine
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer React en mode développement
CMD ["npm", "start"]
