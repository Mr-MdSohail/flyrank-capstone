import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "CineMatch AI — Capstone Skeleton",
  description: "AI-powered movie and show discovery capstone skeleton",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-[var(--border-subtle)] py-4 text-center text-xs text-[var(--text-muted)]">
          CineMatch AI · FlyRank Capstone Skeleton
        </footer>
      </body>
    </html>
  );
}
