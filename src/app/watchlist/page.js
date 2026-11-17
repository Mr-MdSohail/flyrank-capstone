"use client";
import { useState } from "react";

export default function WatchlistPage() {
  const [filter, setFilter] = useState("all");
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Personal Watchlist</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Routed placeholder for saved movies and series.</p>
        </div>
        <div className="flex gap-2">
          {["all", "planned", "completed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${filter === tab ? "bg-[var(--accent-primary)] text-white" : "border border-[var(--border-subtle)] text-[var(--text-muted)]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-sm text-[var(--text-muted)]">
        Showing <span className="font-semibold text-white">{filter}</span> watchlist items · Persistence connects in Phase 3.
      </div>
    </section>
  );
}
