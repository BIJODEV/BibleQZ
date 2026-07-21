# Marketing Page Prerendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/`, `/games`, and `/contact` serve real, per-route static HTML (with correct `<title>`/meta tags) at Firebase Hosting's build output, so JS-less crawlers and AEO bots see actual content instead of an empty SPA shell.

**Architecture:** Add a custom Puppeteer-based prerender script that runs after `react-scripts build`, serves the built `build/` folder locally, visits each marketing route, waits for real content to render, and overwrites the corresponding `build/**/index.html` with the fully-rendered DOM. React 19's `hydrateRoot` takes over on the client. This requires two small prerequisite fixes: `AuthContext.jsx` currently blanks the whole app until Firebase's async auth check resolves (breaks hydration correctness and is an existing UX bug), and `src/index.js` always calls `createRoot` (needs to call `hydrateRoot` when the root element already has prerendered content).

**Tech Stack:** React 19, react-dom/client (`hydrateRoot`/`createRoot`), Puppeteer (devDependency), `serve` (devDependency, local static file server for the prerender crawl), Jest + React Testing Library (already present).

## Global Constraints

- Prerender only `/`, `/games`, `/contact` — not `/create`, `/quiz`, `/results` (out of scope per design doc).
- Do not use `react-snap` — incompatible with React 19's `hydrateRoot` (see design doc).
- No `firebase.json` changes needed — existing catch-all rewrite plus Firebase's exact-path-first matching already serves per-route `index.html` files correctly.
- `node_modules` is not currently installed in this repo — the first task must run `npm install` before anything else will work.

---

### Task 1: Fix `AuthContext` blank-render gate

**Files:**
- Modify: `src/contexts/AuthContext.jsx`
- Test: `src/contexts/AuthContext.test.jsx` (new)

**Interfaces:**
- Consumes: nothing new.
- Produces: `AuthProvider` now renders `children` unconditionally and immediately; `loading` remains in the context value returned by `useAuth()` unchanged, for `ProtectedRoute` to keep using.

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: completes without error, creates `node_modules/`.

- [ ] **Step 2: Write the failing test**

Create `src/contexts/AuthContext.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => () => {}), // never fires — simulates an in-flight auth check
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  signOut: jest.fn(),
  RecaptchaVerifier: jest.fn(),
}));

jest.mock('../firebase/config', () => ({
  auth: {},
}));

test('renders children immediately without waiting for the auth check to resolve', () => {
  render(
    <AuthProvider>
      <div>child content</div>
    </AuthProvider>
  );

  expect(screen.getByText('child content')).toBeInTheDocument();
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `CI=true npx react-scripts test src/contexts/AuthContext.test.jsx --watchAll=false`
Expected: FAIL — `child content` not found, because `AuthProvider` currently renders `{!loading && children}` and `loading` starts `true`.

- [ ] **Step 4: Fix the gate**

In `src/contexts/AuthContext.jsx`, change:

```jsx
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
```

to:

```jsx
  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npx react-scripts test src/contexts/AuthContext.test.jsx --watchAll=false`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/contexts/AuthContext.jsx src/contexts/AuthContext.test.jsx
git commit -m "Render AuthProvider children immediately instead of gating on auth loading state"
```

---

### Task 2: Hydration-aware root mount

**Files:**
- Create: `src/rootRender.js`
- Create: `src/rootRender.test.js`
- Modify: `src/index.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `mountApp(rootElement: HTMLElement, app: React.ReactElement): void` — exported from `src/rootRender.js`. Calls `ReactDOM.hydrateRoot(rootElement, app)` if `rootElement.hasChildNodes()` is true (prerendered content present), otherwise `ReactDOM.createRoot(rootElement).render(app)`.

- [ ] **Step 1: Write the failing tests**

Create `src/rootRender.test.js`:

```js
import { mountApp } from './rootRender';
import ReactDOM from 'react-dom/client';

jest.mock('react-dom/client', () => ({
  hydrateRoot: jest.fn(),
  createRoot: jest.fn(() => ({ render: jest.fn() })),
}));

test('hydrates when the root element already has prerendered content', () => {
  const root = document.createElement('div');
  root.innerHTML = '<p>prerendered</p>';
  const app = <div>app</div>;

  mountApp(root, app);

  expect(ReactDOM.hydrateRoot).toHaveBeenCalledWith(root, app);
  expect(ReactDOM.createRoot).not.toHaveBeenCalled();
});

