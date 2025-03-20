import React, { useState, useEffect } from "react";
import axios from "axios";

function BordersQuiz() {
    const [countries, setCountries] = useState([]);
    const [current, setCurrent] = useState(null);
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("https://restcountries.com/v3.1/all")
            .then((res) => {
                const formattedCountries = res.data
                    .map(country => ({
                        name: country.translations?.fra?.common || country.name.common,
                        flag: country.flags?.png || null,
                        borders: country.borders ? country.borders.length : 0 // Nombre de pays frontaliers
                    }))
                    .filter(country => country.borders > 0); // Exclure les pays sans frontières

                setCountries(formattedCountries);
                setLoading(false);
                loadNextCountry(formattedCountries);
            })
            .catch(err => {
                console.error("Erreur de récupération des pays :", err);
                setLoading(false);
            });
    }, []);

    function loadNextCountry(countryList = countries) {
        setMessage("");
        setAnswer("");
        if (countryList.length > 0) {
            setCurrent(countryList[Math.floor(Math.random() * countryList.length)]);
        }
    }

    function checkAnswer() {
        if (!current) return;

        const userAnswer = parseInt(answer, 10);
        if (isNaN(userAnswer)) {
            setMessage("❌ Veuillez entrer un nombre valide !");
            return;
        }

        if (userAnswer === current.borders) {
            setMessage("✅ Correct !");
            setTimeout(() => loadNextCountry(), 1000); // Changer après 1s si correct
        } else {
            setMessage(`❌ Incorrect ! Il a ${current.borders} pays frontaliers.`);
            setTimeout(() => loadNextCountry(), 1000); // Changer après 1s si incorrect
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-red-300 to-red-500 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Combien de pays bordent ce pays ?</h2>

            {loading ? (
                <p className="text-lg font-semibold">Chargement...</p>
            ) : current ? (
                <div className="bg-white p-4 rounded-xl shadow-lg mb-4 text-black">
                    {current.flag && <img src={current.flag} alt="Drapeau" className="w-80 object-cover mx-auto mb-4" />}
                    <h3 className="text-2xl font-bold">{current.name}</h3>
                    <p className={`text-lg font-semibold ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                </div>
            ) : (
                <p className="text-lg font-semibold">Aucune donnée disponible.</p>
            )}

            <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Entrez le nombre de pays frontaliers"
                className="px-4 py-2 w-80 rounded-lg text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex gap-4 mt-4">
                <button
                    onClick={checkAnswer}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition"
                >
                    Valider
                </button>

                <button
                    onClick={() => loadNextCountry()}
                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition"
                >
                    Passer
                </button>
            </div>
        </div>
    );
}

export default BordersQuiz;
