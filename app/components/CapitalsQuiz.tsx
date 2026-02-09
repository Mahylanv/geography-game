"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

type Country = {
  name: string;
  capital: string;
  flag: string;
  unMember: boolean;
};

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/'/g, " ")
    .replace(/\b(city of|city)\b/g, "")
    .trim();
}

export default function CapitalsQuiz() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [capitalShortcuts, setCapitalShortcuts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyUN, setOnlyUN] = useState(false);

  const predefinedShortcuts = useMemo(
    () => ({
      kiev: "kyiv",
      beyrouth: "beirut",
      vienne: "vienna",
      copenhague: "copenhagen",
      prague: "prague",
      varsovie: "warsaw",
      bucarest: "bucharest",
      bruxelles: "brussels",
      lisbonne: "lisbon",
      moscou: "moscow",
      pékin: "beijing",
      athènes: "athens",
      "le caire": "cairo",
      "la havane": "havana",
      mexico: "mexico city",
      londres: "london",
      damas: "damascus",
      washington: "washington, d.c.",
      riyad: "riyadh",
      manille: "manila",
      bakou: "baku",
      tachkent: "tashkent",
      mogadiscio: "mogadishu",
      beijing: "pekin",
      teheran: "tehran",
      nicosie: "nicosia",
      "saint domingue": "santo domingo",
      "andorre la vieille": "andorra la vella",
      "la valette": "valletta",
      bagdad: "baghdad",
      kathmandou: "kathmandu",
      douchanbé: "dushanbe",
      singapour: "singapore",
      tbilissi: "tbilisi",
      erevan: "yerevan",
      kaboul: "kabul",
      "addis abeba": "addis ababa",
      alger: "algiers",
      dacca: "dhaka",
      sanaa: "sana'a",
      thimphou: "thimphu",
      "oulan bator": "ulan bator",
      "port d'espagne": "port of spain"
    }),
    []
  );

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");

    fetchCountries({ forceRefresh: reloadKey > 0 })
      .then((data) => {
        if (!active) return;
        const formattedCountries = data
          .filter((country: any) => country.capital && country.capital.length > 0)
          .map((country: any) => ({
            name: country.translations?.fra?.common || country.name.common,
            capital: country.translations?.fra?.capital || country.capital[0],
            flag: country.flags.png,
            unMember: country.unMember === true
          }));

        setAllCountries(formattedCountries);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Erreur de récupération des capitales :", err);
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
    const filtered = onlyUN ? allCountries.filter((country) => country.unMember) : allCountries;
    setCountries(filtered);

    const shortcuts: Record<string, string> = { ...predefinedShortcuts };
    filtered.forEach((country) => {
      const capitalEn = normalizeString(country.capital);
      const capitalFr = normalizeString(country.capital);

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

    setCapitalShortcuts(shortcuts);
    setCurrent(filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : null);
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
  }, [allCountries, onlyUN, predefinedShortcuts]);

  function loadNextCapital() {
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
    if (countries.length === 0) return;
    setCurrent(countries[Math.floor(Math.random() * countries.length)]);
  }

  function checkAnswer(userAnswer: string, manualValidation = false) {
    if (!current) return;
    let normalizedUserAnswer = normalizeString(userAnswer);
    const normalizedCorrectAnswer = normalizeString(current.capital);

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
    <div className="page-shell flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">Quelle est la capitale de ce pays ?</h2>

      <label className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={onlyUN}
          onChange={(e) => setOnlyUN(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Pays ONU seulement</span>
      </label>

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
          <img src={current.flag} alt="Drapeau" className="w-72 sm:w-80 object-cover mx-auto rounded-xl" />
          <p className={`mt-4 text-base font-semibold ${message.includes("✅") ? "text-emerald-600" : "text-rose-600"}`}>
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
        placeholder="Entrez la capitale"
        className="input-field max-w-xs"
      />

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <button onClick={() => checkAnswer(answer, true)} className="btn-primary">
          Valider
        </button>
        <button onClick={loadNextCapital} className="btn-secondary">
          Passer
        </button>
      </div>

      {showAnswer && (
        <button onClick={() => setMessage(`La bonne réponse était : ${current?.capital ?? ""}`)} className="btn-ghost mt-4">
          Réponse
        </button>
      )}
    </div>
  );
}
