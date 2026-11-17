import { NextRequest, NextResponse } from "next/server";
import { extractSearchQuery, rankShows } from "../../../lib/recommender";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt || prompt.length < 2) {
      return NextResponse.json({ error: "Please enter a mood, genre, or show description (at least 2 characters)." }, { status: 400 });
    }

    let { query, matchedKeyword } = extractSearchQuery(prompt);
    let mode: "llm-assisted" | "heuristic-fallback" = "heuristic-fallback";

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Extract a single 1-2 word TV show search keyword for this request. Reply with ONLY the keyword: ${prompt}` }] }],
          }),
          signal: AbortSignal.timeout(4000),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const text = aiJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text && text.length <= 30) {
            query = text.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
            matchedKeyword = query;
            mode = "llm-assisted";
          }
        }
      } catch {
        // Graceful fallback to local intent extractor if LLM times out or key is absent
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_TVMAZE_BASE_URL || "https://api.tvmaze.com";
    const upstream = await fetch(`${baseUrl}/search/shows?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: `Catalog provider returned HTTP${upstream.status}. Please try again.` }, { status: 502 });
    }

    const data = await upstream.json();
    const recommendations = rankShows(Array.isArray(data) ? data : [], prompt, matchedKeyword);
    return NextResponse.json({ recommendations, queryUsed: query, mode });
  } catch {
    return NextResponse.json({ error: "Unable to generate recommendations right now. Check your connection and retry." }, { status: 500 });
  }
}