test('creates a fresh root when the root element is empty', () => {
  const root = document.createElement('div');
  const app = <div>app</div>;

  mountApp(root, app);

  expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `CI=true npx react-scripts test src/rootRender.test.js --watchAll=false`
Expected: FAIL — `Cannot find module './rootRender'`.

- [ ] **Step 3: Implement `mountApp`**

Create `src/rootRender.js`:

```js
import ReactDOM from 'react-dom/client';

export function mountApp(rootElement, app) {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, app);
  } else {
    ReactDOM.createRoot(rootElement).render(app);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `CI=true npx react-scripts test src/rootRender.test.js --watchAll=false`
Expected: PASS (2 tests)

- [ ] **Step 5: Wire `mountApp` into the entry point**

Replace the contents of `src/index.js` with:

```js
import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mountApp } from './rootRender';

mountApp(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

- [ ] **Step 6: Manually verify normal dev mode still works**

Run: `npm start`
Expected: app loads at `http://localhost:3000` exactly as before (root div is empty on first load in dev, so `createRoot` path is taken).

- [ ] **Step 7: Commit**

```bash
git add src/rootRender.js src/rootRender.test.js src/index.js
git commit -m "Use hydrateRoot when the root element already has prerendered content"
```

---

### Task 3: Prerender script and build pipeline

**Files:**
- Create: `scripts/prerender.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `mountApp` from Task 2 (client-side hydration target), `build/` output of `react-scripts build`.
- Produces: overwritten `build/index.html`, `build/games/index.html`, `build/contact/index.html` containing fully-rendered marketing page HTML with per-route `<title>`/meta tags.

- [ ] **Step 1: Install prerender dependencies**

Run: `npm install --save-dev puppeteer serve`
Expected: `puppeteer` and `serve` added to `devDependencies` in `package.json`, `package-lock.json` updated.

- [ ] **Step 2: Write the prerender script**

Create `scripts/prerender.js`:

```js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PORT = 45123;
const BUILD_DIR = path.join(__dirname, '..', 'build');

const ROUTES = [
  { path: '/', outputFile: 'index.html' },
  { path: '/games', outputFile: path.join('games', 'index.html') },
  { path: '/contact', outputFile: path.join('contact', 'index.html') },
];

function startServer() {
  return new Promise((resolve, reject) => {
    const serveBin = path.join(__dirname, '..', 'node_modules', '.bin', 'serve');
    const server = spawn(serveBin, ['-s', BUILD_DIR, '-l', String(PORT)], {
      stdio: 'pipe',
    });

    let resolved = false;
    const onData = (data) => {
      if (!resolved && data.toString().includes('Accepting connections')) {
        resolved = true;
        server.stdout.off('data', onData);
        resolve(server);
      }
    };

    server.stdout.on('data', onData);
    server.on('error', reject);

    // Fallback in case the banner text differs across `serve` versions.
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(server);
      }
    }, 3000);
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route.path}`;

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 10000 });

  const html = await page.evaluate(() => document.documentElement.outerHTML);
  const outputPath = path.join(BUILD_DIR, route.outputFile);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `<!DOCTYPE html>\n${html}`);

  await page.close();
  console.log(`Prerendered ${route.path} -> ${route.outputFile}`);
}

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch();

  try {
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
```

- [ ] **Step 3: Wire the script into the build pipeline**

In `package.json`, change:

```json
    "build": "CI=false react-scripts build",
```

to:

```json
    "build": "CI=false react-scripts build && node scripts/prerender.js",
```

- [ ] **Step 4: Run the full build and verify it succeeds**

Run: `npm run build`
Expected: exits 0, prints `Prerendered / -> index.html`, `Prerendered /games -> games/index.html`, `Prerendered /contact -> contact/index.html`.

- [ ] **Step 5: Verify each route has real, distinct content and correct metadata**

Run:
```bash
grep -o '<title>[^<]*</title>' build/index.html
grep -o '<title>[^<]*</title>' build/games/index.html
grep -o '<title>[^<]*</title>' build/contact/index.html
grep -c "Welcome to" build/index.html
```
Expected: three different `<title>` values (matching each page's `MetaTags` `title` prop — e.g. `build/index.html` should contain "BibleQ - Create Interactive Bible Quizzes for Your Group"), and the `grep -c` count is at least 1 (confirms real rendered content, not just an empty `<div id="root">`).

- [ ] **Step 6: Manually verify hydration works with no visible flicker**

Run: `npx serve build` (in a separate terminal), then open `http://localhost:3000` (or whatever port `serve` reports) in a browser.
Expected: page shows full content immediately (no blank flash), all links (`/games`, `/contact`, `/create`) work, and `/create` still redirects to the `Login` view when logged out.

- [ ] **Step 7: Commit**

```bash
git add scripts/prerender.js package.json package-lock.json
git commit -m "Add post-build prerendering for marketing routes"
```
