"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/health", label: "Health" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          CineMatch <span className="text-[var(--accent-primary)]">AI</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-muted)] hover:bg-slate-800 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
