# UI/UX Principles — IQMaxxer

## Design philosophy

The brand is credible, clinical, and direct. It does not use gamification, confetti, or motivational fluff. The aesthetic is dark-ink-on-white with a single electric-blue signal colour. Every element should feel like it belongs on a professional assessment platform.

---

## CSS custom properties (design tokens)

Defined on `:root` in `src/styles.css`:

| Token | Role |
|---|---|
| `--ink` | Primary text (`#0D0D12`) |
| `--signal` | Brand accent / CTA colour (`#2E6CF6`) |
| `--paper` | Page background (`#FFFFFF`) |
| `--paper-2` | Subtle surface (`#F7F8FA`) |
| `--slate` | Secondary text |
| `--muted` | Tertiary / placeholder text |
| `--line` | Borders, dividers |
| `--line-2` | Slightly stronger border |
| `--safe-top` | `env(safe-area-inset-top, 0px)` |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` |

---

## Responsive breakpoints

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile (default) | < 560px | Single column, stacked gender cards |
| Gender card switch | ≥ 560px | Gender cards go horizontal (3-up) |
| Tablet | ≥ 640px | Header padding, footer columns, stats grid |
| Desktop | ≥ 1024px | Hero 2-column grid, max-width gutter |

### Desktop max-width centering
Sections use `padding: max(40px, calc((100vw - 1160px) / 2))` rather than a wrapper div. This keeps the HTML flat while capping content width at 1160px.

---

## Typography

- Body/UI: system font stack via `font-family: inherit`
- Monospace labels (stats, progress, tags): `"JetBrains Mono", monospace`
- Headings: `font-weight: 800`, `letter-spacing: -0.03em`
- Display heading (`h1.disp`): 44px mobile → 54px desktop

---

## Key component patterns

### Buttons
- `.btn.btn-signal` — filled blue CTA (primary action)
- `.btn.btn-ghost` — outlined/muted secondary action
- Disabled state: `opacity: 0.45; cursor: not-allowed`
- Arrow span: `<span className="arrow">→</span>` after button label

### Quiz option buttons (`.opt`)
- Full-width, 1.5px border, 12px border-radius
- `.opt.sel` — blue border + blue background tint
- `.opt b` — monospace letter badge (A/B/C/D)

### Progress bar (`.m-progress`)
- Thin 4px bar, blue fill, animated width transition
- Companion label: `.step-lbl` in JetBrains Mono, uppercase, signal colour

### Score ring (`.reveal-ring`)
- 150×150px circle, conic-gradient fill
- Inner circle (`.inner`): 118×118px white, centered flex column
- Large bold number + small monospace label beneath it

### Gender cards (`.gender-card`)
- Female: `#E91E8C` (pink)
- Male: `#2563EB` (blue)
- Other: `#7C3AED` (purple)
- Each has icon badge (`.gc-icon`), label (`.gc-label`), radio dot (`.gc-check`)

### Page layout scaffolding
- `.quiz-start-page` — full-height centered flex, used for quiz, onboarding, and loading screens
- `.page-placeholder` — simpler centered flex for results and checkout
- `.lp` / `.lp-scroll` — root scroll container wrapping everything

---

## What NOT to do

- Do not add Tailwind, CSS modules, or styled-components.
- Do not create new global CSS variable names without documenting them here.
- Do not redesign the homepage sections (Hero, Stats, HowItWorks, etc.).
- Do not use emoji in UI unless explicitly requested.
- Do not add animations beyond what is already present (subtle fade-up, progress bar transition, spinner).
