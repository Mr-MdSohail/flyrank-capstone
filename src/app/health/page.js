export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const baseUrl = process.env.NEXT_PUBLIC_TVMAZE_BASE_URL || "https://api.tvmaze.com";
  let status = "OK";
  let sampleShows = [];
  let errorMessage = "";

  try {
    const res = await fetch(`${baseUrl}/shows?page=0`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
    const data = await res.json();
    sampleShows = data.slice(0, 4).map((s) => ({
      id: s.id,
      name: s.name,
      rating: s.rating?.average ?? "NR",
    }));
  } catch (err) {
    status = "DEGRADED";
    errorMessage = err.message || "Fetch failed";
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">System Health Check</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Server-rendered live data verification from TVMaze upstream API.</p>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium">Upstream API Status</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "OK" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
            {status}
          </span>
        </div>
        {errorMessage ? (
          <p className="text-sm text-red-400">{errorMessage}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {sampleShows.map((show) => (
              <li key={show.id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-sm">
                <span className="font-semibold text-white">{show.name}</span>
                <span className="ml-2 text-xs text-[var(--text-muted)]">Rating: {show.rating}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
