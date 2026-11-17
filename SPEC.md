# CineMatch AI - Capstone Specification

## 1. Overview
CineMatch AI is a responsive Next.js web application for discovering movies and TV series, saving a personal watchlist, and getting AI-assisted viewing recommendations based on mood, genre, or favorite titles.

## 2. Target Screens & Routes
- **Home (`/`):** Overview of CineMatch AI, quick navigation cards, and featured workflow summary (Server Component).
- **Discover (`/discover`):** Interactive search and AI recommendation prompt workspace placeholder (Client Component).
- **Watchlist (`/watchlist`):** Saved shows and watch-status tracker placeholder (Client Component).
- **Health Check (`/health`):** Server-rendered diagnostics page fetching live status and sample catalog data from the TVMaze public API.

## 3. Tech Stack & Architecture
- **Framework:** Next.js (App Router, Server Components by default, Client Components only for interactive search/watchlist controls).
- **Styling:** Tailwind CSS with custom CSS design tokens (`--bg-canvas`, `--bg-surface`, `--accent-primary`, `--text-primary`) responsive across 375px mobile and 1280px desktop viewports.
- **Deployment & Security:** Continuous preview deployments on Vercel; environment variables documented in `.env.example` with secrets excluded via `.gitignore`.