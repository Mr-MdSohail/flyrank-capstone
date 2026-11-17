export interface ShowRecommendation {
  id: number;
  name: string;
  genres: string[];
  rating: number | null;
  summary: string;
  image: string | null;
  matchScore: number;
  matchReason: string;
}

const MOOD_KEYWORDS: Record<string, string> = {
  mystery: "mystery",
  thriller: "thriller",
  suspense: "thriller",
  crime: "crime",
  detective: "detective",
  sci: "science-fiction",
  scifi: "science-fiction",
  space: "space",
  comedy: "comedy",
  funny: "comedy",
  drama: "drama",
  action: "action",
  anime: "anime",
  documentary: "documentary",
};

export function extractSearchQuery(prompt: string): { query: string; matchedKeyword: string } {
  const cleaned = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (MOOD_KEYWORDS[token]) {
      return { query: MOOD_KEYWORDS[token], matchedKeyword: token };
    }
  }
  const fallback = tokens.find((t) => t.length > 3) || "thriller";
  return { query: fallback, matchedKeyword: fallback };
}

export function stripHtml(raw: string | null | undefined): string {
  if (!raw) return "No synopsis available for this title.";
  return raw.replace(/<[^>]*>/g, "").trim();
}

export function rankShows(rawItems: Array<{ score?: number; show: { id: number; name: string; genres?: string[]; rating?: { average: number | null }; summary?: string | null; image?: { medium?: string } | null } }>, prompt: string, matchedKeyword: string): ShowRecommendation[] {
  return rawItems.slice(0, 6).map((item, idx) => {
    const s = item.show;
    const genres = s.genres && s.genres.length > 0 ? s.genres : ["Drama"];
    const baseScore = typeof item.score === "number" ? Math.min(99, Math.max(72, Math.round(item.score * 100))) : Math.max(75, 95 - idx * 3);
    return {
      id: s.id,
      name: s.name,
      genres,
      rating: s.rating?.average ?? null,
      summary: stripHtml(s.summary),
      image: s.image?.medium ?? null,
      matchScore: baseScore,
      matchReason: `Matched your "${matchedKeyword}" intent across ${genres.slice(0, 2).join(" & ")} themes from prompt: "${prompt.slice(0, 60)}".`,
    };
  });
}
