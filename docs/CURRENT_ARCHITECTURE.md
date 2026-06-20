# Current Architecture — IQMaxxer

## Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 (with StrictMode) |
| Build tool | Vite 5 |
| Routing | react-router-dom v6 |
| Backend / database | Supabase (PostgreSQL + auth + storage) |
| Supabase client | @supabase/supabase-js v2 |
| Deployment | Vercel (SPA with history fallback) |
| Styling | Single global CSS file (`src/styles.css`) with CSS custom properties |

## Directory layout

```
src/
  App.jsx                   # Route definitions
  main.jsx                  # React root, BrowserRouter wrapper
  styles.css                # All styles — single file, no CSS modules

  components/
    layout/
      Layout.jsx            # Shell: Header + <Outlet /> + Footer
      Header.jsx            # Logo, nav buttons, auth modal trigger
      Footer.jsx
    sections/               # Homepage section components (Hero, Stats, etc.)
    AuthModal.jsx           # Email/password form (not wired to real auth yet)
    Brand.jsx               # Mark + Wordmark SVG components
    icons.jsx               # Shared icon exports (ic.*)
    widgets.jsx             # PressMarquee and other small widgets

  lib/
    supabaseClient.js       # createClient() — returns null if env vars absent

  pages/
    HomePage.jsx            # Landing page (all sections + sticky CTA)
    QuizStartPage.jsx       # Onboarding: gender card + age (step 0), email (step 1)
    QuizPage.jsx            # Live quiz — loads questions, saves answers, completes session
    ResultsPage.jsx         # Score display + unlock CTA
    CheckoutPage.jsx        # Payment placeholder (Stripe not connected yet)

  services/
    quizService.js          # getQuestions, createSession, saveAnswer, completeSession
    authService.js          # Stubs only — login/signup/logout/getCurrentUser (no-ops)
    resultsService.js       # Stub — getResults() returns null
    paymentService.js       # Stub — createCheckoutSession / getSubscriptionStatus

docs/                       # This folder — product and engineering documentation

.env.example                # Template: VITE_SUPABASE_URL= and VITE_SUPABASE_ANON_KEY=
vite.config.js              # historyApiFallback: true for SPA routing on Vercel
```

## Key architectural patterns

### Supabase null-guard
`supabaseClient.js` returns `null` when env vars are absent. Every function in `quizService.js` checks `if (!supabase)` before making any call, so the app runs in dev without a `.env` file.

### Navigation state passing
Profile data (gender, age, email) collected in `QuizStartPage` is passed as React Router navigation state via `navigate('/quiz', { state: {...} })`. `QuizPage` reads it with `useLocation().state`. This means refreshing `/quiz` loses the profile — intentional for MVP.

### StrictMode session guard
`QuizPage` uses a `useRef` flag (`sessionInitiated`) to prevent React 18 StrictMode's double-mount from creating two `test_sessions` rows. The ref persists across StrictMode's simulated unmount/remount cycle.

### Service layer
All Supabase calls go through `src/services/quizService.js`. Pages never import `supabase` directly. This keeps the data layer swappable and testable in isolation.

### CSS custom properties
All colours and spacing tokens are defined as CSS variables on `:root`. No CSS-in-JS, no Tailwind. See `UI_UX_PRINCIPLES.md` for the full token list.
