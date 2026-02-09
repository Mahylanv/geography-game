"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  population: number;
  area: number;
  borders: number;
  continent: string;
  flag: string | null;
  latlng: [number, number];
  languages: string[];
  currencies: string[];
  capital: string;
  unMember: boolean;
  timezones: string[];
};

type Attempt = {
  name: string;
  flag: string | null;
  population: "green" | "red" | "gray";
  area: "green" | "red" | "gray";
  borders: "green" | "red" | "gray";
  continent: "green" | "red";
  direction: string;
  language: "green" | "red";
  currency: "green" | "red";
  un: "green" | "red";
  capital: "green" | "red";
  initial: "green" | "red";
  timezone: string;
  correct: boolean;
};

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/'/g, " ")
    .trim();
}

function getDirection(from: [number, number], to: [number, number]) {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  if (deltaLat > 0 && deltaLon > 0) return "↗️";
  if (deltaLat > 0 && deltaLon < 0) return "↖️";
  if (deltaLat < 0 && deltaLon > 0) return "↘️";
  if (deltaLat < 0 && deltaLon < 0) return "↙️";
  if (deltaLat > 0) return "⬆️";
  if (deltaLat < 0) return "⬇️";
  if (deltaLon > 0) return "➡️";
  if (deltaLon < 0) return "⬅️";

  return "🎯";
}

