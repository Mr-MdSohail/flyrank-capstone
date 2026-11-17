export type WatchStatus = "planned" | "completed";

export interface WatchlistItem {
  id: number;
  name: string;
  genres: string[];
  rating: number | null;
  status: WatchStatus;
  addedAt: string;
}

export const WATCHLIST_STORAGE_KEY = "cinematch_watchlist_v1";

export function filterWatchlist(items: readonly WatchlistItem[], filter: "all" | WatchStatus): WatchlistItem[] {
  if (filter === "all") return [...items];
  return items.filter((item) => item.status === filter);
}
