"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  flag: string;
};

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/'/g, " ")
    .trim();
}

const predefinedShortcuts: Record<string, string> = {
  usa: "États-Unis",
  rdc: "Congo (Rép. dém.)",
  vatican: "Cité du Vatican",
  eau: "Émirats Arabes Unis",
  uae: "Émirats Arabes Unis",
  uk: "Royaume-Uni",
  gb: "Royaume-Uni",
  nz: "Nouvelle-Zélande",
  rsa: "Afrique du Sud",
  "rep dom": "République dominicaine",
  taiwan: "Taïwan",
  bosnie: "Bosnie Herzégovine",
  aland: "Ahvenanmaa",
  "cap vert": "Îles du Cap-Vert",
  polynesie: "Polynésie française",
  "sainte helene": "Sainte-Hélène, Ascension et Tristan da Cunha",
  palaos: "Palaos (Palau)",
  centrafrique: "République centrafricaine",
  eswatini: "Swaziland",
  vietnam: "Viet nam",
  "saint vincent": "Saint-Vincent-et-les-Grenadines",
  antigua: "Antigua-et-Barbuda",
  sandwich: "Géorgie du Sud-et-les Îles Sandwich du Sud",
  "sao tome": "São Tomé et Príncipe",
  svalbard: "Svalbard et Jan Mayen",
  papouasie: "Papouasie-Nouvelle-Guinée"
};

export default function FlagsQuiz() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [countryShortcuts, setCountryShortcuts] = useState<Record<string, string>>({});
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
        const formattedCountries = data.map((country: any) => ({
          name: country.translations?.fra?.common || country.name.common,
          flag: country.flags.png
        }));

        const shortcuts: Record<string, string> = { ...predefinedShortcuts };
        formattedCountries.forEach((country: Country) => {
          const name = normalizeString(country.name);

          if (name.includes("iles ") || name.includes("ile ")) {
            const shortName = name.replace(/\b(iles|ile)\b/gi, "").trim();
            shortcuts[shortName] = country.name;
          }

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

  function loadNextFlag() {
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
    if (countries.length === 0) return;
    setCurrent(countries[Math.floor(Math.random() * countries.length)]);
  }

  function checkAnswer(userAnswer: string, manualValidation = false) {
    if (!current) return;
    let normalizedUserAnswer = normalizeString(userAnswer);
    const normalizedCorrectAnswer = normalizeString(current.name);

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

      {isLoading && <p className="text-white/90 mb-4">Chargement des pays...</p>}

      {loadError && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-white/90 px-4 py-3 text-rose-700">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white">
            Réessayer
          </button>
        </div>
      )}

      {current?.flag && (
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
        <button onClick={() => checkAnswer(answer, true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition">
          Valider
        </button>
        <button onClick={loadNextFlag} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition">
          Passer
        </button>
      </div>

      {showAnswer && (
        <button onClick={() => setMessage(`La bonne réponse était : ${current?.name ?? ""}`)} className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg transition">
          Réponse
        </button>
      )}
    </div>
  );
}
