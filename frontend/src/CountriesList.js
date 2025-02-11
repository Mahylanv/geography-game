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
    const [selectedCountryIndex, setSelectedCountryIndex] = useState(null);

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
            })
            .catch((err) => console.error("Erreur de récupération des pays :", err));
    }, []);

    function openCountryDetails(index) {
        setSelectedCountryIndex(index);
    }

    function closeDetails() {
        setSelectedCountryIndex(null);
    }

    function nextCountry() {
        setSelectedCountryIndex((prevIndex) => (prevIndex + 1) % countries.length);
    }

    function prevCountry() {
        setSelectedCountryIndex((prevIndex) => (prevIndex - 1 + countries.length) % countries.length);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">🌍 Liste des Pays</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {countries.map((country, index) => (
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

            {selectedCountryIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative text-center">
                        <button onClick={closeDetails} className="absolute top-2 right-2">✖</button>
                        <h2 className="text-2xl font-bold">{countries[selectedCountryIndex].name}</h2>
                        <img src={countries[selectedCountryIndex].flag} className="w-40 h-28 mx-auto my-4" />
                        <p><strong>Capitale :</strong> {countries[selectedCountryIndex].capital}</p>
                        <p><strong>Population :</strong> {countries[selectedCountryIndex].population}</p>
                        <p><strong>Superficie :</strong> {countries[selectedCountryIndex].area}</p>
                        <p><strong>Continent :</strong> {countries[selectedCountryIndex].continent}</p>
                        <p><strong>Langues :</strong> {countries[selectedCountryIndex].languages}</p>
                        <p><strong>Devise :</strong> {countries[selectedCountryIndex].currency}</p>
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
