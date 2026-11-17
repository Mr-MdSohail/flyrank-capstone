"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { filterWatchlist, WATCHLIST_STORAGE_KEY, WatchlistItem, WatchStatus } from "../../lib/watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<"all" | WatchStatus>("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  const persist = (next: WatchlistItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const toggleStatus = (id: number) => {
    persist(items.map((item) => (item.id === id ? { ...item, status: item.status === "planned" ? "completed" : "planned" } : item)));
  };

  const removeItem = (id: number) => {
    persist(items.filter((item) => item.id !== id));
  };

  const visible = filterWatchlist(items, filter);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Personal Watchlist</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Saved series persisted locally across sessions ({items.length} total).</p>
        </div>
        <div role="tablist" aria-label="Filter watchlist by status" className="flex gap-2">
          {(["all", "planned", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize ${filter === tab ? "bg-[var(--accent-primary)] text-white" : "border border-[var(--border-subtle)] text-slate-300 hover:bg-slate-800"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center space-y-3">
          <p className="text-sm text-slate-300">No shows in the <span className="font-semibold text-white">{filter}</span> view yet.</p>
          <Link href="/discover" className="inline-block rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-white">
            Find Shows in Discover
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id} className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">{item.status}</span>
                  <span className="text-xs text-slate-300">Rating: {item.rating ?? "NR"}</span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-white">{item.name}</h2>
                <p className="mt-1 text-xs text-slate-300">{item.genres.join(" · ")}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => toggleStatus(item.id)} className="flex-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800">
                  Mark {item.status === "planned" ? "Completed" : "Planned"}
                </button>
                <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-950/50">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
