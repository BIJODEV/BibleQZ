# UI Makeover Phase 1: Design System Foundation + Header/Footer/Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the "Modern Sky" design system (color tokens, Poppins/Inter type, lucide-react icons, shared `Button`/`Input` primitives) and apply it to `Header.jsx`, `Footer.jsx`, and `Home.jsx` — the three files that make up most visitors' first impression of the app.

**Architecture:** Add new, additive Tailwind tokens (`brand-blue`, `brand-violet`, `ink`, `slate-body`, `mist`, `sky-tint-1`, `sky-tint-2`, plus `font-heading`, `rounded-btn`, `shadow-brand`) alongside the existing `bible-*` tokens rather than replacing them — this lets Phase 1 restyle only its three files without instantly recoloring Login/Quiz/Games pages that won't get matching shape/type updates until their own phases (Phases 2–4, planned separately). Build two shared primitives (`Button`, `Input`) that Phase 1 consumes and later phases will reuse. Replace functional emoji in the three Phase 1 files with `lucide-react` icons; games-section emoji stays untouched (out of scope, Phase 4).

**Tech Stack:** React 19, Tailwind CSS 3, `lucide-react` (new dependency), Jest + React Testing Library for the two primitives.

## Global Constraints

- New tokens are **additive** — `bible-blue` (`#1E3A8A`), `bible-purple` (`#4C1D95`), `bible-gold` (`#D4AF37`) in `tailwind.config.js` must remain unchanged. Do not edit their values.
- `font-heading` (Poppins) must only be applied via the explicit `font-heading` Tailwind utility class on elements this plan's tasks touch (`Header.jsx`, `Footer.jsx`, `Home.jsx`). Never add a global `@layer base` rule that would apply Poppins to every heading site-wide — that would instantly change typography on Login/Quiz/Games pages before their own phases.
- Inter (body text) loading via Google Fonts in `public/index.html` is intentionally global (not phase-scoped) — `src/index.css` already has a pre-existing `body { font-family: 'Inter', sans-serif; }` rule; it just wasn't loading a real Inter font file before. This is expected and correct per the design doc, unlike the heading-font restriction above.
- **Jest cannot import `react-router-dom` in this repo.** There is a pre-existing, accepted, out-of-scope resolution failure (`react-router-dom` v7's package `exports` map vs. this repo's jest/react-scripts 5 setup — same failure already visible in `src/App.test.js`). `Header.jsx`, `Footer.jsx`, and `Home.jsx` all import `Link` from `react-router-dom`, so **none of them can have a Jest/RTL unit test** in this repo as it stands. Verify those three tasks via `npm start` (manual browse) and `npm run build && npx serve build` (grep + manual browse) instead — do not attempt to write a Jest test for these three files, and do not treat "no automated test" as a gap for those specific tasks in review.
- `Button.jsx`'s own base classes must never include padding or text-size utilities — only structural classes (`inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors duration-200`) plus each variant's color treatment. Callers always pass padding/text-size via `className`. This is deliberate: Tailwind resolves conflicting utility classes by their position in the generated stylesheet, not by `className` string order, so baking in padding that a caller later tries to override via `className` is unreliable, not just inelegant.
- Preserve `Footer.jsx`'s copyright line as the single template-literal expression it already is — `{`© ${currentYear} Helping groups grow in Scripture`}` — never split it back into adjacent text/expression JSX siblings. That exact pattern previously caused a verified React hydration-mismatch bug (fixed in the prerendering project) because the prerender script's `outerHTML` snapshot has no `<!-- -->` boundary markers that real SSR would insert between adjacent text/expression siblings.
- Use these exact `lucide-react` import names (verified against the installed package): `Church`, `Menu`, `X`, `FileText`, `Share2`, `BarChart3`, `History`, `Mic2`, `Users`, `BookOpen`, `GraduationCap`, `Heart`, `Globe`, `Gamepad2`, `Check`, `Timer`, `Trophy`, `Star`.

---

### Task 1: Design tokens, fonts, lucide-react

**Files:**
- Modify: `tailwind.config.js`
- Modify: `public/index.html`
- Modify: `package.json` (via `npm install`)

