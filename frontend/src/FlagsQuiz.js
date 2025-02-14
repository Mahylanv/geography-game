import React, { useState, useEffect } from "react";
import axios from "axios";

// supprime accents, tirets, apostrophes
function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/'/g, " ")
        .trim();
}

function FlagsQuiz() {
    const [countries, setCountries] = useState([]);
    const [current, setCurrent] = useState({});
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [countryShortcuts, setCountryShortcuts] = useState({});

    const predefinedShortcuts = {
        "usa": "États-Unis",
        "rdc": "Congo (Rép. dém.)",
        "vatican": "Cité du Vatican",
        "eau": "Émirats Arabes Unis",
        "uae": "Émirats Arabes Unis",
        "uk": "Royaume-Uni",
        "gb": "Royaume-Uni",
        "nz": "Nouvelle-Zélande",
        "rsa": "Afrique du Sud",
        "rep dom": "République dominicaine",
        "taiwan": "Taïwan",
        "bosnie": "Bosnie Herzégovine",
        "aland": "Ahvenanmaa",
        "cap vert": "Îles du Cap-Vert",
        "polynesie": "Polynésie française",
        "sainte helene": "Sainte-Hélène, Ascension et Tristan da Cunha",
        "palaos": "Palaos (Palau)",
        "centrafrique": "République centrafricaine",
        "eswatini": "Swaziland",
        "vietnam": "Viet nam",
        "saint vincent": "Saint-Vincent-et-les-Grenadines",
        "antigua": "Antigua-et-Barbuda",
        "sandwich": "Géorgie du Sud-et-les Îles Sandwich du Sud",
        "sao tome": "São Tomé et Príncipe",
        "svalbard": "Svalbard et Jan Mayen",
    };

    useEffect(() => {
        axios.get("https://restcountries.com/v3.1/all")
            .then((res) => {
                const formattedCountries = res.data.map(country => ({
                    name: country.translations?.fra?.common || country.name.common,
                    flag: country.flags.png
                }));

                let shortcuts = { ...predefinedShortcuts };
                formattedCountries.forEach(country => {
                    let name = normalizeString(country.name);

                    // Supprimer "Îles" et "Île"
                    if (name.includes("iles ") || name.includes("ile ")) {
                        const shortName = name.replace(/\b(iles|ile)\b/gi, "").trim();
                        shortcuts[shortName] = country.name;
                    }

                    // Ajouter versions sans tirets ni apostrophes
                    const nameWithoutDash = name.replace(/-/g, " ");
                    if (name !== nameWithoutDash) {
                        shortcuts[nameWithoutDash] = country.name;
                    }

                    const nameWithoutApostrophe = name.replace(/'/g, " ");
                    if (name !== nameWithoutApostrophe) {
                        shortcuts[nameWithoutApostrophe] = country.name;
                    }
                });

                setCountries(formattedCountries);
                setCountryShortcuts(shortcuts);
                setCurrent(formattedCountries[Math.floor(Math.random() * formattedCountries.length)]);
            })
            .catch((err) => console.error("Erreur de récupération des pays :", err));
    }, []);

    function loadNextFlag() {
        setAnswer("");
        setMessage("");
        setShowAnswer(false);
        setCurrent(countries[Math.floor(Math.random() * countries.length)]);
    }

    function checkAnswer(userAnswer, manualValidation = false) {
        let normalizedUserAnswer = normalizeString(userAnswer);
        let normalizedCorrectAnswer = normalizeString(current.name);

        if (countryShortcuts[normalizedUserAnswer]) {
            normalizedUserAnswer = normalizeString(countryShortcuts[normalizedUserAnswer]);
        }

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
            setMessage("✅ Correct !");
            setTimeout(loadNextFlag, 1000);
            return;
        }

        if (manualValidation) {
            setMessage("❌ Incorrect !");
            setShowAnswer(true);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Quel est ce pays ?</h2>

            {current.flag && (
                <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                    <img src={current.flag} alt="Drapeau" className="w-80 mx-auto" />
                    <p className={`mt-4 text-lg font-semibold ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                </div>
            )}

            <input
                type="text"
                value={answer}
                onChange={(e) => {
                    setAnswer(e.target.value);
                    checkAnswer(e.target.value);
                }}
                placeholder="Entrez le nom du pays"
                className="px-4 py-2 w-64 rounded-lg text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex gap-4 mt-4">
                <button onClick={() => checkAnswer(answer, true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition">
                    Valider
                </button>
                <button onClick={loadNextFlag}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition">
                    Passer
                </button>
            </div>

            {showAnswer && (
                <button onClick={() => setMessage(`La bonne réponse était : ${current.name}`)}
                    className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg transition">
                    Réponse
                </button>
            )}

           
        </div>
    );
}

export default FlagsQuiz;
