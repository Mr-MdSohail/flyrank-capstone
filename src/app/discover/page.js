"use client";
import { useState } from "react";

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState("");
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Discover & AI Recommendations</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Placeholder workspace for live show search and AI recommendation prompts.</p>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <label className="block text-sm font-medium" htmlFor="ai-prompt">Describe what you want to watch</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ai-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Mind-bending mystery thriller under 3 seasons..."
            className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
          <button type="button" className="rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]">
            Preview Prompt
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          {prompt ? `Draft query ready: "${prompt}" (AI API route wired in next phase)` : "Type a mood or genre above to verify interactive Client Component state."}
        </p>
      </div>
    </section>
  );
}
