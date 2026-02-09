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
    <div className="container mx-auto px-4 py-8 ">
      <h2 className="text-3xl font-bold text-center mb-6">🌍 Liste des Pays</h2>

      {isLoading && <p className="text-center text-gray-600 mb-6">Chargement des pays...</p>}

      {loadError && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-center">
          <p className="font-semibold">{loadError}</p>
          <button onClick={() => setReloadKey((prev) => prev + 1)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white">
            Réessayer
          </button>
        </div>
      )}

        <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Rechercher un pays, une capitale, une langue..."
            className="px-4 py-2 w-96 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700"
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="">🌎 Tous les continents</option>
            <option value="Europe">🇪🇺 Europe</option>
            <option value="Asie">🌏 Asie</option>
            <option value="Afrique">🌍 Afrique</option>
            <option value="Amérique du Nord">🌎 Amérique du Nord</option>
            <option value="Amérique du Sud">🌎 Amérique du Sud</option>
            <option value="Océanie">🌊 Océanie</option>
            <option value="Antarctique">❄️ Antarctique</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country, index) => (
            <div
              key={country.id}
              onClick={() => openCountryDetails(index)}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center border border-gray-200 cursor-pointer hover:shadow-xl"
            >
              <img src={country.flag} alt={`Drapeau de ${country.name}`} className="w-24 h-16 rounded-md object-cover" />
              <h3 className="text-lg font-bold mt-2">{country.name}</h3>
              <p className="text-gray-600">
                Capitale : <span className="font-semibold">{country.capital}</span>
              </p>
            </div>
          ))}
        </div>

        {selectedCountryIndex !== null && (
          <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={(e) => e.target.id === "modal-overlay" && closeDetails()}
          >
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative text-center">
              <button onClick={closeDetails} className="absolute top-2 right-2 text-gray-600 text-2xl">
                ✖
              </button>
              <h2 className="text-2xl font-bold">{filteredCountries[selectedCountryIndex].name}</h2>
              <img src={filteredCountries[selectedCountryIndex].flag} alt={filteredCountries[selectedCountryIndex].name} className="w-40 h-28 mx-auto my-4" />
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
              <p className="mt-4">
                <strong>📍 Localisation :</strong>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    filteredCountries[selectedCountryIndex].name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-2"
                >
                  Voir sur Google Maps 🌍
                </a>
              </p>
              <div className="flex justify-between mt-4">
                <button onClick={prevCountry}>⬅️ Précédent</button>
                <button onClick={nextCountry}>Suivant ➡️</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
