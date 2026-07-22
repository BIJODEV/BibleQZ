# BibleQz — Project Context

## Stack
- Single-page app (SPA), deployed on Firebase Hosting
- Frontend: [fill in — React/Vue/vanilla JS, whatever it actually is]
- Backend/data: [Firestore? Firebase Auth? fill in]
- No separate staging environment — this is production. Treat all changes as live.

## Commands
- Install: `npm install`
- Local dev: `npm run dev` (or your actual command)
- Build: `npm run build`
- Deploy: `firebase deploy` — NEVER run this without explicit confirmation from me first
- Lint/test: [fill in if you have these]

## Rules
- Do not run `firebase deploy`, `git push`, or any destructive Firestore commands without asking me first.
- Keep changes scoped to the specific file/component I mention — don't refactor unrelated files unless asked.
- This is a small SPA; don't run broad repo-wide searches (`grep -r`, `find .`) unless the task genuinely requires it. Ask before exploring beyond the files I've pointed you to.

## Structure
- `/src/components` — UI components
- `/src/pages` — route-level views
- [add your actual folder layout here]

## Known fragile areas
- [e.g., "quiz scoring logic in scoreEngine.js is tightly coupled to Firestore schema — be careful editing"]

## UI Consistency
   - Shared UI patterns (spacing, colors, card styles) should match existing components — check `QuizCard.jsx` as the reference implementation before styling anything new.
   - Don't introduce new Tailwind/CSS patterns without checking if an existing one already covers the case.