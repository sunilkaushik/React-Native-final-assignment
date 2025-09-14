import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Article } from "../../types/news";

const CACHE_KEY = "cache:news:top-headlines";
const META_KEY  = "cache:news:meta"; // totalResults + timestamp
export const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 min

export interface NewsCacheMeta {
  savedAt: number;        // epoch ms
  totalResults: number;
  pageSize: number;
  country: string;
}

export async function saveNewsCache(
  articles: Article[],
  meta: NewsCacheMeta
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(articles)),
    AsyncStorage.setItem(META_KEY, JSON.stringify(meta)),
  ]);
}

export async function readNewsCache(): Promise<{
  articles: Article[]; meta: NewsCacheMeta | null;
}> {
  const [a, m] = await Promise.all([
    AsyncStorage.getItem(CACHE_KEY),
    AsyncStorage.getItem(META_KEY),
  ]);
  return {
    articles: a ? JSON.parse(a) as Article[] : [],
    meta: m ? JSON.parse(m) as NewsCacheMeta : null,
  };
}

export function isStale(meta: NewsCacheMeta | null, ttlMs = DEFAULT_TTL_MS) {
  if (!meta) return true;
  return Date.now() - meta.savedAt > ttlMs;
}

export async function clearNewsCache() {
  await Promise.all([
    AsyncStorage.removeItem(CACHE_KEY),
    AsyncStorage.removeItem(META_KEY),
  ]);
}
