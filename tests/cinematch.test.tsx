import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { extractSearchQuery, rankShows, stripHtml } from "../src/lib/recommender";
import { filterWatchlist, WatchlistItem } from "../src/lib/watchlist";
import WatchlistPage from "../src/app/watchlist/page";
import { Disclosure } from "../playground/Disclosure";

describe("CineMatch AI Recommender Engine", () => {
  it("extracts mood keywords from prompts", () => {
    expect(extractSearchQuery("I want a dark mystery thriller series").query).toBe("mystery");
    expect(extractSearchQuery("x y z").query).toBe("thriller");
  });

  it("sanitizes HTML and ranks shows", () => {
    expect(stripHtml("<p>A <b>gripping</b> case.</p>")).toBe("A gripping case.");
    const ranked = rankShows(
      [{ score: 0.91, show: { id: 101, name: "Sherlock", genres: ["Drama"], rating: { average: 8.9 }, summary: "<p>Detective</p>" } }],
      "detective",
      "detective"
    );
    expect(ranked[0].matchScore).toBe(91);
  });
});

describe("Watchlist & Accessible UI", () => {
  const sample: WatchlistItem[] = [
    { id: 1, name: "Dark", genres: ["Thriller"], rating: 8.8, status: "planned", addedAt: "2026-11-17" },
    { id: 2, name: "Breaking Bad", genres: ["Crime"], rating: 9.5, status: "completed", addedAt: "2026-11-17" },
  ];

  beforeEach(() => localStorage.clear());

  it("filters items by status", () => {
    expect(filterWatchlist(sample, "all")).toHaveLength(2);
    expect(filterWatchlist(sample, "planned")[0].name).toBe("Dark");
    expect(filterWatchlist(sample, "completed")[0].name).toBe("Breaking Bad");
  });

  it("renders WatchlistPage and toggles Disclosure aria-expanded", () => {
    render(<WatchlistPage />);
    expect(screen.getByRole("tablist")).toBeTruthy();
    render(<Disclosure summary="Details">Hidden text</Disclosure>);
    const btn = screen.getByRole("button", { name: /Details/i });
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });
});