**Interfaces:**
- Consumes: nothing new.
- Produces: Tailwind utility classes `bg-brand-blue`, `text-brand-blue`, `border-brand-blue` (and violet/ink/slate-body/mist/sky-tint-1/sky-tint-2 equivalents), `font-heading`, `rounded-btn`, `shadow-brand` — consumed by Tasks 2–5. `lucide-react` installed as a dependency — consumed by Tasks 3–5.

- [ ] **Step 1: Add the new tokens to `tailwind.config.js`**

Replace the file's contents with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bible-gold': '#D4AF37',
        'bible-blue': '#1E3A8A',
        'bible-purple': '#4C1D95',
        'brand-blue': '#2E6FDB',
        'brand-violet': '#7C5CFC',
        'ink': '#1B2333',
        'slate-body': '#5B6474',
        'mist': '#DCE3F0',
        'sky-tint-1': '#EAF4FB',
        'sky-tint-2': '#F1EAFB',
      },
      fontFamily: {
        'scripture': ['Georgia', 'serif'],
        'heading': ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'btn': '10px',
      },
      boxShadow: {
        'brand': '0 6px 16px -6px rgba(46,111,219,0.4)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Load Poppins and Inter in `public/index.html`**

Find this block (currently only preconnect hints, no actual stylesheet):

```html
      <!-- Primary Preload & Preconnect --> 
      <link rel="preconnect" href="https://fonts.googleapis.com"> 
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
```

Add a stylesheet link immediately after it:

```html
      <!-- Primary Preload & Preconnect --> 
      <link rel="preconnect" href="https://fonts.googleapis.com"> 
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Install lucide-react**

Run: `npm install lucide-react`
Expected: exits 0, `lucide-react` appears under `dependencies` in `package.json`, `package-lock.json` updated.

- [ ] **Step 4: Verify the build picks up the new tokens and font link**

Run: `npm run build`
Expected: exits 0, prints the three `Prerendered ...` lines (existing prerender script from the previous project, unaffected by this change).

Then run:
```bash
grep -o 'fonts.googleapis.com/css2[^"]*' build/index.html
```
Expected: prints the Poppins/Inter stylesheet URL (confirms the font link survived the prerender snapshot). Note: there is no build-output check for the new color/shadow/radius tokens at this step — Tailwind's JIT compiler only emits utility classes for tokens actually referenced in JSX, and no component references them yet (that starts in Task 2). Verify those tokens by reading `tailwind.config.js` directly instead.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js public/index.html package.json package-lock.json
git commit -m "Add Modern Sky design tokens, Poppins/Inter fonts, lucide-react dependency"
```

---

### Task 2: Button and Input shared primitives

**Files:**
- Create: `src/components/UI/Button.jsx` (currently an empty stub)
- Create: `src/components/UI/Button.test.jsx`
- Create: `src/components/UI/Input.jsx` (currently an empty stub)
- Create: `src/components/UI/Input.test.jsx`

**Interfaces:**
- Consumes: `brand-blue`, `brand-violet`, `ink`, `slate-body`, `mist`, `sky-tint-1`, `rounded-btn`, `shadow-brand` Tailwind tokens from Task 1.
- Produces: `Button` — default export from `src/components/UI/Button.jsx`. Props: `variant` (`'primary' | 'secondary' | 'accent' | 'ghost' | 'outline-inverse'`, default `'primary'`), `as` (element/component to render, default `'button'`), `className`, `children`, plus passthrough of all other props (e.g. `onClick`, `to`, `href`, `type`). `Input` — default export from `src/components/UI/Input.jsx`. Props: `className`, plus passthrough of all standard `<input>` props (`value`, `onChange`, `placeholder`, `type`, `maxLength`, etc.).

- [ ] **Step 1: Write the failing Button tests**

Create `src/components/UI/Button.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders children and calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button', { name: 'Click me' });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies primary variant classes by default', () => {
  render(<Button>Primary</Button>);
  const button = screen.getByRole('button', { name: 'Primary' });

  expect(button.className).toContain('bg-brand-blue');
  expect(button.className).toContain('shadow-brand');
});

test('applies secondary variant classes when variant="secondary"', () => {
  render(<Button variant="secondary">Secondary</Button>);
  const button = screen.getByRole('button', { name: 'Secondary' });

  expect(button.className).toContain('border-mist');
  expect(button.className).not.toContain('bg-brand-blue');
});

test('applies accent variant classes when variant="accent"', () => {
  render(<Button variant="accent">Games</Button>);
  const button = screen.getByRole('button', { name: 'Games' });

  expect(button.className).toContain('bg-brand-violet');
});

test('applies outline-inverse variant classes for use on colored backgrounds', () => {
  render(<Button variant="outline-inverse">Explore Games</Button>);
  const button = screen.getByRole('button', { name: 'Explore Games' });

  expect(button.className).toContain('border-white');
  expect(button.className).toContain('text-white');
  expect(button.className).not.toContain('bg-brand-blue');
});

test('renders as a different element when the "as" prop is provided', () => {
  render(<Button as="a" href="/create">Create Quiz</Button>);
  const link = screen.getByRole('link', { name: 'Create Quiz' });

  expect(link.tagName).toBe('A');
  expect(link).toHaveAttribute('href', '/create');
  expect(link.className).toContain('bg-brand-blue');
});
```

(Note: this deliberately uses `as="a" href="..."` rather than `as={Link}` from `react-router-dom` — see Global Constraints on why Jest can't import `react-router-dom` in this repo. Real usage in later tasks will pass `as={Link}`, which works fine at build/runtime; only the unit test avoids the import.)

- [ ] **Step 2: Run the Button tests to verify they fail**

Run: `CI=true npx react-scripts test src/components/UI/Button.test.jsx --watchAll=false`
Expected: FAIL — `Cannot find module './Button'` or similar (the component doesn't exist yet).

- [ ] **Step 3: Implement Button**

Replace the contents of `src/components/UI/Button.jsx` (currently empty) with:

```jsx
import React from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-brand-blue text-white shadow-brand hover:bg-blue-700',
  secondary: 'bg-white text-ink border border-mist hover:bg-gray-50',
  accent: 'bg-brand-violet text-white shadow-brand hover:bg-purple-700',
  ghost: 'bg-transparent text-brand-blue hover:bg-sky-tint-1',
  'outline-inverse': 'bg-transparent border border-white text-white hover:bg-white hover:text-brand-blue',
};

const Button = ({
  variant = 'primary',
  as: Component = 'button',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors duration-200 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
```

- [ ] **Step 4: Run the Button tests to verify they pass**

Run: `CI=true npx react-scripts test src/components/UI/Button.test.jsx --watchAll=false`
Expected: PASS (6 tests)

- [ ] **Step 5: Write the failing Input tests**

Create `src/components/UI/Input.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

test('renders with the given value and placeholder', () => {
  render(<Input value="hello" placeholder="Enter your name" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Enter your name');

  expect(input).toHaveValue('hello');
});

test('calls onChange when the user types', () => {
  const handleChange = jest.fn();
  render(<Input value="" placeholder="Phone number" onChange={handleChange} />);
  const input = screen.getByPlaceholderText('Phone number');

  fireEvent.change(input, { target: { value: '123' } });

  expect(handleChange).toHaveBeenCalledTimes(1);
});

test('applies the shared border/radius classes', () => {
  render(<Input placeholder="Test" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Test');

  expect(input.className).toContain('rounded-btn');
  expect(input.className).toContain('border-mist');
});
```

- [ ] **Step 6: Run the Input tests to verify they fail**

Run: `CI=true npx react-scripts test src/components/UI/Input.test.jsx --watchAll=false`
Expected: FAIL — `Cannot find module './Input'` or similar.

- [ ] **Step 7: Implement Input**

Replace the contents of `src/components/UI/Input.jsx` (currently empty) with:

```jsx
import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-btn border border-mist px-4 py-2.5 text-sm text-ink placeholder-slate-body focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${className}`}
      {...props}
    />
  );
};

