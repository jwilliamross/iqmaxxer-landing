# Claude Agent Rules — IQMaxxer

These rules apply to any Claude agent or session working on this codebase. Read this file before making any changes.

---

## Hard rules — never violate these

1. **Do not connect Stripe.** Payment processing is not wired up. `CheckoutPage` is a placeholder. Do not add Stripe keys, SDK, or payment logic without explicit instruction.

2. **Do not connect real authentication.** `authService.js` contains stubs only. `AuthModal` shows a real form but calls no-op functions. Do not wire up Supabase Auth or any other auth provider without explicit instruction.

3. **Do not create new Supabase tables.** The schema is fixed: `public.questions`, `public.test_sessions`, `public.answers`. Adding columns to existing tables requires approval and exact SQL provided to the user.

4. **Do not change `package.json` unless explicitly asked.** No new dependencies without approval.

5. **Do not redesign the homepage.** The landing page sections (Hero, Stats, HowItWorks, AvailableTests, BoostAbilities, WhatYouGet, ReviewsSection, FAQSection, Community) are finalized. Copy, layout, and visual tone must not be changed.

6. **Do not soften marketing copy.** The brand uses strong, specific claims ("real IQ", "verified score", "2.4M tested"). Do not replace these with hedged language.

7. **Do not hardcode API keys or secrets.** All credentials go in `.env` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only.

8. **Never skip `npm run build`.** Always confirm the build passes before reporting a task as complete.

---

## Pricing

The planned price is **$14.99 CAD** — one-time payment for the full report. Do not change this value in any document, UI copy, or code without explicit instruction.

---

## Before making any change

1. Read the relevant files in full — do not edit from memory or from the session summary alone.
2. Check `docs/` for context on the area you are touching.
3. Confirm the change is within the scope of the stated task. If unclear, ask first.
4. After editing, run `npm run build` to confirm nothing broke.

---

## Scope discipline

If a task says "Stage 1 docs only", that means docs only. If a task says "connect quiz to Supabase for questions", that means questions only — not sessions, not answers. Match the scope of your actions exactly to what was requested. Do not gold-plate, expand, or improve adjacent areas without permission.

---

## Service layer rules

- All Supabase calls must go through `src/services/quizService.js` (or the appropriate service file). Pages must never import `supabase` directly.
- Every service function must guard: `if (!supabase) return { ... }` before making any call.
- `authService.js`, `resultsService.js`, and `paymentService.js` are stubs. Do not wire them up without instruction.

---

## What is safe to change without asking

- Documentation in `docs/`
- Content and wording in service stub functions (console.log messages, etc.)
- Error messages and UI copy in quiz flow pages
- CSS for new pages or new components (not existing homepage sections)
- Loading and error screen layouts in `QuizPage`

---

## What always requires explicit approval

- Any change to `src/services/quizService.js` Supabase query logic
- Any change to `src/pages/HomePage.jsx` or any section in `src/components/sections/`
- Any change to `package.json`
- Any new Supabase table or column
- Any integration with a third-party API (Stripe, SendGrid, etc.)
- Any change to routing structure in `App.jsx`
