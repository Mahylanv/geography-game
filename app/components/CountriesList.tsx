"use client";

import { useEffect, useState } from "react";
import { fetchCountries } from "../lib/countriesClient";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const countryNameCorrections: Record<string, string> = {
  Swaziland: "Eswatini",
  Tchéquie: "République Tchèque",
  "Congo (Rép. dém.)": "République Démocratique du Congo",
  Ahvenanmaa: "Åland"
};

const capitalTranslations: Record<string, string> = {
  kyiv: "Kiev",
  beirut: "Beyrouth",
  vienna: "Vienne",
  copenhagen: "Copenhague",
  prague: "Prague",
  warsaw: "Varsovie",
  bucharest: "Bucarest",
  brussels: "Bruxelles",
  lisbon: "Lisbonne",
  moscow: "Moscou",
  beijing: "Pékin",
  athens: "Athènes",
  cairo: "Le Caire",
  havana: "La Havane",
  "mexico city": "Mexico",
  london: "Londres",
  damascus: "Damas",
  "washington, d.c.": "Washington",
  riyadh: "Riyad",
  manila: "Manille",
  baku: "Bakou",
  tashkent: "Tachkent",
  mogadishu: "Mogadiscio",
  tehran: "Téhéran",
  nicosia: "Nicosie",
  "santo domingo": "Saint Domingue",
  "andorra la vella": "Andorre La Vieille",
  valletta: "La Valette",
  baghdad: "Bagdad",
  kathmandu: "Kathmandou",
  dushanbe: "Douchanbé",
  singapore: "Singapour",
  tbilisi: "Tbilissi",
  yerevan: "Erevan",
  kabul: "Kaboul",
  "addis ababa": "Addis Abeba",
  algiers: "Alger",
  dhaka: "Dacca",
  "sana'a": "Sanaa",
  thimphu: "Thimphou",
  "ulan bator": "Oulan-Bator",
  "port of spain": "Port d'Espagne"
};

const languageTranslations: Record<string, string> = {
  English: "Anglais",
  French: "Français",
  Spanish: "Espagnol",
  German: "Allemand",
  Chinese: "Chinois",
  Japanese: "Japonais",
  Portuguese: "Portugais",
  Russian: "Russe",
  Arabic: "Arabe",
  Hindi: "Hindi",
  Italian: "Italien",
  Dutch: "Néerlandais",
  Korean: "Coréen",
  Greek: "Grec",
  Turkish: "Turc",
  Swedish: "Suédois",
  Polish: "Polonais",
  Hebrew: "Hébreu",
  Finnish: "Finnois",
  Danish: "Danois",
  Norwegian: "Norvégien",
  Czech: "Tchèque",
  Hungarian: "Hongrois",
  Thai: "Thaïlandais",
  Vietnamese: "Vietnamien",
  Indonesian: "Indonésien",
  Armenian: "Arménien",
  Ukrainian: "Ukrainien",
  Albanian: "Albanien",
  Belarusian: "Biélorusse",
  Burmese: "Birman",
  Serbian: "Serbe",
  Croatian: "Croate",
  Bosnian: "Bosniaque",
  Bulgarian: "Bulgare",
  Turc: "Turque",
  Comorian: "Comorien",
  Estonian: "Estonien",
  Georgian: "Géorgien",
  Irish: "Irlandais",
  Icelandic: "Islandais",
  Latvian: "Letton",
  Luxembourgish: "Luxembourgeois",
  Macedonian: "Macédonien",
  Malagasy: "Malgache",
  Romanian: "Roumain",
  Nepali: "Népalais",
  Slovak: "Slovaque"
};

const translations = {
  continents: {
    Europe: "Europe",
    Asia: "Asie",
    Africa: "Afrique",
    "North America": "Amérique du Nord",
    Oceania: "Océanie",
    Antarctica: "Antarctique",
    "South America": "Amérique du Sud"
  },
  subregions: {
    "Northern Europe": "Europe du Nord",
    "Southern Europe": "Europe du Sud",
    "Western Europe": "Europe de l'Ouest",
    "Eastern Europe": "Europe de l'Est",
    "Central Asia": "Asie centrale",
    "South Asia": "Asie du Sud",
    "Southeast Asia": "Asie du Sud-Est",
    "East Asia": "Asie de l'Est",
    "Middle East": "Moyen-Orient",
    "North America": "Amérique du Nord",
    "South America": "Amérique du Sud",
    "Central America": "Amérique centrale",
    Caribbean: "Caraïbes",
    "West Africa": "Afrique de l'Ouest",
    "Central Africa": "Afrique centrale",
    "East Africa": "Afrique de l'Est",
    "Southern Africa": "Afrique australe",
    Melanesia: "Mélanésie",
    Micronesia: "Micronésie",
    Polynesia: "Polynésie"
  }
};

type Country = {
  id: number;
  name: string;
  capital: string;
  flag: string;
  population: string;
  area: string;
  continent: string;
  region: string;
  subregion: string;
  languages: string;
  currency: string;
  timezones: string;
  borders: string;
};