export default Input;
```

- [ ] **Step 8: Run the Input tests to verify they pass**

Run: `CI=true npx react-scripts test src/components/UI/Input.test.jsx --watchAll=false`
Expected: PASS (3 tests)

- [ ] **Step 9: Commit**

```bash
git add src/components/UI/Button.jsx src/components/UI/Button.test.jsx src/components/UI/Input.jsx src/components/UI/Input.test.jsx
git commit -m "Add Button and Input shared UI primitives"
```

---

### Task 3: Restyle Header

**Files:**
- Modify: `src/components/Layout/Header.jsx`

**Interfaces:**
- Consumes: `brand-blue`, `brand-violet`, `rounded-btn`, `font-heading` tokens (Task 1); `Church`, `Menu`, `X` from `lucide-react`.
- Produces: no new interface — same default export, same props (none), same rendered nav structure/behavior (menu toggle state unchanged).

- [ ] **Step 1: Replace `src/components/Layout/Header.jsx`**

Replace the entire file with:

```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Church, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/create', label: 'Create Quiz' },
  { to: '/games', label: 'Games' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-brand-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-brand-violet p-2 rounded-btn">
              <Church className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">BibleQ</h1>
              <p className="text-sm text-blue-200">Meditate • Learn • Grow</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-brand-violet transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 border-t border-blue-600 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block hover:text-brand-violet transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Manually verify in dev mode**

Run: `npm start`
Expected: at `http://localhost:3000`, the header shows a violet icon badge with a church icon (not ⛪), "BibleQ" in the new heading font, blue header background. Resize the browser below `768px` width (or use dev tools device toolbar): the desktop nav disappears, a hamburger icon (☰-style lucide `Menu` icon) appears; clicking it opens the mobile nav and swaps the icon to an `X`; clicking a mobile nav link closes the menu and navigates.

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout/Header.jsx
git commit -m "Restyle Header with Modern Sky tokens and lucide icons"
```

---

### Task 4: Restyle Footer

**Files:**
- Modify: `src/components/Layout/Footer.jsx`

**Interfaces:**
- Consumes: `brand-blue`, `brand-violet`, `rounded-btn`, `font-heading` tokens (Task 1); `Church` from `lucide-react`.
- Produces: no new interface — same default export, same props (none), same rendered structure.

- [ ] **Step 1: Replace `src/components/Layout/Footer.jsx`**

Replace the entire file with:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-blue text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand & Description */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="bg-brand-violet p-2 rounded-btn">
              <Church className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold">BibleQ</h3>
              <p className="text-blue-200 text-sm">
                {`© ${currentYear} Helping groups grow in Scripture`}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/create" className="text-blue-200 hover:text-white transition-colors">
              Create Quiz
            </Link>
            <Link to="/games" className="text-blue-200 hover:text-white transition-colors">
              Games
            </Link>
            <Link to="/contact" className="text-blue-200 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

Note: the copyright line stays exactly as the single template-literal expression it already was (see Global Constraints) — only the surrounding colors/icon/heading font changed.

- [ ] **Step 2: Manually verify in dev mode**

Run: `npm start` (if not already running from Task 3)
Expected: footer shows a violet icon badge with a church icon, "BibleQ" in the new heading font, blue footer background, nav links unchanged.

- [ ] **Step 3: Verify no hydration regression via a real build**

Run: `npm run build`
Expected: exits 0, prints the three `Prerendered ...` lines.

Run: `npx serve build -l 3196` (backgrounded), then check `http://localhost:3196/` in a browser (or headless browser tool if available) and inspect the console.
Expected: no `Minified React error #418` logged — confirms the copyright line's single-expression structure survived this restyle intact.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout/Footer.jsx
git commit -m "Restyle Footer with Modern Sky tokens and lucide icons"
```

---

### Task 5: Restyle Home page

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `Button` from `src/components/UI/Button.jsx` (Task 2); `brand-blue`, `brand-violet`, `ink`, `slate-body`, `mist`, `sky-tint-1`, `sky-tint-2`, `font-heading` tokens (Task 1); `Church`, `FileText`, `Share2`, `BarChart3`, `History`, `Mic2`, `Users`, `BookOpen`, `GraduationCap`, `Heart`, `Globe`, `Gamepad2`, `Check`, `Timer`, `Trophy`, `Star` from `lucide-react`.
- Produces: no new interface — same default export, same props (none), same route (`/`), same conditional CTA behavior based on `user` from `useAuth()`.

- [ ] **Step 1: Replace `src/pages/Home.jsx`**

Replace the entire file with:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/SEO/MetaTags';
import Button from '../components/UI/Button';
import bibleGamesImage from '../assets/images/games.png';
import {
  Church,
  FileText,
  Share2,
  BarChart3,
  History,
  Mic2,
  Users,
  BookOpen,
  GraduationCap,
  Heart,
  Globe,
  Gamepad2,
  Check,
  Timer,
  Trophy,
  Star,
} from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'Create Quizzes', shortDesc: 'Multiple question types', desc: 'Create customized Bible quizzes with multiple question types.' },
  { icon: Share2, title: 'Easy Sharing', shortDesc: 'No accounts needed', desc: 'Share instantly. No accounts needed for participants.' },
  { icon: BarChart3, title: 'Live Results', shortDesc: 'Real-time tracking', desc: 'Track responses and scores in real-time.' },
  { icon: History, title: 'Results History', shortDesc: 'Track progress', desc: 'Access all quiz results anytime.' },
];

const STEPS = [
  { number: '1', title: 'Create', desc: 'Build quiz with intuitive editor' },
  { number: '2', title: 'Share', desc: 'Share link with your group' },
  { number: '3', title: 'Analyze', desc: 'View live results & insights' },
];

const USE_CASES = [
  { icon: Mic2, shortTitle: 'Sunday Sermons', shortDesc: 'Reinforce messages', desc: 'Reinforce key points from your message' },
  { icon: Users, shortTitle: 'Small Groups', shortDesc: 'Engage members', desc: 'Engage every member with interactive study' },
  { icon: BookOpen, shortTitle: 'Bible Studies', shortDesc: 'Test understanding', desc: 'Test understanding and spark discussion' },
  { icon: GraduationCap, shortTitle: 'Sunday School', shortDesc: 'All ages', desc: 'Make learning fun for all ages' },
  { icon: Heart, shortTitle: 'Youth Ministry', shortDesc: 'Connect with youth', desc: 'Connect with youth through interactive content' },
  { icon: Globe, shortTitle: 'Online Church', shortDesc: 'Virtual services', desc: 'Perfect for virtual services and groups' },
];

const GAME_STATS = [
  { icon: BarChart3, label: 'Stats' },
  { icon: Timer, label: 'Timed' },
  { icon: Trophy, label: 'Rewards' },
  { icon: Star, label: 'Stars' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <MetaTags 
        title="BibleQ - Create Interactive Bible Quizzes for Your Group"
        description="Free Bible quiz creator for churches and study groups. Create, share, and track results in real-time. No login required for participants."
        keywords="bible quiz, bible study, christian education, sunday school, bible meditation, quiz creator"
      />
      
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16 bg-gradient-to-br from-sky-tint-1 to-sky-tint-2 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-blue to-brand-violet inline-block p-3 md:p-4 rounded-2xl mb-4 md:mb-6">
            <Church className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-ink mb-3 md:mb-6">
            Welcome to <span className="text-brand-violet">BibleQ</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-slate-body mb-6 md:mb-8 leading-relaxed px-4">
            Create Bible quizzes, track results live, and deepen Scripture understanding.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
            <Button as={Link} to="/create" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              {user ? 'Create Quiz' : 'Get Started Free'}
            </Button>
            {user && (
              <Button as={Link} to="/create" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Quiz History
              </Button>
            )}
            <Button as={Link} to="/games" variant="accent" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              <Gamepad2 className="w-5 h-5" />
              <span>Games</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-3 md:mb-4 px-4">
            Everything for Bible Study
          </h2>
          <p className="text-sm md:text-lg text-slate-body text-center mb-6 md:mb-12 max-w-2xl mx-auto px-4">
            For pastors and group leaders
          </p>
          
          {/* Mobile Compact Grid */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {FEATURES.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-3 border border-mist hover:border-brand-blue transition-colors duration-200 text-center"
                >
                  <feature.icon className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                  <h3 className="font-semibold text-ink mb-1 text-sm">{feature.title}</h3>
                  <p className="text-slate-body text-xs leading-tight">{feature.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-sky-tint-1 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-brand-blue" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-ink mb-3">{feature.title}</h3>
                <p className="text-slate-body text-sm md:text-base">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-6 md:mb-12">
            Simple 3-Step Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-blue text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-base md:text-xl font-heading font-semibold text-ink mb-2 md:mb-3">{step.title}</h3>
                <p className="text-slate-body text-xs md:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-6 md:mb-12 px-4">
            For Every Ministry
          </h2>
          
          {/* Mobile Compact Grid */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {USE_CASES.map((useCase, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-3 border border-mist hover:border-brand-blue transition-colors duration-200 text-center"
                >
                  <useCase.icon className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                  <h3 className="font-semibold text-ink mb-1 text-xs">{useCase.shortTitle}</h3>
                  <p className="text-slate-body text-xs leading-tight">{useCase.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {USE_CASES.map((useCase, index) => (
              <div key={index} className="card text-center hover:border-brand-blue transition-colors duration-300">
                <useCase.icon className="w-7 h-7 md:w-8 md:h-8 text-brand-blue mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-ink mb-2 text-base md:text-lg">{useCase.shortTitle}</h3>
                <p className="text-slate-body text-sm md:text-base">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bible Games Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 rounded-2xl mb-8 md:mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <div className="bg-brand-violet w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Gamepad2 className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <h2 className="text-xl md:text-3xl font-heading font-bold text-ink mb-3 md:mb-4">
              Bible Games
            </h2>
            <p className="text-base md:text-xl text-slate-body max-w-2xl mx-auto">
              Interactive challenges to test your Scripture knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Games Description */}
            <div className="text-center lg:text-left">
              <h3 className="text-lg md:text-2xl font-heading font-semibold text-ink mb-3 md:mb-4">
                Bible Challenges
              </h3>
              <p className="text-slate-body mb-4 md:mb-6 text-sm md:text-base">
                Multiple choice quizzes, memorization games, and character challenges for personal or group use.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6">
                {[
                  'Multiple choice',
                  'Scripture games',
                  'Bible characters',
                  'Book recognition'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs md:text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button as={Link} to="/games" variant="accent" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                <span>Play Games</span>
                <Gamepad2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Games Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-mist hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-violet rounded-lg mb-3 flex items-center overflow-hidden">
                <img 
                    src={bibleGamesImage} 
                    alt="Bible Games Preview"
                    className="w-full h-full object-cover"
                  />
              </div>
              <h4 className="text-base md:text-lg font-heading font-semibold text-ink mb-2 text-center">
                Bible Games
              </h4>
              <p className="text-slate-body text-xs md:text-sm text-center mb-3">
                Feedback • Tracking • Levels
              </p>
              <div className="flex justify-center space-x-3">
                {GAME_STATS.map((stat, index) => (
                  <stat.icon key={index} className="w-5 h-5 text-brand-blue" aria-label={stat.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-violet rounded-2xl p-4 md:p-8 lg:p-12 text-center text-white mx-4">
        <h2 className="text-xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Start Creating Bible Quizzes</h2>
        <p className="text-base md:text-xl text-blue-100 mb-4 md:mb-8 max-w-2xl mx-auto">
          Join leaders transforming Bible teaching with interactive quizzes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button as={Link} to="/create" variant="outline-inverse" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
            Create First Quiz
          </Button>
          <Button as={Link} to="/games" variant="outline-inverse" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
            Explore Games
          </Button>
        </div>
        {user && (
          <p className="text-blue-100 mt-3 text-xs md:text-sm">
            Welcome back! Full access available.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: Manually verify in dev mode**

Run: `npm start` (if not already running)
Expected: Home page shows the new hero (sky-tint gradient background, violet church icon badge, Poppins heading, blue primary CTA + violet "Games" CTA), lucide icons in place of all previous emoji in the feature cards, use-case cards, games section, and final CTA. Clicking "Get Started Free"/"Create Quiz" navigates to `/create` (or shows the `Login` view if logged out, same as before — this task didn't touch auth logic). Clicking "Games" navigates to `/games`.

- [ ] **Step 3: Verify the production build and hydration**

Run: `npm run build`
Expected: exits 0, prints the three `Prerendered ...` lines.

Run: `npx serve build -l 3195` (backgrounded), open `http://localhost:3195/` in a browser (or headless browser tool if available), check the console.
Expected: no `Minified React error #418` and no other console errors. Visually confirm the hero, feature cards, use cases, games section, and final CTA all render with the new colors/icons/fonts and match what you saw in dev mode.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "Restyle Home page with Modern Sky design system"
```
