# CineMatch AI - Production AI-Enhanced Show Discovery

**Live Deployment:** https://flyrank-capstone-jet-eta.vercel.app/
**Health Diagnostics:** https://flyrank-capstone-jet-eta.vercel.app/health
**Repository:** https://github.com/Mr-MdSohail/flyrank-capstone

## 1. Project Brief
CineMatch AI solves decision fatigue when choosing what series to watch next by turning natural-language mood and genre descriptions into ranked, structured TV recommendations with instant watchlist tracking. Built for busy students and viewers who want fast, tailored suggestions without endless scrolling, it combines intent-based AI matching with live TVMaze catalog data and WCAG 2.1 AA keyboard accessibility.

## 2. Quick Local Setup (< 2 Minutes)
Run: `npm install && npm run dev` and open `http://localhost:3000`.

## 3. Architecture & AI Integration
- `src/app/discover/page.tsx`: Interactive AI mood matcher, quick presets, accessible synopsis modal (Escape close + focus restoration), and watchlist saving.
- `src/app/watchlist/page.tsx`: Persistent localStorage tracker with accessible tablist status filters.
- `src/app/api/recommend/route.ts`: Server API route extracting intent keywords (optional Gemini LLM + deterministic fallback), ranking live TVMaze results, and handling timeouts/errors safely.
- `playground/`: Hand-built W3C ARIA components and NOTES.md comparison against shadcn/ui.

## 4. Testing
Run `npm test` (Vitest + React Testing Library) to verify prompt extraction, HTML sanitization, watchlist filtering, and ARIA state transitions.

## 5. Known Limitations & Future Improvements
- Watchlist persists in browser localStorage; adding user auth and cloud sync would enable cross-device access.
