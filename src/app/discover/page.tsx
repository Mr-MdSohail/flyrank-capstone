"use client";
import React, { useEffect, useRef, useState } from "react";
import type { ShowRecommendation } from "../../lib/recommender";
import { WATCHLIST_STORAGE_KEY, WatchlistItem } from "../../lib/watchlist";

const PRESETS = [
  "Mind-bending mystery thriller with tight pacing",
  "Smart crime detective drama with plot twists",
  "Lighthearted comedy to unwind after work",
  "Gripping sci-fi space adventure",
];

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState<string>(PRESETS[0]);
  const [results, setResults] = useState<ShowRecommendation[]>([]);
  const [mode, setMode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedShow, setSelectedShow] = useState<ShowRecommendation | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (raw) {
        const parsed: WatchlistItem[] = JSON.parse(raw);
        setSavedIds(parsed.map((i) => i.id));
      }
    } catch {
      setSavedIds([]);
    }
  }, []);

  useEffect(() => {
    if (!selectedShow) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedShow(null);
        requestAnimationFrame(() => lastTriggerRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedShow]);

  const runRecommendation = async (customPrompt?: string) => {
    const activePrompt = (customPrompt ?? prompt).trim();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch recommendations.");
        setResults([]);
      } else {
        setResults(data.recommendations || []);
        setMode(data.mode || "");
      }
    } catch {
      setError("Network error while contacting recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (show: ShowRecommendation) => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      const existing: WatchlistItem[] = raw ? JSON.parse(raw) : [];
      if (existing.some((i) => i.id === show.id)) return;
      const updated: WatchlistItem[] = [
        { id: show.id, name: show.name, genres: show.genres, rating: show.rating, status: "planned", addedAt: new Date().toISOString() },
        ...existing,
      ];
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
      setSavedIds(updated.map((i) => i.id));
    } catch {
      setError("Could not persist item to browser storage.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Discover & AI Match</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Describe a mood, genre, or plot style to generate structured show recommendations.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); runRecommendation(); }} className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <label htmlFor="ai-prompt-input" className="block text-sm font-semibold text-white">What are you in the mood to watch?</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ai-prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., High-IQ psychological thriller or detective mystery..."
            className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none"
          />
          <button type="submit" disabled={loading} className="rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60">
            {loading ? "Matching..." : "Get AI Matches"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick mood presets">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setPrompt(preset); runRecommendation(preset); }}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1 text-xs text-slate-300 hover:border-blue-400 hover:text-white"
            >
              {preset}
            </button>
          ))}
        </div>
      </form>
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      {mode && !error && (
        <p className="text-xs text-[var(--text-muted)]" aria-live="polite">
          Engine mode: <span className="font-semibold text-blue-300">{mode}</span> · Showing {results.length} structured matches
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((show) => {
          const isSaved = savedIds.includes(show.id);
          return (
            <article key={show.id} className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">{show.matchScore}% Match</span>
                  <span className="text-xs text-slate-300">Rating: {show.rating ?? "NR"}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{show.name}</h2>
                <p className="text-xs text-blue-300">{show.genres.join(" · ")}</p>
                <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">{show.matchReason}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { lastTriggerRef.current = e.currentTarget; setSelectedShow(show); }}
                  className="flex-1 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Synopsis
                </button>
                <button
                  type="button"
                  disabled={isSaved}
                  onClick={() => handleSave(show)}
                  className="flex-1 rounded-lg bg-[var(--accent-primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] disabled:bg-emerald-700"
                >
                  {isSaved ? "Saved ✓" : "+ Watchlist"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {selectedShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedShow(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="modal-show-title" className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h2 id="modal-show-title" className="text-xl font-bold text-white">{selectedShow.name}</h2>
              <button type="button" onClick={() => setSelectedShow(null)} aria-label="Close synopsis dialog" className="rounded-lg px-2.5 py-1 text-sm text-slate-300 hover:bg-slate-800">✕</button>
            </div>
            <p className="mt-2 text-xs text-blue-300">{selectedShow.genres.join(" · ")} · Rating: {selectedShow.rating ?? "NR"}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{selectedShow.summary}</p>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setSelectedShow(null)} className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
