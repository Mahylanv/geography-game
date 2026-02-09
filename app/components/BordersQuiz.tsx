"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  flag: string | null;
  borders: number;
  unMember: boolean;
};

export default function BordersQuiz() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyUN, setOnlyUN] = useState(false);

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
            borders: country.borders ? country.borders.length : 0,
            unMember: country.unMember === true
          }))
          .filter((country: Country) => country.borders > 0);

        setAllCountries(formattedCountries);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Erreur de récupération des pays :", err);
        setLoadError("Impossible de charger les pays. Vérifiez votre connexion puis réessayez.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    const filtered = onlyUN ? allCountries.filter((country) => country.unMember) : allCountries;
    setCountries(filtered);
    loadNextCountry(filtered);
  }, [allCountries, onlyUN]);

  function loadNextCountry(countryList = countries) {
    setMessage("");
    setAnswer("");
    if (countryList.length > 0) {
      setCurrent(countryList[Math.floor(Math.random() * countryList.length)]);
    } else {
      setCurrent(null);
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
    <div className="page-shell flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">Combien de pays bordent ce pays ?</h2>

      <label className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={onlyUN}
          onChange={(e) => setOnlyUN(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Pays ONU seulement</span>
      </label>

      {loading ? (
        <p className="text-slate-600 font-semibold">Chargement...</p>
      ) : loadError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-rose-700 shadow-sm">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="btn-primary mt-3">
            Réessayer
          </button>
        </div>
      ) : current ? (
        <div className="card-frame mb-4 text-slate-900">
          {current.flag && <img src={current.flag} alt="Drapeau" className="w-72 sm:w-80 object-cover mx-auto mb-4 rounded-xl" />}
          <h3 className="text-xl font-semibold">{current.name}</h3>
          <p className={`text-base font-semibold ${message.includes("✅") ? "text-emerald-600" : "text-rose-600"}`}>
            {message}
          </p>
        </div>
      ) : (
        <p className="text-slate-600 font-semibold">Aucune donnée disponible.</p>
      )}

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Entrez le nombre de pays frontaliers"
        className="input-field max-w-xs"
      />

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <button onClick={checkAnswer} className="btn-primary">
          Valider
        </button>

        <button onClick={() => loadNextCountry()} className="btn-secondary">
          Passer
        </button>
      </div>
    </div>
  );
}
