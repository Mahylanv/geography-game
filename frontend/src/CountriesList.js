import React, { useState, useEffect } from "react";
import axios from "axios";

// mettre en majuscule
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const countryNameCorrections = {
    "Swaziland": "Eswatini",
    "Tchéquie": "République Tchèque",
    "Congo (Rép. dém.)": "République Démocratique du Congo",
    "Ahvenanmaa": "Åland"
};

// capitales traduites
const capitalTranslations = {
    "kyiv": "Kiev", "beirut": "Beyrouth", "vienna": "Vienne", "copenhagen": "Copenhague",
    "prague": "Prague", "warsaw": "Varsovie", "bucharest": "Bucarest", "brussels": "Bruxelles",
    "lisbon": "Lisbonne", "moscow": "Moscou", "beijing": "Pékin", "athens": "Athènes",
    "cairo": "Le Caire", "havana": "La Havane", "mexico city": "Mexico", "london": "Londres",
    "damascus": "Damas", "washington, d.c.": "Washington", "riyadh": "Riyad", "manila": "Manille",
    "baku": "Bakou", "tashkent": "Tachkent", "mogadishu": "Mogadiscio", "tehran": "Téhéran",
    "nicosia": "Nicosie", "santo domingo": "Saint Domingue", "andorra la vella": "Andorre La Vieille",
    "valletta": "La Valette", "baghdad": "Bagdad", "kathmandu": "Kathmandou", "dushanbe": "Douchanbé",
    "singapore": "Singapour", "tbilisi": "Tbilissi", "yerevan": "Erevan", "kabul": "Kaboul",
    "addis ababa": "Addis Abeba", "algiers": "Alger", "dhaka": "Dacca", "sana'a": "Sanaa",
    "thimphu": "Thimphou", "ulan bator": "Oulan-Bator", "port of spain": "Port d'Espagne"
};

// langues traduites
const languageTranslations = {
    "English": "Anglais", "French": "Français", "Spanish": "Espagnol", "German": "Allemand",
    "Chinese": "Chinois", "Japanese": "Japonais", "Portuguese": "Portugais", "Russian": "Russe",
    "Arabic": "Arabe", "Hindi": "Hindi", "Italian": "Italien", "Dutch": "Néerlandais",
    "Korean": "Coréen", "Greek": "Grec", "Turkish": "Turc", "Swedish": "Suédois",
    "Polish": "Polonais", "Hebrew": "Hébreu", "Finnish": "Finnois", "Danish": "Danois",
    "Norwegian": "Norvégien", "Czech": "Tchèque", "Hungarian": "Hongrois", "Thai": "Thaïlandais",
    "Vietnamese": "Vietnamien", "Indonesian": "Indonésien", "Armenian": "Arménien", "Ukrainian": "Ukrainien",
    "Albanian": "Albanien", "Belarusian": "Biélorusse", "Burmese": "Birman", "Serbian": "Serbe", "Croatian": "Croate", "Bosnian": "Bosniaque",
    "Bulgarian": "Bulgare", "Turc": "Turque", "Comorian": "Comorien", "Estonian": "Estonien", "Georgian": "Géorgien",
    "Irish": "Irlandais", "Icelandic": "Islandais", "Latvian": "Letton", "Luxembourgish": "Luxembourgeois", "Macedonian": "Macédonien", "Malagasy": "Malgache",
    "Romanian": "Roumain", "Nepali": "Népalais", "Slovak": "Slovaque",
};

// regions traduites
const translations = {
    continents: {
        "Europe": "Europe", "Asia": "Asie", "Africa": "Afrique", "North America": "Amérique du Nord",
        "Oceania": "Océanie", "Antarctica": "Antarctique", "South America": "Amérique du Sud",
    },
    subregions: {
        "Northern Europe": "Europe du Nord", "Southern Europe": "Europe du Sud", "Western Europe": "Europe de l'Ouest",
        "Eastern Europe": "Europe de l'Est", "Central Asia": "Asie centrale", "South Asia": "Asie du Sud",
        "Southeast Asia": "Asie du Sud-Est", "East Asia": "Asie de l'Est", "Middle East": "Moyen-Orient",
        "North America": "Amérique du Nord", "South America": "Amérique du Sud", "Central America": "Amérique centrale",
        "Caribbean": "Caraïbes", "West Africa": "Afrique de l'Ouest", "Central Africa": "Afrique centrale",
        "East Africa": "Afrique de l'Est", "Southern Africa": "Afrique australe", "Melanesia": "Mélanésie",
        "Micronesia": "Micronésie", "Polynesia": "Polynésie"
    }
};

