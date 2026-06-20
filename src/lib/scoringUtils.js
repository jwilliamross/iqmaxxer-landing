// Pure scoring utilities — no Supabase, no React, no side effects.
// Imported by QuizPage and (eventually) resultsService.

// Returns true / false / null.
// Handles string key ('A') or integer index (0–3).
export function checkCorrect(question, selectedKey) {
  const correct = question.correct_answer;
  if (correct == null) return null;
  if (typeof correct === 'string') return correct.trim().toUpperCase() === selectedKey.toUpperCase();
  if (typeof correct === 'number') return correct === (selectedKey.charCodeAt(0) - 65);
  return null;
}

// Maps a difficulty value to a weight multiplier.
// Accepts integer (1–5) or numeric string ("1"–"5").
// Non-numeric or missing difficulty defaults to weight 1.0 (same as easiest questions).
export function getWeightForDifficulty(difficulty) {
  const d = typeof difficulty === 'string' ? parseInt(difficulty, 10) : Number(difficulty);
  if (!d || isNaN(d)) return 1;
  const map = { 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 3 };
  return map[d] ?? 1;
}

// Calculates the full scoring result from the question array and a finalPicked map.
//
// finalPicked: { [questionId]: optionKey }
//
// Returns:
//   rawScore         — unweighted correct count (preserves existing behavior)
//   weightedScore    — sum of difficulty weights for correct answers
//   maxWeightedScore — sum of difficulty weights for ALL questions (the denominator)
//   categoryScores   — { [categoryName]: { correct, total, pct } }
export function calculateScore(questions, finalPicked) {
  let rawScore = 0;
  let weightedScore = 0;
  let maxWeightedScore = 0;
  const categoryScores = {};

  questions.forEach((q) => {
    const cat    = q.category ?? 'General';
    const weight = getWeightForDifficulty(q.difficulty);
    const key    = finalPicked[q.id];
    const correct = key != null ? checkCorrect(q, key) : null;

    maxWeightedScore += weight;

    if (!categoryScores[cat]) categoryScores[cat] = { correct: 0, total: 0, pct: 0 };
    categoryScores[cat].total++;

    if (correct === true) {
      rawScore++;
      weightedScore += weight;
      categoryScores[cat].correct++;
    }
  });

  Object.values(categoryScores).forEach((c) => {
    c.pct = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
  });

  return { rawScore, weightedScore, maxWeightedScore, categoryScores };
}
