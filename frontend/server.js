const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const buildPath = path.join(__dirname, "build");
if (!require("fs").existsSync(buildPath)) {
    console.error("❌ Erreur : Le dossier build/ est introuvable. Lancez `npm run build`.");
    process.exit(1);
}

app.use(express.static(buildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`✅ Frontend running on http://localhost:${PORT}`);
});