function CountriesList() {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [selectedCountryIndex, setSelectedCountryIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContinent, setSelectedContinent] = useState("");

    useEffect(() => {
        axios.get("https://restcountries.com/v3.1/all")
            .then((res) => {
                const formattedCountries = res.data.map((country, index) => {
                    const capitalEn = country.capital ? country.capital[0] : "Inconnue";
                    const capitalFr = capitalTranslations[capitalEn.toLowerCase()] || capitalizeFirstLetter(capitalEn);
                    const correctedName = countryNameCorrections[country.translations.fra.common] || country.translations.fra.common;
                    const languages = country.languages
                        ? Object.values(country.languages).map(lang => languageTranslations[lang] || lang).join(", ")
                        : "N/A";
                    return {
                        id: index,
                        name: capitalizeFirstLetter(correctedName),
                        capital: capitalFr,
                        flag: country.flags?.png || "",
                        population: country.population ? country.population.toLocaleString() : "Inconnue",
                        area: country.area ? country.area.toLocaleString() + " km²" : "Inconnue",
                        continent: translations.continents[country.continents?.[0]] || "Inconnu",
                        region: translations.subregions[country.region] || country.region || "Inconnue",
                        subregion: translations.subregions[country.subregion] || country.subregion || "Inconnue",
                        languages: languages,
                        currency: country.currencies ? Object.values(country.currencies).map(cur => cur.name).join(", ") : "N/A",
                        timezones: country.timezones ? country.timezones.join(", ") : "N/A",
                        borders: country.borders ? country.borders.join(", ") : "Aucune frontière"
                    };
                });

                formattedCountries.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(formattedCountries);
                setFilteredCountries(formattedCountries);
            })
            .catch((err) => console.error("Erreur de récupération des pays :", err));
    }, []);

    // **Ajout d'un effet pour gérer la fermeture avec "Échap"**
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                closeDetails();
            }
        }

        // Ajoute un écouteur d'événement uniquement si la modale est ouverte
        if (selectedCountryIndex !== null) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedCountryIndex]);

    // Fonction de filtrage
    useEffect(() => {
        let filtered = countries;

        // Filtrer par continent
        if (selectedContinent) {
            filtered = filtered.filter((country) => country.continent === selectedContinent);
        }

        // Filtrer par recherche
        filtered = filtered.filter((country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.languages.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredCountries(filtered);
    }, [searchTerm, selectedContinent, countries]);

    function openCountryDetails(index) {
        setSelectedCountryIndex(index);
    }

    function closeDetails() {
        setSelectedCountryIndex(null);
    }

    function nextCountry() {
        setSelectedCountryIndex((prevIndex) => (prevIndex + 1) % filteredCountries.length);
    }

    function prevCountry() {
        setSelectedCountryIndex((prevIndex) => (prevIndex - 1 + filteredCountries.length) % filteredCountries.length);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">🌍 Liste des Pays</h2>

            {/* Barre de recherche et filtre par continent */}
            <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-4">
                {/* Barre de recherche */}
                <input
                    type="text"
                    placeholder="Rechercher un pays, une capitale, une langue..."
                    className="px-4 py-2 w-96 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Sélecteur de continent */}
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

            {/* Liste des pays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCountries.map((country, index) => (
                    <div
                        key={index}
                        onClick={() => openCountryDetails(index)}
                        className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center border border-gray-200 cursor-pointer hover:shadow-xl"
                    >
                        <img src={country.flag} alt={`Drapeau de ${country.name}`} className="w-24 h-16 rounded-md object-cover" />
                        <h3 className="text-lg font-bold mt-2">{country.name}</h3>
                        <p className="text-gray-600">Capitale : <span className="font-semibold">{country.capital}</span></p>
                    </div>
                ))}
            </div>

            {/* Détails du pays */}
            {selectedCountryIndex !== null && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={(e) => e.target.id === "modal-overlay" && closeDetails()}
                >
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative text-center">
                        <button onClick={closeDetails} className="absolute top-2 right-2 text-gray-600 text-2xl">✖</button>
                        <h2 className="text-2xl font-bold">{filteredCountries[selectedCountryIndex].name}</h2>
                        <img src={filteredCountries[selectedCountryIndex].flag} className="w-40 h-28 mx-auto my-4" />
                        <p><strong>Capitale :</strong> {filteredCountries[selectedCountryIndex].capital}</p>
                        <p><strong>Population :</strong> {filteredCountries[selectedCountryIndex].population}</p>
                        <p><strong>Superficie :</strong> {filteredCountries[selectedCountryIndex].area}</p>
                        <p><strong>Continent :</strong> {filteredCountries[selectedCountryIndex].continent}</p>
                        <p><strong>Langues :</strong> {filteredCountries[selectedCountryIndex].languages}</p>
                        <p><strong>Devise :</strong> {filteredCountries[selectedCountryIndex].currency}</p>
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

export default CountriesList;