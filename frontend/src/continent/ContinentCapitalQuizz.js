import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// 🔹 Mappage correct des continents (FR ↔ EN)
const CONTINENTS_MAP = {
    "Europe": "Europe",
    "Afrique": "Africa",
    "Asie": "Asia",
    "Amérique du Nord": "North America",
    "Amérique du Sud": "South America",
    "Océanie": "Oceania"
};

// 🔹 Normalisation de chaîne de caractères
function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/'/g, " ")
        .replace(/\b(city of|city)\b/g, "")
        .trim();
}

function ContinentCapitalsQuiz({ continent }) {
    const [countries, setCountries] = useState([]);
    const [current, setCurrent] = useState(null);
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [capitalShortcuts, setCapitalShortcuts] = useState({});
    const [loading, setLoading] = useState(true);

    // 🔹 Correspondance des noms de capitales (abréviations et variations)
    const predefinedShortcuts = useMemo(() => ({
        "kiev": "kyiv",
        "beyrouth": "beirut",
        "vienne": "vienna",
        "copenhague": "copenhagen",
        "prague": "prague",
        "varsovie": "warsaw",
        "bucarest": "bucharest",
        "bruxelles": "brussels",
        "lisbonne": "lisbon",
        "moscou": "moscow",
        "pékin": "beijing",
        "athènes": "athens",
        "le caire": "cairo",
        "la havane": "havana",
        "mexico": "mexico city",
        "londres": "london",
        "washington": "washington, d.c.",
        "riyad": "riyadh",
        "manille": "manila",
        "bakou": "baku",
        "tachkent": "tashkent",
        "mogadiscio": "mogadishu",
        "teheran": "tehran",
        "nicosie": "nicosia",
        "saint domingue": "santo domingo",
        "andorre la vieille": "andorra la vella",
        "la valette": "valletta",
        "bagdad": "baghdad",
        "kathmandou": "kathmandu",
        "singapour": "singapore",
        "erevan": "yerevan",
        "kaboul": "kabul",
        "addis abeba": "addis ababa",
        "alger": "algiers",
        "dacca": "dhaka",
        "sanaa": "sana'a",
        "thimphou": "thimphu",
        "oulan bator": "ulan bator",
        "port d'espagne": "port of spain"
    }), []);

    useEffect(() => {
        setLoading(true);

        axios.get("https://restcountries.com/v3.1/all")
            .then((res) => {
                const formattedCountries = res.data
                    .filter(country =>
                        country.capital && country.capital.length > 0 &&
                        country.continents &&
                        country.continents.includes(CONTINENTS_MAP[continent]) // ✅ Utilisation du mapping correct
                    )
                    .map(country => ({
                        name: country.translations?.fra?.common || country.name.common,
                        capital: country.translations?.fra?.capital || country.capital[0],
                        flag: country.flags?.png || null
                    }));

                if (formattedCountries.length === 0) {
                    setCurrent(null);
                    setLoading(false);
                    return;
                }

                let shortcuts = { ...predefinedShortcuts };
                formattedCountries.forEach(country => {
                    let capitalEn = normalizeString(country.capital);
                    let capitalFr = normalizeString(country.translations?.fra?.capital || country.capital);

                    shortcuts[capitalFr] = capitalEn;

                    const capitalWithoutDash = capitalFr.replace(/-/g, " ");
                    if (capitalFr !== capitalWithoutDash) {
                        shortcuts[capitalWithoutDash] = capitalEn;
                    }

                    const capitalWithoutApostrophe = capitalFr.replace(/'/g, " ");
                    if (capitalFr !== capitalWithoutApostrophe) {
                        shortcuts[capitalWithoutApostrophe] = capitalEn;
                    }
                });

                setCountries(formattedCountries);
                setCapitalShortcuts(shortcuts);
                setCurrent(formattedCountries[Math.floor(Math.random() * formattedCountries.length)]);
            })
            .catch((err) => console.error("Erreur de récupération des capitales :", err))
            .finally(() => setLoading(false));
    }, [continent, predefinedShortcuts]);

    function loadNextCapital() {
        setAnswer("");
        setMessage("");
        setShowAnswer(false);

        if (countries.length > 0) {
            setCurrent(countries[Math.floor(Math.random() * countries.length)]);
        }
    }

    function checkAnswer(userAnswer, manualValidation = false) {
        if (!current) return;

        let normalizedUserAnswer = normalizeString(userAnswer);
        let normalizedCorrectAnswer = normalizeString(current.capital);

        if (capitalShortcuts[normalizedUserAnswer]) {
            normalizedUserAnswer = normalizeString(capitalShortcuts[normalizedUserAnswer]);
        }

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
            setMessage("✅ Correct !");
            setTimeout(loadNextCapital, 1000);
            return;
        }

        if (manualValidation) {
            setMessage("❌ Incorrect !");
            setShowAnswer(true);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Quelle est la capitale de ce pays ?</h2>

            {loading ? (
                <p className="text-lg font-semibold">Chargement...</p>
            ) : current ? (
                <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                    {current.flag ? (
                        <img src={current.flag} alt="Drapeau" className="w-80 object-cover mx-auto" />
                    ) : (
                        <p className="text-gray-700">Aucun drapeau disponible</p>
                    )}
                    <p className={`mt-4 text-lg font-semibold ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                </div>
            ) : (
                <p className="text-lg font-semibold">Aucune donnée disponible pour ce continent.</p>
            )}

            <input
                type="text"
                value={answer}
                onChange={(e) => {
                    setAnswer(e.target.value);
                    checkAnswer(e.target.value);
                }}
                placeholder="Entrez la capitale"
                className="px-4 py-2 w-64 rounded-lg text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />

            <button onClick={loadNextCapital} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition">
                Passer
            </button>
        </div>
    );
}

ContinentCapitalsQuiz.propTypes = {
    continent: PropTypes.string.isRequired
};

export default ContinentCapitalsQuiz;
