"use client";

const CACHE_KEY = "geodex_countries_cache_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12h
const REQUEST_TIMEOUT_MS = 8000;

type CachePayload = {
  data: any[];
  timestamp: number;
};

let memoryCache: CachePayload | null = null;

function readCache(): CachePayload | null {
  if (memoryCache) {
    return memoryCache;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed || !Array.isArray(parsed.data) || typeof parsed.timestamp !== "number") {
      return null;
    }
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: any[]) {
  const payload: CachePayload = { data, timestamp: Date.now() };
  memoryCache = payload;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

function isFresh(cache: CachePayload) {
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

export async function fetchCountries({ forceRefresh = false } = {}) {
  const cache = readCache();
  if (!forceRefresh && cache && isFresh(cache)) {
    return cache.data;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `/api/countries${forceRefresh ? "?refresh=1" : ""}`;
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Réponse invalide de l'API");
    }
    writeCache(data);
    return data;
  } catch (error) {
    const fallback = readCache();
    if (fallback && Array.isArray(fallback.data) && fallback.data.length > 0) {
      return fallback.data;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