export default function CountriesList() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
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
        const formattedCountries = data.map((country: any, index: number) => {
          const capitalEn =
            Array.isArray(country.capital) && country.capital.length > 0
              ? country.capital[0]
              : typeof country.capital === "string" && country.capital
                ? country.capital
                : "Inconnue";
          const capitalKey = typeof capitalEn === "string" ? capitalEn.toLowerCase() : "inconnue";
          const capitalFr = capitalTranslations[capitalKey] || capitalizeFirstLetter(String(capitalEn));
          const rawName = country.translations?.fra?.common || country.name?.common || "Inconnu";
          const correctedName = countryNameCorrections[rawName] || rawName;
          const languages = country.languages
            ? Object.values(country.languages)
                .map((lang: any) => languageTranslations[lang as string] || (lang as string))
                .join(", ")
            : "N/A";
          return {
            id: index,
            name: capitalizeFirstLetter(correctedName),
            capital: capitalFr,
            flag: country.flags?.png || "",
            population: country.population ? country.population.toLocaleString() : "Inconnue",
            area: country.area ? `${country.area.toLocaleString()} km²` : "Inconnue",
            continent: translations.continents[country.continents?.[0] as keyof typeof translations.continents] || "Inconnu",
            region: translations.subregions[country.region as keyof typeof translations.subregions] || country.region || "Inconnue",
            subregion:
              translations.subregions[country.subregion as keyof typeof translations.subregions] || country.subregion || "Inconnue",
            languages,
            currency: country.currencies ? Object.values(country.currencies).map((cur: any) => cur.name).join(", ") : "N/A",
            timezones: country.timezones ? country.timezones.join(", ") : "N/A",
            borders: country.borders ? country.borders.join(", ") : "Aucune frontière"
          };
        });

        formattedCountries.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(formattedCountries);
        setFilteredCountries(formattedCountries);
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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDetails();
      }
    }

    if (selectedCountryIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCountryIndex]);

  useEffect(() => {
    let filtered = countries;

    if (selectedContinent) {
      filtered = filtered.filter((country) => country.continent === selectedContinent);
    }

    filtered = filtered.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.languages.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCountries(filtered);
  }, [searchTerm, selectedContinent, countries]);

  function openCountryDetails(index: number) {
    setSelectedCountryIndex(index);
  }

  function closeDetails() {
    setSelectedCountryIndex(null);
  }

  function nextCountry() {
    setSelectedCountryIndex((prevIndex) => {
      if (prevIndex === null) return prevIndex;
      return (prevIndex + 1) % filteredCountries.length;
    });
  }

  function prevCountry() {
    setSelectedCountryIndex((prevIndex) => {
      if (prevIndex === null) return prevIndex;
      return (prevIndex - 1 + filteredCountries.length) % filteredCountries.length;
    });
  }

  return (
    <div className="page-shell pt-24 sm:pt-28">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Liste des Pays</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Filtrez par continent ou recherchez un pays, une capitale ou une langue.
          </p>
        </header>

        {isLoading && <p className="text-center text-slate-600">Chargement des pays...</p>}

        {loadError && (
          <div className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-rose-700 text-center shadow-sm">
            <p className="font-semibold">{loadError}</p>
            <button onClick={() => setReloadKey((prev) => prev + 1)} className="btn-primary mt-3">
              Réessayer
            </button>
          </div>
        )}

        <div className="card-frame">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Rechercher un pays, une capitale, une langue..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="select-field sm:max-w-xs"
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
            >
              <option value="">Tous les continents</option>
              <option value="Europe">Europe</option>
              <option value="Asie">Asie</option>
              <option value="Afrique">Afrique</option>
              <option value="Amérique du Nord">Amérique du Nord</option>
              <option value="Amérique du Sud">Amérique du Sud</option>
              <option value="Océanie">Océanie</option>
              <option value="Antarctique">Antarctique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCountries.map((country, index) => (
            <button
              type="button"
              key={country.id}
              onClick={() => openCountryDetails(index)}
              className="surface p-4 flex flex-col items-center text-center cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={country.flag}
                alt={`Drapeau de ${country.name}`}
                className="w-24 h-16 rounded-md object-cover"
              />
              <h3 className="text-lg font-bold mt-2 text-slate-900">{country.name}</h3>
              <p className="text-sm text-slate-600">
                Capitale : <span className="font-semibold">{country.capital}</span>
              </p>
            </button>
          ))}
        </div>

        {selectedCountryIndex !== null && (
          <div
            id="modal-overlay"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={(e) => e.target.id === "modal-overlay" && closeDetails()}
          >
            <div className="surface p-6 max-w-2xl w-full relative text-left">
              <button onClick={closeDetails} className="btn-ghost absolute top-3 right-3">
                Fermer
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">{filteredCountries[selectedCountryIndex].name}</h2>
                <img
                  src={filteredCountries[selectedCountryIndex].flag}
                  alt={filteredCountries[selectedCountryIndex].name}
                  className="w-40 h-28 mx-auto my-4 rounded-lg"
                />
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <strong>Capitale :</strong> {filteredCountries[selectedCountryIndex].capital}
                </p>
                <p>
                  <strong>Population :</strong> {filteredCountries[selectedCountryIndex].population}
                </p>
                <p>
                  <strong>Superficie :</strong> {filteredCountries[selectedCountryIndex].area}
                </p>
                <p>
                  <strong>Continent :</strong> {filteredCountries[selectedCountryIndex].continent}
                </p>
                <p>
                  <strong>Langues :</strong> {filteredCountries[selectedCountryIndex].languages}
                </p>
                <p>
                  <strong>Devise :</strong> {filteredCountries[selectedCountryIndex].currency}
                </p>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                <strong>Localisation :</strong>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    filteredCountries[selectedCountryIndex].name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-teal-700 font-semibold hover:underline"
                >
                  Voir sur Google Maps
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                <button onClick={prevCountry} className="btn-secondary w-full sm:w-auto">
                  Précédent
                </button>
                <button onClick={nextCountry} className="btn-primary w-full sm:w-auto">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
