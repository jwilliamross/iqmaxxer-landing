# Database Schema — IQMaxxer

All tables live in the `public` schema on Supabase (PostgreSQL).

---

## `public.questions`

Stores the IQ test question bank.

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key, used for ordering |
| `prompt` | text | The question text shown to the user |
| `option_a` | text | Answer choice A |
| `option_b` | text | Answer choice B |
| `option_c` | text | Answer choice C |
| `option_d` | text | Answer choice D |
| `correct_answer` | text | The correct option key, e.g. `"A"`, `"B"`, `"C"`, `"D"` |
| `category` | text | Cognitive category, e.g. `"Verbal"`, `"Spatial"`, `"Numerical"` |
| `difficulty` | text or integer | Difficulty level — not yet used in scoring |

**Notes:**
- `quizService.getQuestions()` selects `*` ordered by `id` ascending
- The app also handles a jsonb `options` array column if present (fallback in `parseOptions()`)
- The `correct_answer` comparison is case-insensitive and also handles integer indices (0–3)

---

## `public.test_sessions`

One row per quiz attempt. Created when the user reaches `/quiz`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (auto-generated) |
| `created_at` | timestamptz | Auto-set by Supabase |
| `email` | text | Collected in onboarding step 1 |
| `age` | integer | Collected in onboarding step 0 |
| `gender` | text | `"female"`, `"male"`, or `"other"` |
| `status` | text | `"in_progress"` on create → `"completed"` on finish |
| `score` | integer | Number of correct answers (set on completion) |
| `total_questions` | integer | Total questions in the session (set on completion) |
| `completed_at` | timestamptz | Set when `completeSession()` is called |

**Planned future column (not yet added):**
```sql
ALTER TABLE public.test_sessions
ADD COLUMN IF NOT EXISTS category_scores jsonb;
```
This would store `{ "Verbal": { correct: 4, total: 6, pct: 67 }, ... }`.

---

## `public.answers`

One row per answer submitted by a user during a quiz.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (auto-generated) |
| `created_at` | timestamptz | Auto-set by Supabase |
| `session_id` | uuid | Foreign key → `test_sessions.id` |
| `question_id` | integer | Foreign key → `questions.id` |
| `selected_answer` | text | The option key the user chose: `"A"`, `"B"`, `"C"`, or `"D"` |
| `is_correct` | boolean | `true` / `false` / `null` (null if `correct_answer` is absent) |

---

## Rules

- **Do not create new tables** without explicit approval.
- **Do not alter existing columns** (type or name changes break the app).
- **Do not add RLS policies** without reviewing the existing policies first.
- The Supabase anon key must be able to `INSERT` into all three tables for the current flow to work.
