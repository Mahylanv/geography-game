"use client";

export const PREDEFINED_CAPITAL_SHORTCUTS: Record<string, string> = {
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
  pekin: "beijing",
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
  douchanbe: "dushanbe",
  doucanbé: "dushanbe",
  doucanbe: "dushanbe",
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
  "port d'espagne": "port of spain",
  ndjamena: "n'djamena",
  koweit: "kuwait city",
  "saint marin": "city of san marino"
};

export function normalizeCapitalKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(city of|city)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function buildCapitalShortcuts(shortcuts: Record<string, string>, capitals: string[]) {
  const normalizedShortcuts: Record<string, string> = {};

  const registerShortcut = (alias: string, target: string) => {
    const normalizedAlias = normalizeCapitalKey(alias);
    const normalizedTarget = normalizeCapitalKey(target);

    if (!normalizedAlias || !normalizedTarget) return;
    normalizedShortcuts[normalizedAlias] = normalizedTarget;
  };

  Object.entries(shortcuts).forEach(([alias, target]) => {
    registerShortcut(alias, target);
  });

  capitals.forEach((capital) => {
    registerShortcut(capital, capital);
  });

  return normalizedShortcuts;
}

export function isCapitalAnswerCorrect(userAnswer: string, correctCapital: string, shortcuts: Record<string, string>) {
  let normalizedUserAnswer = normalizeCapitalKey(userAnswer);
  const normalizedCorrectAnswer = normalizeCapitalKey(correctCapital);

  if (shortcuts[normalizedUserAnswer]) {
    normalizedUserAnswer = shortcuts[normalizedUserAnswer];
  }

  return normalizedUserAnswer === normalizedCorrectAnswer;
}
