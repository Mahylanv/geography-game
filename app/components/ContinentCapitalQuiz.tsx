"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";
import {
  buildCapitalShortcuts,
  isCapitalAnswerCorrect,
  PREDEFINED_CAPITAL_SHORTCUTS
} from "../lib/capitalAnswers";
import { translateCapital } from "../lib/capitalTranslations";

const CONTINENTS_MAP: Record<string, string> = {
  Europe: "Europe",
  Afrique: "Africa",
  Asie: "Asia",
  "Amérique du Nord": "North America",
  "Amérique du Sud": "South America",
  Océanie: "Oceania"
};

type Country = {
  name: string;
  capital: string;
  flag: string | null;
  unMember: boolean;
};

export default function ContinentCapitalQuiz({ continent }: { continent: string }) {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [current, setCurrent] = useState<Country | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [capitalShortcuts, setCapitalShortcuts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyUN, setOnlyUN] = useState(false);
  const [onlyNonUN, setOnlyNonUN] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    fetchCountries({ forceRefresh: reloadKey > 0 })
      .then((data) => {
        if (!active) return;
        const formattedCountries = data
          .filter(
            (country: any) =>
              country.capital &&
              country.capital.length > 0 &&
              country.continents &&
              country.continents.includes(CONTINENTS_MAP[continent])
          )
          .map((country: any) => ({
            name: country.translations?.fra?.common || country.name.common,
            capital: country.translations?.fra?.capital || country.capital[0],
            flag: country.flags?.svg || country.flags?.png || null,
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
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [continent, reloadKey]);

  useEffect(() => {
    const filtered = onlyUN
      ? allCountries.filter((country) => country.unMember)
      : onlyNonUN
        ? allCountries.filter((country) => !country.unMember)
        : allCountries;
    setCountries(filtered);

    if (filtered.length === 0) {
      setCurrent(null);
      setCapitalShortcuts({});
      return;
    }
    setCapitalShortcuts(buildCapitalShortcuts(PREDEFINED_CAPITAL_SHORTCUTS, filtered.map((country) => country.capital)));
    setCurrent(filtered[Math.floor(Math.random() * filtered.length)]);
    setAnswer("");
    setMessage("");
    setShowAnswer(false);
  }, [allCountries, onlyUN, onlyNonUN]);

  function loadNextCapital() {
    setAnswer("");
    setMessage("");
    setShowAnswer(false);

    if (countries.length > 0) {
      setCurrent(countries[Math.floor(Math.random() * countries.length)]);
    } else {
      setCurrent(null);
    }
  }

  function checkAnswer(userAnswer: string, manualValidation = false) {
    if (!current) return;

    if (isCapitalAnswerCorrect(userAnswer, current.capital, capitalShortcuts)) {
      setMessage("✅ Correct !");
      setShowAnswer(false);
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
        <div className="card-frame mb-4">
          {current.flag ? (
            <img src={current.flag} alt="Drapeau" className="w-72 sm:w-80 object-cover mx-auto rounded-xl" />
          ) : (
            <p className="text-slate-600">Aucun drapeau disponible</p>
          )}
          <p className="mt-3 text-sm font-semibold text-slate-600">{current.name}</p>
          <p className={`mt-4 text-base font-semibold ${message.includes("✅") ? "text-emerald-600" : "text-rose-600"}`}>
            {message}
          </p>
        </div>
      ) : (
        <p className="text-slate-600 font-semibold">Aucune donnée disponible pour ce continent.</p>
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
        <button
          onClick={() => setMessage(`La bonne réponse était : ${translateCapital(current?.capital)}`)}
          className="btn-ghost mt-4"
        >
          Réponse
        </button>
      )}
    </div>
  );
}
