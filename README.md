### FRENCH

GeoDex est une application web interactive permettant d'afficher la liste des pays du monde, de tester ses connaissances à travers des quiz sur les drapeaux et les capitales, et de consulter des informations détaillées sur chaque pays.

## 🚀 Fonctionnalités

- 📋 Liste des pays avec recherche et filtres
- 🔎 Recherche en temps réel par nom, capitale et langue
- 🌎 Filtrage par continent
- 🏳️ Quiz sur les drapeaux
- 🏛️ Quiz sur les capitales
- 🗺️ Fiche détaillée de chaque pays avec navigation entre les pays
- 🎨 Interface stylisée avec TailwindCSS

---

## 📌 Prérequis

Avant de lancer le projet, assure-toi d'avoir les éléments suivants installés sur ton système :

- [Node.js](https://nodejs.org/) (version 18 ou plus récente)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optionnel pour exécuter le projet en conteneur)

---

## 🛠️ Installation et Configuration

### 1️⃣ Cloner le projet
git clone https://github.com/Mahylanv/geography-game.git
cd geodex

### Installer les dépendances
1) Backend (Node.js + Express)
cd backend
npm install

2) Frontend (React + TailwindCSS)
cd ../frontend
npm install

Ajoute un fichier .env dans le dossier backend avec les informations suivantes :
PORT=5000

Ajoute un fichier .env dans le dossier frontend avec :
REACT_APP_BACKEND_URL=http://localhost:5000

### Lancer avec Docker
docker-compose up --build

### Lancer avec npm start
cd backend
npm run dev

cd frontend
npm start

////////////////////////////////////////////////////////////////////////

### ENGLISH
# 🌍 GeoDex - Quizzes and Country Information

GeoDex is an interactive web application that displays a list of the world's countries, tests your knowledge with quizzes on flags and capitals, and provides detailed information on each country.

## 🚀 Features

- 📋 Country list with search and filters
- 🔎 Real-time search by name, capital and language
- 🌎 Filter by continent
- 🏳️ Flag quiz
- 🏛️ Quiz on capitals
- 🗺️ Detailed country sheet with navigation between countries
- 🎨 Stylized interface with TailwindCSS

---

## 📌 Prerequisites

Before launching the project, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Docker](https://www.docker.com/) (optional to run the project in a container)

---

## 🛠️ Installation and configuration

### 1️⃣ Clone project
git clone https://github.com/Mahylanv/geography-game.git
cd geodex

### Install dependencies
1) Backend (Node.js + Express)
cd backend
npm install

2) Frontend (React + TailwindCSS)
cd ../frontend
npm install

Adds an .env file to the backend folder with the following information:
PORT=5000

Adds an .env file to the frontend folder with :
REACT_APP_BACKEND_URL=http://localhost:5000

### Launch with Docker
docker-compose up --build

### Run with npm start
cd backend


