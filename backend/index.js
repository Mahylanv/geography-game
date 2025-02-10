const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const RESTCOUNTRIES_URL = "https://restcountries.com/v3.1/all";

// Récupérer les pays et les capitales directement depuis l'API
app.get("/countries", async (req, res) => {
    try {
        const response = await axios.get(RESTCOUNTRIES_URL);
        const countries = response.data
            .filter(country => country.translations && country.translations.fra && country.capital)
            .map(country => ({
                name: country.translations.fra.common,  // Nom en français
                capital: country.translations.fra.capital || country.capital[0], // Capitale en français
                flag: country.flags.png // Drapeau
            }));

        res.json(countries);
    } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
        res.status(500).json({ error: "Impossible de récupérer les données des pays" });
    }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
