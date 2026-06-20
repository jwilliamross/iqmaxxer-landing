# Routes and User Flows — IQMaxxer

## Route map

| Path | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Landing page — all marketing sections |
| `/quiz/start` | `QuizStartPage` | Onboarding: gender + age → email |
| `/quiz` | `QuizPage` | The live IQ test |
| `/results` | `ResultsPage` | Score display + unlock CTA |
| `/checkout` | `CheckoutPage` | Payment (placeholder — Stripe not connected) |

All routes are wrapped in `Layout` (Header + Footer). The router is `BrowserRouter` with `historyApiFallback: true` in `vite.config.js` so direct URL access and Vercel deployment work correctly.

---

## Primary user flow

```
/  (HomePage)
  ↓ "Start Test" / "Begin my IQ test" CTA
/quiz/start  (QuizStartPage)
  Step 0: Select gender (female / male / prefer not to say) + enter age
  Step 1: Enter email
  ↓ navigate('/quiz', { state: { gender, age, email } })
/quiz  (QuizPage)
  • Session created in Supabase on mount (one row, StrictMode-safe)
  • Questions loaded from Supabase
  • Each answer saved to answers table as user advances
  • Final question: score calculated, completeSession() called
  ↓ navigate('/results', { state: { gender, age, email, sessionId, score, totalQuestions } })
/results  (ResultsPage)
  • Shows score ring (% correct) and tier label
  • "Unlock full IQ report" CTA
  ↓ navigate('/checkout')
/checkout  (CheckoutPage)
  • Payment placeholder — Stripe not connected yet
```

---

## Navigation state

Data flows forward via React Router's `state` option — **not** URL params, not localStorage.

| From | To | State passed |
|---|---|---|
| `QuizStartPage` | `QuizPage` | `{ gender, age, email }` |
| `QuizPage` | `ResultsPage` | `{ gender, age, email, sessionId, score, totalQuestions }` |

**Important:** If a user navigates directly to `/quiz` or `/results` without the preceding flow, `location.state` is `null`. Pages degrade gracefully — the quiz still works (session is created with null fields), and results still show the ring (with `—` if no score data).

---

## Header navigation

The header always shows:
- Logo → navigates to `/`
- Log In → opens `AuthModal` in login mode (stub, not connected)
- Sign Up → opens `AuthModal` in signup mode (stub, not connected)
- Start Test → navigates to `/quiz/start`

Log In and Sign Up are hidden on mobile, visible at ≥ 640px.

---

## Sticky CTA (homepage only)

A sticky bottom bar appears on `HomePage` after scrolling past 520px. Button: **"Begin my IQ test →"** navigates to `/quiz/start`.
