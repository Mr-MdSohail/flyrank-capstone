# Project Stack & Conventions

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript (React)
- Version Control: Git & GitHub (Conventional Commits)
- Deployment: Vercel / Netlify

## Coding Rules
- Keep code clean, modular, and mobile-responsive.
- Always review and test AI-generated code before committing.
- Never use browser alert() or confirm() dialogs for UI feedback; render inline ARIA status banners (role="status") instead.
- All form inputs must validate on blur and submit, trim whitespace, and expose errors via aria-invalid and aria-describedby.
- Every new UI component must include co-located Vitest + React Testing Library tests verified with npx vitest run.
