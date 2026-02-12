import { NextResponse } from "next/server";

const FIELDS_CORE = [
  "name",
  "translations",
  "capital",
  "flags",
  "region",
  "subregion",
  "continents",
  "cca3"
];

const FIELDS_STATS = [
  "name",
  "population",
  "area",
  "languages",
  "currencies",
  "timezones",
  "borders",
  "latlng",
  "unMember",
  "cca3"
];

const RESTCOUNTRIES_CORE_URL = `https://restcountries.com/v3.1/all?fields=${FIELDS_CORE.join(",")}`;
const RESTCOUNTRIES_STATS_URL = `https://restcountries.com/v3.1/all?fields=${FIELDS_STATS.join(",")}`;
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const REQUEST_TIMEOUT_MS = 8000;

let cache: { data: any[] | null; timestamp: number } = {
  data: null,
  timestamp: 0
};
type CacheStatus = "hit" | "miss" | "stale";

let inflight: Promise<{ data: any[]; cacheStatus: CacheStatus }> | null = null;

function isCacheFresh() {
  return cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS;
}

async function fetchCountriesArray(url: string, label: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    const raw = await response.text();
    let data: any = raw;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      // keep raw text
    }

    if (!response.ok) {
      const snippet = typeof data === "string" ? data.slice(0, 200) : JSON.stringify(data).slice(0, 200);
      throw new Error(`RestCountries ${response.status} (${label}): ${snippet}`);
    }

    if (!Array.isArray(data)) {
      const snippet = typeof data === "string" ? data.slice(0, 200) : JSON.stringify(data).slice(0, 200);
      throw new Error(`Réponse invalide de RestCountries (${label}): ${snippet}`);
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function mergeCountries(core: any[], stats: any[]) {
  const statsByKey = new Map<string, any>();
  for (const item of stats) {
    const key = item?.cca3 || item?.name?.common;
    if (key) {
      statsByKey.set(key, item);
    }
  }

  return core.map((item) => {
    const key = item?.cca3 || item?.name?.common;
    const extra = key ? statsByKey.get(key) : null;
    return extra ? { ...extra, ...item } : item;
  });
}

function applyOverrides(data: any[]) {
  return data.map((country) => {
    const cca3 = country?.cca3;
    const commonName = country?.name?.common;
    const isIndonesia = cca3 === "IDN" || commonName === "Indonesia";
    const isGrenada = cca3 === "GRD" || commonName === "Grenada";
    const isSanMarino = cca3 === "SMR" || commonName === "San Marino";

    if (!isIndonesia && !isGrenada && !isSanMarino) return country;

    return {
      ...country,
      capital: isIndonesia
        ? ["Nusantara"]
        : isGrenada
          ? ["Saint-Georges"]
          : ["Saint-Marin"]
    };
  });
}

async function loadCountries({ forceRefresh = false } = {}) {
  if (!forceRefresh && isCacheFresh()) {
    return { data: cache.data as any[], cacheStatus: "hit" as const };
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const [core, stats] = await Promise.all([
        fetchCountriesArray(RESTCOUNTRIES_CORE_URL, "core"),
        fetchCountriesArray(RESTCOUNTRIES_STATS_URL, "stats")
      ]);
      const data = applyOverrides(mergeCountries(core, stats));
      cache = { data, timestamp: Date.now() };
      return { data, cacheStatus: "miss" as const };
    } catch (error) {
      if (cache.data) {
        return { data: cache.data, cacheStatus: "stale" as const };
      }
      throw error;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get("refresh") === "1";

  try {
    const { data, cacheStatus } = await loadCountries({ forceRefresh });
    const response = NextResponse.json(data);
    response.headers.set("x-cache", cacheStatus);
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des pays :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les données des pays" },
      { status: 502 }
    );
  }
}
