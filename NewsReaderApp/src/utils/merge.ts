import type { Article } from "../../types/news";

export function mergeByUrl(existing: Article[], incoming: Article[]): Article[] {
  const seen = new Set(existing.map(a => a.url));
  const dedupedIncoming = incoming.filter(a => !seen.has(a.url));
  return existing.concat(dedupedIncoming);
}
