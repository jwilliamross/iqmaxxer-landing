# Integrations Roadmap — IQMaxxer

This document tracks planned third-party integrations. Nothing here is live yet unless marked otherwise.

---

## Live now

| Integration | Status | Notes |
|---|---|---|
| Supabase (database) | ✅ Live | `questions`, `test_sessions`, `answers` tables active |
| Vercel (hosting) | ✅ Live | SPA with history fallback |

---

## Planned — not connected

### Stripe (payment)
- **Purpose:** Process the $14.99 CAD one-time payment for the full IQ report
- **Entry point:** `CheckoutPage.jsx` — currently a placeholder
- **Service stub:** `src/services/paymentService.js`
- **Price:** $14.99 CAD, one-time, no subscription
- **What to build:**
  - Stripe Checkout Session created server-side (Edge Function or API route)
  - Redirect user to Stripe-hosted checkout
  - Webhook to mark `test_sessions` row as paid on success
  - `ResultsPage` checks paid status and unlocks full report content
- **Do not connect** until the full report content is built

### Authentication (Supabase Auth or similar)
- **Purpose:** Let users log back in to view past results, link purchases to accounts
- **Entry point:** `AuthModal.jsx` + `authService.js` (stubs)
- **What to build:**
  - Wire `authService.login()` and `authService.signup()` to Supabase Auth
  - Store session token, gate `/results` behind auth if needed
  - Link `test_sessions` rows to `auth.users.id`
- **Do not connect** until the Stripe flow is finalized (paid sessions need to belong to a user)

### Email (transactional)
- **Purpose:** Send result summaries and report delivery after payment
- **Candidates:** Resend, SendGrid, Supabase Edge Functions + SMTP
- **Trigger:** Post-payment webhook
- **Do not connect** until Stripe is live

---

## Possible future additions (not planned yet)

| Feature | Notes |
|---|---|
| Leaderboard / social sharing | Percentile comparison, shareable result card |
| Retake gating | Limit free retakes per email address |
| Corporate / team assessments | Bulk purchase, dashboard for results |
| Adaptive question difficulty | Adjust question set based on running score |
| Downloadable PDF certificate | Branded result certificate after payment |

---

## Integration principles

- New integrations get their own service file in `src/services/`
- Keys go in `.env` as `VITE_*` variables (or server-side only if sensitive)
- Stub the service first, wire it up second — never build UI that depends on an unbuilt backend
- Stripe keys must never be exposed on the client side — use Supabase Edge Functions or a separate API
