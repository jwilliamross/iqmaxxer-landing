# Scoring Model — IQMaxxer

## Current implementation (MVP)

Scoring is calculated **client-side** in `QuizPage.jsx` at the moment the user submits the last question.

### How it works

1. The user's answer selections are stored in `picked`: `{ [questionId]: optionKey }` where `optionKey` is `"A"`, `"B"`, `"C"`, or `"D"`.

2. On the last question, `finalPicked` is constructed by merging `picked` with the current answer (since React state may not have flushed yet).

3. `score` is calculated:
```js
const score = questions.reduce((acc, question) => {
  const key = finalPicked[question.id];
  if (key == null) return acc;
  return acc + (checkCorrect(question, key) === true ? 1 : 0);
}, 0);
```

4. `checkCorrect(q, selectedKey)` compares against `q.correct_answer`:
   - If `correct_answer` is a string: case-insensitive key comparison (`"A"` vs `"a"` both work)
   - If `correct_answer` is an integer: index comparison (`0` = A, `1` = B, `2` = C, `3` = D)
   - If `correct_answer` is null/undefined: returns `null` (answer not graded)

5. `completeSession()` writes `score` and `total_questions` to `test_sessions`.

6. `saveAnswer()` writes `is_correct` per answer row to the `answers` table.

### What the results page shows (current)

- **Score ring**: conic gradient filled to `Math.round((score / total) * 100)%`
- **Label**: `score of total correct · Tier`
- **Tier**: Exceptional (≥90%), Strong result (≥75%), Above average (≥60%), Solid effort (<60%)

---

## What the full report will contain (planned, not built)

The paid report requires a mapping from raw quiz score → estimated IQ range. This mapping is not implemented yet. It should be based on a normalisation curve calibrated against the test-taker pool.

Planned components:

| Component | Description |
|---|---|
| Estimated IQ range | e.g. "118–126" on standard deviation scale (mean 100, SD 15) |
| Percentile | Rank vs. all completed sessions in `test_sessions` |
| Category breakdown | Per-category correct/total/pct (requires `category_scores` column in `test_sessions`) |
| Strengths | Top 1–2 categories by percentage |
| Weaknesses | Bottom 1–2 categories by percentage |
| Personalized explanation | Static copy mapped to IQ tier + profile (age/gender optionally factored) |

---

## Scoring rules for Claude agents

- Never change `checkCorrect()` without verifying the `correct_answer` format in Supabase first.
- The score written to `test_sessions.score` is the **raw count of correct answers**, not a percentage.
- Do not implement IQ normalization without the full calibration dataset.
- Category scores should be stored as jsonb (see `DATABASE_SCHEMA.md`).