export default function CoutrieDle() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [target, setTarget] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [includedContinents, setIncludedContinents] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");

    fetchCountries({ forceRefresh: reloadKey > 0 })
      .then((data) => {
        if (!active) return;
        const mapped = data.map((c: any) => ({
        name: c.translations?.fra?.common || c.name.common,
        population: c.population,
        area: c.area,
        borders: c.borders?.length || 0,
        continent: c.continents?.[0] || "Inconnu",
        flag: c.flags?.png || null,
        latlng: c.latlng || [0, 0],
        languages: Object.values(c.languages || {}),
        currencies: Object.keys(c.currencies || {}),
        capital: c.capital?.[0] || "",
        unMember: c.unMember,
        timezones: c.timezones || []
      }));

        setCountries(mapped);
        const allContinents = [...new Set(mapped.map((c: Country) => c.continent))];
        setIncludedContinents(allContinents);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Erreur de récupération des pays :", err);
        setLoadError("Impossible de charger les pays. Vérifiez votre connexion puis réessayez.");
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (countries.length && includedContinents.length) {
      const filtered = countries.filter((c) => includedContinents.includes(c.continent));
      if (filtered.length === 0) return;
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setTarget(random);
    }
  }, [includedContinents, countries]);

  function handleContinentToggle(continent: string) {
    setIncludedContinents((prev) =>
      prev.includes(continent) ? prev.filter((c) => c !== continent) : [...prev, continent]
    );
  }

  function resetGame() {
    const filtered = countries.filter((c) => includedContinents.includes(c.continent));
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setTarget(random);
    setAnswer("");
    setAttempts([]);
    setGameWon(false);
    setHasGuessed(false);
    setShowSuggestions(false);
  }

  function checkAnswer(name?: string) {
    if (!target || gameWon) return;

    const userInput = normalizeString(name || answer);
    const match = countries.find((c) => normalizeString(c.name) === userInput);
    setShowSuggestions(false);
    if (!match) return;

    if (match.name === target.name) {
      setGameWon(true);
      const victoryRow: Attempt = {
        name: match.name,
        flag: match.flag,
        population: "green",
        area: "green",
        borders: "green",
        continent: "green",
        direction: "✅",
        language: "green",
        currency: "green",
        un: "green",
        capital: "green",
        initial: "green",
        timezone: "green",
        correct: true
      };
      setAttempts((prev) => [...prev, victoryRow]);
    } else {
      const hints: Attempt = {
        name: match.name,
        flag: match.flag,
        population: match.population > target.population ? "red" : match.population < target.population ? "green" : "gray",
        area: match.area > target.area ? "red" : match.area < target.area ? "green" : "gray",
        borders: match.borders > target.borders ? "red" : match.borders < target.borders ? "green" : "gray",
        continent: match.continent === target.continent ? "green" : "red",
        direction: getDirection(match.latlng, target.latlng),
        language: match.languages.some((l) => target.languages.includes(l)) ? "green" : "red",
        currency: match.currencies.some((c) => target.currencies.includes(c)) ? "green" : "red",
        un: match.unMember === target.unMember ? "green" : "red",
        capital: match.capital[0]?.toLowerCase() === target.capital[0]?.toLowerCase() ? "green" : "red",
        initial: match.name[0]?.toLowerCase() === target.name[0]?.toLowerCase() ? "green" : "red",
        timezone: (() => {
          const getOffset = (tz: string) => {
            const matchTz = tz.match(/([+-]\\d{2}):?(\\d{2})?/);
            if (!matchTz) return 0;
            const hours = parseInt(matchTz[1], 10);
            const minutes = parseInt(matchTz[2] || "0", 10);
            return hours + minutes / 60;
          };

          const userOffsets = match.timezones.map(getOffset).filter((v) => !Number.isNaN(v));
          const targetOffsets = target.timezones.map(getOffset).filter((v) => !Number.isNaN(v));

          if (userOffsets.length === 0 || targetOffsets.length === 0) return "❓";

          const userAvg = userOffsets.reduce((a, b) => a + b, 0) / userOffsets.length;
          const targetAvg = targetOffsets.reduce((a, b) => a + b, 0) / targetOffsets.length;

          if (userAvg === targetAvg) return "✅";
          return userAvg < targetAvg ? "🔺" : "🔻";
        })(),
        correct: false
      };
      setAttempts((prev) => [...prev, hints]);
    }
    setHasGuessed(true);
    setAnswer("");
  }

  const filteredSuggestions = countries.filter(
    (c) => normalizeString(c.name).includes(normalizeString(answer)) && answer.length > 1
  );

  const uniqueContinents = [...new Set(countries.map((c) => c.continent))];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-teal-400 to-cyan-600 text-white p-4">
      <h2 className="mt-16 text-3xl text-center font-bold mb-4">🌍 Devinez le pays mystère</h2>

      {isLoading && <p className="text-white/90 mb-4">Chargement des pays...</p>}

      {loadError && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-white/90 px-4 py-3 text-rose-700">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-white">
            Réessayer
          </button>
        </div>
      )}

      <div className="max-w-xs sm:max-w-md relative w-80">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={answer}
            disabled={gameWon}
            onChange={(e) => {
              setAnswer(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Entrez un pays"
            className="px-4 max-w-52 py-2 m-auto rounded-lg text-black flex-grow"
          />
          {(gameWon || attempts.length > 0) && (
            <button onClick={resetGame} className="bg-teal-300 hover:bg-teal-400 text-black font-bold py-2 px-4 rounded-lg shadow w-full sm:w-auto max-w-24 m-auto">
              Rejouer
            </button>
          )}
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-white text-black rounded-lg shadow z-10">
            {filteredSuggestions.map((c, i) => (
              <li
                key={`${c.name}-${i}`}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => checkAnswer(c.name)}
              >
                {c.flag && <img src={c.flag} alt="flag" className="w-6 h-4 object-cover" />}
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-xl font-bold mt-6 mb-4">Exclure un continent ?</div>
      <div className="mb flex flex-wrap gap-3 justify-center">
        {uniqueContinents.map((continent) => (
          <label key={continent} className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled={hasGuessed}
              checked={includedContinents.includes(continent)}
              onChange={() => handleContinentToggle(continent)}
            />
            <span>{continent}</span>
          </label>
        ))}
      </div>
      <div className="mt-8 overflow-x-auto w-full max-w-7xl rounded-md">
        <table className="w-full table-auto text-sm text-center text-white border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Pays</th>
              <th className="p-2">Population</th>
              <th className="p-2">Superficie</th>
              <th className="p-2">Nombre frontières</th>
              <th className="p-2">Continent</th>
              <th className="p-2">Localisation</th>
              <th className="p-2">Langue</th>
              <th className="p-2">Devise</th>
              <th className="p-2">ONU</th>
              <th className="p-2">Initiale capitale</th>
              <th className="p-2">Initiale</th>
              <th className="p-2">Fuseau horaire</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {[...attempts].reverse().map((a, i) => (
              <tr key={i} className={`border-t border-white text-black ${a.correct ? "bg-green-100 font-bold" : ""}`}>
                <td className="p-2 flex items-center gap-2 justify-center">
                  {a.flag && <img src={a.flag} alt="flag" className="w-6 h-4" />}
                  {a.name}
                </td>
                <td className={`p-2 ${a.correct ? "bg-green-200" : a.population === "green" ? "bg-red-200" : a.population === "red" ? "bg-red-200" : "bg-green-200"}`}>
                  {a.correct ? "✅" : a.population === "green" ? "🔺" : a.population === "red" ? "🔻" : "✅"}
                </td>
                <td className={`p-2 ${a.correct ? "bg-green-200" : a.area === "green" ? "bg-red-200" : a.area === "red" ? "bg-red-200" : "bg-green-200"}`}>
                  {a.correct ? "✅" : a.area === "green" ? "🔺" : a.area === "red" ? "🔻" : "✅"}
                </td>
                <td className={`p-2 ${a.correct ? "bg-green-200" : a.borders === "green" ? "bg-red-200" : a.borders === "red" ? "bg-red-200" : "bg-green-200"}`}>
                  {a.correct ? "✅" : a.borders === "green" ? "🔺" : a.borders === "red" ? "🔻" : "✅"}
                </td>
                <td className={`p-2 ${a.continent === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.continent === "green" ? "✅" : "❌"}
                </td>
                <td className={`p-2 ${a.correct ? "bg-green-200" : "bg-red-200"}`}>{a.direction}</td>
                <td className={`p-2 ${a.language === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.language === "green" ? "Langue commune" : "Langue différente"}
                </td>
                <td className={`p-2 ${a.currency === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.currency === "green" ? "Même devise" : "Devise différente"}
                </td>
                <td className={`p-2 ${a.un === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.un === "green" ? "Même statut" : "Statut différent"}
                </td>
                <td className={`p-2 ${a.capital === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.capital === "green" ? "✅" : "❌"}
                </td>
                <td className={`p-2 ${a.initial === "green" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.initial === "green" ? "✅" : "❌"}
                </td>
                <td className={`p-2 ${a.correct ? "bg-green-200" : a.timezone === "✅" ? "bg-green-200" : "bg-red-200"}`}>
                  {a.correct ? "✅" : a.timezone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
