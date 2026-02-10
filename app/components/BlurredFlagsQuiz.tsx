"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  flag: string;
  unMember: boolean;
};

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-']/g, " ")
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

export default function BlurredFlagsQuiz() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [blurLevel, setBlurLevel] = useState(35);
  const [showAnswer, setShowAnswer] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [countryShortcuts, setCountryShortcuts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyUN, setOnlyUN] = useState(false);
  const [onlyNonUN, setOnlyNonUN] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");

    fetchCountries({ forceRefresh: reloadKey > 0 })
      .then((data) => {
        if (!active) return;
        const formattedCountries = data.map((country: any) => ({
          name: country.translations?.fra?.common || country.name.common,
          flag: country.flags.png,
          unMember: country.unMember === true
        }));

        setAllCountries(formattedCountries);
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
    const filtered = onlyUN
      ? allCountries.filter((country) => country.unMember)
      : onlyNonUN
        ? allCountries.filter((country) => !country.unMember)
        : allCountries;
    setCountries(filtered);

    const shortcuts: Record<string, string> = { ...predefinedShortcuts };
    filtered.forEach((country) => {
      const name = normalizeString(country.name);
      const shortName = name.replace(/\b(iles|ile)\b/gi, "").trim();

      if (shortName !== name) {
        shortcuts[shortName] = country.name;
      }

      const nameWithoutDash = shortName.replace(/-/g, " ");
      if (shortName !== nameWithoutDash) {
        shortcuts[nameWithoutDash] = country.name;
      }

      const nameWithoutApostrophe = shortName.replace(/'/g, " ");
      if (shortName !== nameWithoutApostrophe) {
        shortcuts[nameWithoutApostrophe] = country.name;
      }
    });

    setCountryShortcuts(shortcuts);
    setCurrent(filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null);
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
    setBlurLevel(35);
  }, [allCountries, onlyUN, onlyNonUN]);

  function loadNextFlag() {
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
    setBlurLevel(35);
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

    setBlurLevel((prev) => Math.max(0, prev - 6));

    if (manualValidation) {
      setMessage("❌ Incorrect !");
      setShowAnswer(true);
    }
  }

  function handleInputChange(value: string) {
    setAnswer(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      checkAnswer(value);
    }, 1000);

    setTypingTimeout(newTimeout);
  }

  return (
    <div className="page-shell flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">Quel est ce pays ?</h2>

      <div className="mb-4 flex flex-col items-center gap-2 text-sm text-slate-600 sm:flex-row sm:gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyUN}
            onChange={(e) => {
              const checked = e.target.checked;
              setOnlyUN(checked);
              if (checked) setOnlyNonUN(false);
            }}
            className="h-4 w-4"
          />
          <span>Pays ONU uniquement</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyNonUN}
            onChange={(e) => {
              const checked = e.target.checked;
              setOnlyNonUN(checked);
              if (checked) setOnlyUN(false);
            }}
            className="h-4 w-4"
          />
          <span>Pays non ONU uniquement</span>
        </label>
      </div>

      {isLoading && <p className="text-slate-600 mb-4">Chargement des pays...</p>}

      {loadError && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-rose-700 shadow-sm">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="btn-primary mt-3">
            Réessayer
          </button>
        </div>
      )}

      {current?.flag && (
        <div className="card-frame mb-4">
          <img
            src={current.flag}
            alt="Drapeau"
            className="w-72 sm:w-80 h-56 mx-auto rounded-xl transition-all"
            style={{ filter: `blur(${blurLevel}px)` }}
          />
        </div>
      )}

      <input
        type="text"
        value={answer}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Entrez le nom du pays"
        className="input-field max-w-xs mt-4"
      />

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <button onClick={() => checkAnswer(answer, true)} className="btn-primary">
          Valider
        </button>
        <button onClick={loadNextFlag} className="btn-secondary">
          Passer
        </button>
      </div>

      {showAnswer && (
        <button onClick={() => setMessage(`La bonne réponse était : ${current?.name ?? ""}`)} className="btn-ghost mt-4">
          Réponse
        </button>
      )}

      <p className={`mt-4 text-base font-semibold ${message.includes("✅") ? "text-emerald-600" : "text-rose-600"}`}>
        {message}
      </p>
    </div>
  );
}
