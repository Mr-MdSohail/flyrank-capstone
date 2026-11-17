import Link from "next/link";

const screens = [
  { title: "Discover & AI Match", href: "/discover", desc: "Search catalog titles and request AI mood-based recommendations." },
  { title: "Personal Watchlist", href: "/watchlist", desc: "Track saved shows, ratings, and watch progress across sessions." },
  { title: "System Health Check", href: "/health", desc: "Verify live server-side API connectivity and deployment status." },
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10">
        <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
          Capstone Skeleton · Next.js App Router
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Discover your next favorite series with CineMatch AI
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
          Deployed day-one foundation featuring Server Components by default, Client Components for interactive controls, Tailwind design tokens, and live API health diagnostics.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/discover" className="rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]">
            Open Discover
          </Link>
          <Link href="/health" className="rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800">
            View Health Check
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {screens.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-blue-500/60">
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{s.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
