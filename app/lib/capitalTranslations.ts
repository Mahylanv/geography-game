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
  "port of spain": "Port d'Espagne",
  "st. george's": "Saint-Georges",
  "saint-georges": "Saint-Georges",
  "city of san marino": "Saint-Marin",
  "saint-marin": "Saint-Marin",
  nusantara: "Nusantara"
};

export function translateCapital(capital?: string) {
  if (!capital) return "";
  const key = capital.toLowerCase();
  return capitalTranslations[key] || capital;
}

export { capitalTranslations };
