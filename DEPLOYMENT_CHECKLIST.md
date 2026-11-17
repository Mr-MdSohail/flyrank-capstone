# Deployment & Operations Checklist

- [x] `npx tsc --noEmit` and `npm run build` pass with zero errors.
- [x] `npm test` passes all unit and component tests.
- [x] Secrets excluded via `.gitignore`; template in `.env.example`.
- [x] Error states & timeouts (`AbortSignal.timeout`) handled gracefully with fallback matching.
- [x] WCAG 2.1 AA contrast & keyboard navigation verified across mobile (375px) and desktop (1280px).
- [x] Monitoring via `/health` and rollback via Vercel Instant Rollback or `git revert HEAD`.
