# Static prerendering for marketing pages

## Problem

BibleQ is a client-rendered CRA/React SPA deployed as static files to Firebase
Hosting. The initial HTML shipped for every route is a near-empty shell —
all content is rendered by React after the JS bundle loads. This means:

- Crawlers that don't execute JS (most AEO/answer-engine bots, some SEO
  crawlers) see nothing.
- Every route serves the same generic `<title>`/meta description from
  `public/index.html`, since `react-helmet` only updates `document.title`
  client-side after mount — there's nothing per-route in the raw HTML.

This is the highest-leverage fix identified in a broader review of why the
app has low search/answer-engine reach (see conversation context — other
follow-ups like content pages and analytics are tracked as separate,
later projects).

## Scope

Prerender only the marketing/static routes: `/`, `/games`, `/contact`.
`/create`, `/quiz`, `/results` stay client-rendered — they're auth-gated
and/or per-instance dynamic (individual shared quizzes), not realistic
SEO/AEO targets, and static snapshotting can't handle per-ID dynamic content
without extra plumbing (out of scope here).

## Approach

Post-build static snapshot via a custom Puppeteer script, **not**
`react-snap`. `react-snap` is unmaintained and built against
`ReactDOM.render`/legacy hydrate; it is not reliably compatible with React
19's `hydrateRoot`. Writing ~50 lines ourselves avoids fighting a dead
dependency, and gives full control over wait conditions per route.

No Firebase infra change needed: Hosting already serves static files from
`build/` with a catch-all rewrite to `index.html` for client-side routing.
Firebase's exact-path matching serves a route's own `index.html` (e.g.
`build/games/index.html`) before falling back to the rewrite, so writing
real per-route HTML files "just works" with the existing `firebase.json`.

### Build pipeline

- New script: `scripts/prerender.js`
  - Serves the `build/` directory locally (e.g. via `serve` or a tiny
    static http server).
  - Launches Puppeteer, visits each of `/`, `/games`, `/contact`.
  - Waits for real content to be visible (e.g. `waitForSelector('h1')`)
    before capturing — this rules out capturing a loading/blank state.
  - Writes the resulting `document.documentElement.outerHTML` to:
    - `build/index.html` (for `/`)
    - `build/games/index.html` (for `/games`)
    - `build/contact/index.html` (for `/contact`)
  - Closes the local server and browser.
- `package.json` `build` script becomes:
  `"react-scripts build && node scripts/prerender.js"`
- New dependency: `puppeteer` (devDependency), plus a lightweight static
  server (`serve` or Node's built-in `http`) if not already available.

### Per-route metadata

Because the script captures the DOM *after* React (and `react-helmet`)
finish rendering, whatever `<title>`/meta tags each page's `<MetaTags>`
component injected are already present in the captured HTML. This
incidentally fixes the "every route has identical meta tags" problem with
no extra code — `MetaTags.jsx` is unchanged.

### Required prerequisite fix: `AuthContext.jsx`

Currently:
```js
return (
  <AuthContext.Provider value={value}>
    {!loading && children}
    <div id="recaptcha-container"></div>
  </AuthContext.Provider>
);
```
The whole app renders nothing until Firebase's async auth check resolves.
This is an existing bug (blank flash on every load, even public pages) and
would also break hydration correctness once routes are prerendered: server
HTML has content, client would initially want to unmount it back to blank.

Fix: render `children` unconditionally. `loading` stays in the context
value so `ProtectedRoute` (the only consumer that needs it) keeps its own
spinner behavior unchanged.

### Correctness / hydration

- Puppeteer visits each route with a fresh, unauthenticated browser
  context (no persisted Firebase session) — captured HTML always reflects
  the logged-out view, which is what a crawler/AEO bot should see.
- React 19's `hydrateRoot` takes over the static markup client-side. With
  the `AuthContext` fix above, server-captured state (`user: null`, no
  loading gate) matches initial client state before Firebase's async check
  completes, so there's no hydration mismatch.

### Error handling

If Puppeteer fails on any route (timeout waiting for the content selector,
navigation error, crash), the script exits non-zero and fails the build —
no silent fallback to the empty CRA shell. Better to catch it in CI/local
build than ship a blank route again.

### Testing plan

- After `npm run build`, inspect `build/index.html`, `build/games/index.html`,
  `build/contact/index.html` directly (no JS execution, e.g. `curl` /
  reading the file) — confirm real content and correct per-route
  `<title>`/meta description are present.
- Serve `build/` locally (e.g. `npx serve build`) and manually click
  through `/`, `/games`, `/contact`, and into the auth-gated `/create` to
  confirm hydration doesn't break interactivity and there's no visible
  flicker/flash on load.

## Out of scope (tracked separately, not this project)

- Content pages targeting search/AEO queries (trivia lists, how-to guides).
- Analytics wiring (GA4 / Firebase Analytics events).
- Visual/landing-page redesign.
- Prerendering dynamic per-quiz routes.
