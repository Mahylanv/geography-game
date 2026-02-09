"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  flag: string | null;
  borders: number;
};

export default function BordersQuiz() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    fetchCountries({ forceRefresh: reloadKey > 0 })
      .then((data) => {
        if (!active) return;
        const formattedCountries = data
          .map((country: any) => ({
            name: country.translations?.fra?.common || country.name.common,
            flag: country.flags?.png || null,
            borders: country.borders ? country.borders.length : 0
          }))
          .filter((country: Country) => country.borders > 0);

        setCountries(formattedCountries);
        setLoading(false);
        loadNextCountry(formattedCountries);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Erreur de récupération des pays :", err);
        setLoadError("Impossible de charger les pays. Vérifiez votre connexion puis réessayez.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

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
    if (Number.isNaN(userAnswer)) {
      setMessage("❌ Veuillez entrer un nombre valide !");
      return;
    }

    if (userAnswer === current.borders) {
      setMessage("✅ Correct !");
      setTimeout(() => loadNextCountry(), 1000);
    } else {
      setMessage(`❌ Incorrect ! Il a ${current.borders} pays frontaliers.`);
      setTimeout(() => loadNextCountry(), 1000);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-red-300 to-red-500 text-white text-center">
      <h2 className="text-3xl font-bold mb-6">Combien de pays bordent ce pays ?</h2>

      {loading ? (
        <p className="text-lg font-semibold">Chargement...</p>
      ) : loadError ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-white/90 px-4 py-3 text-rose-700">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white">
            Réessayer
          </button>
        </div>
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
        <button onClick={checkAnswer} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition">
          Valider
        </button>

        <button onClick={() => loadNextCountry()} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition">
          Passer
        </button>
      </div>
    </div>
  );
}
