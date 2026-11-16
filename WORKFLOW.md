# AI-Assisted Development Workflow: Vague vs. Spec-Driven

 1. Experiment Overview
To evaluate how prompt specificity and verification loops impact AI-assisted coding, I implemented a React User Settings Form twice on separate branches from main:
- Round 1 (`feat/settings-vague`): Single vague prompt without Plan Mode, acceptance criteria, or automated tests.
- Round 2 (`feat/settings-spec`): Structured specification prompt in Plan Mode with explicit validation rules, ARIA requirements, localStorage persistence, and a Vitest verification loop.

 2. Side-by-Side Comparison
| Dimension | Round 1 (`feat/settings-vague`) | Round 2 (`feat/settings-spec`) |
| :--- | :--- | :--- |
| **Correctness** | Accepted empty usernames and invalid emails without validation; lacked whitespace trimming or persistence. | Enforced 3-20 alphanumeric/underscore username rules, email regex validation, whitespace trimming, and `localStorage` (`user_settings`) hydration on mount. |
| **Accessibility** | Relied on blocking `window.alert()` popups; no `aria-invalid`, `aria-describedby`, or live status regions. | Linked inline error messages via `aria-invalid` and `aria-describedby`, and used an accessible `role="status"` banner for feedback. |
| **Edge Cases** | No reset flow, no disabled submit state during async saves or invalid inputs, and no corrupted storage handling. | Handled blur/submit validation, disabled Submit when invalid after touch or saving, wrapped `JSON.parse` in `try/catch`, and added a Reset to Defaults flow. |
| **Review Time** | Fast initial generation (~30s), but required heavy manual inspection because every edge case had to be discovered by hand. | Slightly longer planning phase, but verification was fast and repeatable because all 4 behaviors were locked in by `npx vitest run`. |

 3. Concrete AI Mistake Caught During Review
In Round 2, while reviewing `src/SettingsForm.jsx` before committing, I caught two subtle bugs in the AI-generated `handleReset` function: it still used a blocking `window.confirm()` dialog despite the spec banning browser popups, and it reset React state without calling `localStorage.removeItem("user_settings")`—meaning a page reload would restore the old settings. I replaced `window.confirm()` and added `localStorage.removeItem("user_settings")`, then verified the fix with a dedicated reset test in `src/SettingsForm.test.jsx`.

 4. Key Takeaway
Spec-driven prompts paired with Plan Mode and automated tests turn the AI from a code generator into a verifiable engineering partner. Locking project conventions into `GEMINI.md` prevents recurring issues like browser popups and untested components across future tasks.