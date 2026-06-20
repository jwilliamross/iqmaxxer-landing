# Deployment Workflow — IQMaxxer

## Hosting

The app is deployed on **Vercel** as a static SPA.

Since the app uses `BrowserRouter` (client-side routing), Vercel must serve `index.html` for all non-asset paths. This is handled by `historyApiFallback: true` in `vite.config.js` for local dev, and by Vercel's default SPA fallback behaviour in production.

---

## Build

```bash
npm run build
```

Output goes to `dist/`. Vite 5 bundles everything into two files:
- `dist/assets/index-[hash].css`
- `dist/assets/index-[hash].js`

The build must pass without errors or warnings before any deploy. Always run it after making source changes.

---

## Environment variables

Two variables are required for Supabase to work:

| Variable | Where it lives |
|---|---|
| `VITE_SUPABASE_URL` | Vercel project settings → Environment Variables |
| `VITE_SUPABASE_ANON_KEY` | Vercel project settings → Environment Variables |

**Local development:**
1. Copy `.env.example` to `.env` (gitignored)
2. Fill in the values from your Supabase project dashboard

The app will run without these variables (Supabase client returns `null`), but all data operations will be skipped.

### Rules
- Never hardcode Supabase keys in source files.
- Never commit `.env` to git.
- Never import `.env` directly in code — Vite exposes `VITE_*` variables via `import.meta.env` automatically.
- `.env.example` must only contain:
  ```
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  ```

---

## Vercel deployment steps

1. Push to the connected Git branch (or drag `dist/` if deploying manually)
2. Vercel auto-detects Vite and runs `npm run build`
3. Vercel serves `dist/` with SPA fallback
4. Confirm environment variables are set in Vercel dashboard for the target environment (preview / production)

---

## Pre-deploy checklist

- [ ] `npm run build` passes with no errors
- [ ] All new `VITE_*` env vars added to Vercel dashboard
- [ ] No hardcoded credentials in source
- [ ] All routes tested locally: `/`, `/quiz/start`, `/quiz`, `/results`, `/checkout`
- [ ] Supabase RLS policies allow the operations the app needs (INSERT on questions, test_sessions, answers via anon key)

---

## What is NOT deployed yet

- Real Stripe payment processing
- Real auth (login/signup currently stub functions only)
- Server-side functions / Edge Functions
