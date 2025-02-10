const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier "build"
app.use(express.static(path.join(__dirname, "build")));

// Rediriger toutes les requêtes vers "index.html" (pour React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`✅ Frontend running on http://localhost:${PORT}`);
});
