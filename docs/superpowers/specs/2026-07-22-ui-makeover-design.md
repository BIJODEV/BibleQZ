# UI makeover: design system and phased rollout

## Problem

BibleQ's UI works but reads as dull/generic Tailwind defaults: emoji-as-icons,
default gradient combos, no distinctive type or shape language. This is a
conversion-side concern (distinct from the reach/SEO work done separately —
see `2026-07-21-marketing-prerender-design.md`): visitors who do land on the
site aren't given a visually confident, "someone cares about this" first
impression.

## Scope

A complete visual makeover across the whole app — landing, auth, quiz
creation/taking flow, and games — unified by one shared design system,
executed in four sequential phases so each phase ships and reviews
independently rather than landing as one unreviewable diff:

1. **Design system foundation** — Tailwind config tokens, `Button`/`Input`
   shared primitives (currently empty stub files at
   `src/components/UI/Button.jsx` and `Input.jsx`), `lucide-react`
   installed — plus `Header.jsx`, `Footer.jsx` (`src/components/Layout/`),
   and `Home.jsx` restyled to the new system.
2. **Login/Auth** — `Login.jsx`, `ProtectedRoute.jsx`.
3. **Quiz flow** — `QuestionCard`, `QuizCreator`, `QuizCreatorResults`,
   `QuizTaker`, `Results`, `QuizHistory`, `QuizResultsDashboard(C)`
   (`src/components/Quiz/`), plus `src/pages/CreateQuiz.jsx`,
   `TakeQuiz.jsx`, `Results.jsx`, `ImportResults.jsx`.
4. **Games section** — `GamesMain.js` + the six game components under
   `src/components/games/components/` (`BibleQuiz`, `ScrambledChapters`,
   `WhoAmIGame`, `BibleBookOrder`, `BibleTimeline`, `EmojiParables`), plus
   the games-specific `Footer.js`.

Each phase gets its own implementation plan under
`docs/superpowers/plans/`, executed and reviewed on its own, but all four
draw from this one design system so the visual language stays consistent —
no re-deciding colors/type per phase.

## Design system

Chosen through visual brainstorming (mockup comparisons in-browser): tone
is "warm & modern," direction is **Modern Sky** (blue/violet gradient, bold
geometric sans, soft glow shadows), centered hero layout, Poppins headline
font.

### Color tokens (replace in `tailwind.config.js`)

| Token | Old value | New value | Usage |
|---|---|---|---|
| `bible-blue` | `#1E3A8A` | `#2E6FDB` | Primary — CTAs, links, active nav, header/footer background |
| `bible-purple` | `#4C1D95` | `#7C5CFC` | Accent — gradients, secondary highlights |
| `bible-gold` | `#D4AF37` | `#D4AF37` (unchanged) | **Scoped to Games section only** — legacy brand continuity for game CTAs/badges, not used as a primary color elsewhere anymore |

New neutral tokens to add:

| Token | Value | Usage |
|---|---|---|
| `ink` | `#1B2333` | Headings |
| `slate` | `#5B6474` | Body text |
| `mist` | `#DCE3F0` | Borders |
| `sky-tint-1` | `#EAF4FB` | Gradient background start |
| `sky-tint-2` | `#F1EAFB` | Gradient background end |

### Typography

- Headings: **Poppins** (weights 600/700/800), loaded via Google Fonts
  `<link>` in `public/index.html`.
- Body: **Inter** (weights 400/700), loaded the same way.
- Both added as Tailwind `fontFamily` extensions: `font-heading` (Poppins),
  keep `font-sans` default stack but point body text at Inter.

### Shape and shadow

- Buttons/inputs: `border-radius: 10px` (Tailwind `rounded-lg` is close;
  define an explicit `rounded-btn` token at `10px` for exact match).
- Cards: `border-radius: 16px`–`20px` (`rounded-2xl`/`rounded-3xl`).
- Badges/pills: fully rounded (`rounded-full`).
- Primary button shadow: soft colored glow —
  `box-shadow: 0 6px 16px -6px rgba(46,111,219,0.4)`. Define as a Tailwind
  `boxShadow` extension `shadow-brand`.
- Cards: neutral soft shadow (existing Tailwind `shadow-lg` is acceptable,
  no new token needed).

### Icons

- Add `lucide-react` as a dependency.
- Replace **functional** emoji (nav icons, button icons, feature-card
  icons, form/status icons) with `lucide-react` icons app-wide, across all
  four phases.
- **Emoji stays** as decorative/playful accents specifically within the
  Games section (game tiles, badges like 🏆/⭐) — this is a deliberate
  exception, not an oversight, matching the "warm & modern but games can be
  more playful" tone decided during brainstorming.

### Shared primitives (Phase 1 deliverable)

- `src/components/UI/Button.jsx` — variants: `primary` (filled blue,
  `shadow-brand`), `secondary` (white/outline), `ghost` (text-only). Props:
  `variant`, standard button props passthrough, `as={Link}` support for
  router links styled as buttons (several existing call sites style a
  `<Link>` as a button manually — this consolidates that).
- `src/components/UI/Input.jsx` — text input with the new `rounded-btn`,
  `mist` border, focus ring in `bible-blue`. Used to replace repeated
  inline input styling (e.g. `Login.jsx`'s phone/OTP inputs).

### Layout decisions

- Hero sections (Home, and by extension Games/Contact where relevant):
  **centered** layout (chosen over split-with-illustration) — simpler,
  mobile-first, closer to today's existing structure so less restructuring
  risk.
- Header/Footer: **no structural change** — desktop horizontal nav +
  hamburger-triggered mobile nav (already implemented in `Header.jsx`)
  stays; only visual restyling (colors, type, icons replacing emoji nav
  triggers where applicable).

## Out of scope for this design doc

- The actual per-phase implementation plans (written separately, one per
  phase, starting with Phase 1).
- Content/SEO metadata work (tracked separately per the prerendering
  design doc's "out of scope" section — e.g. `/games` and `/contact`
  still sharing one `<title>`).
- Any changes to quiz/game *logic* — this is visual-only; component
  behavior, data flow, and Firebase interactions are unchanged.
