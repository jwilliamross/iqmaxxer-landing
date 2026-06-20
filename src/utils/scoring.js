/**
 * Pure scoring utilities for IQMaxxer.
 * No React, no Supabase, no side effects.
 *
 * Do not add estimated IQ or percentile calculations here until
 * validated norming data is available.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalises a difficulty value to an integer in the range 1–5.
 * Missing, null, non-numeric, or out-of-range values default to 1.
 *
 * @param {*} difficulty
 * @returns {number} Integer from 1 to 5 inclusive.
 */
function normaliseDifficulty(difficulty) {
  const d = typeof difficulty === 'string' ? parseInt(difficulty, 10) : Number(difficulty);
  return Number.isInteger(d) && d >= 1 && d <= 5 ? d : 1;
}

/**
 * Checks whether a selected answer matches the question's correct_answer.
 *
 * Supports two correct_answer formats:
 *   - Letter string: 'A', 'B', 'C', or 'D' (case-insensitive)
 *   - Zero-based integer index: 0 = A, 1 = B, 2 = C, 3 = D
 *
 * Returns null when correct_answer is absent (question is ungraded).
 *
 * @param {object} question
 * @param {string} selectedKey - The answer key chosen by the user, e.g. 'A'.
 * @returns {boolean|null}
 */
function isAnswerCorrect(question, selectedKey) {
  const correct = question.correct_answer;
  if (correct == null) return null;

  if (typeof correct === 'string') {
    return correct.trim().toUpperCase() === selectedKey.trim().toUpperCase();
  }

  if (typeof correct === 'number') {
    return correct === (selectedKey.toUpperCase().charCodeAt(0) - 65);
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Calculates the complete scoring result for a quiz attempt.
 *
 * Difficulty weighting: a correct answer on a difficulty-N question earns N points.
 * Incorrect or unanswered questions earn 0 points.
 *
 * @param {object[]} questions
 *   Array of question objects. Each may contain:
 *   { id, correct_answer, category, difficulty }
 *
 * @param {object} selectedAnswers
 *   Answers keyed by question id: { [questionId]: answerKey }
 *   Answer keys are letters — 'A', 'B', 'C', or 'D'.
 *
 * @returns {{
 *   rawScore: number,
 *   totalQuestions: number,
 *   weightedScore: number,
 *   maxWeightedScore: number,
 *   percentageScore: number,
 *   categoryScores: Object.<string, {
 *     correct: number,
 *     total: number,
 *     weightedScore: number,
 *     maxWeightedScore: number,
 *     percentage: number
 *   }>
 * }}
 */
export function calculateQuizScore(questions, selectedAnswers) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      rawScore:        0,
      totalQuestions:  0,
      weightedScore:   0,
      maxWeightedScore: 0,
      percentageScore: 0,
      categoryScores:  {},
    };
  }

  let rawScore         = 0;
  let weightedScore    = 0;
  let maxWeightedScore = 0;
  const categoryScores = {};

  for (const question of questions) {
    const difficulty = normaliseDifficulty(question.difficulty);
    const category   = question.category ?? 'General';
    const selected   = selectedAnswers[question.id];
    const correct    = selected != null ? isAnswerCorrect(question, selected) : null;
    const earned     = correct === true ? difficulty : 0;

    maxWeightedScore += difficulty;
    if (correct === true) rawScore++;
    weightedScore += earned;

    if (!categoryScores[category]) {
      categoryScores[category] = {
        correct:          0,
        total:            0,
        weightedScore:    0,
        maxWeightedScore: 0,
        percentage:       0,
      };
    }

    const cat = categoryScores[category];
    cat.total++;
    cat.maxWeightedScore += difficulty;
    if (correct === true) {
      cat.correct++;
      cat.weightedScore += earned;
    }
  }

  // Compute percentages after the loop so we divide once per category, not per question.
  const percentageScore = maxWeightedScore > 0
    ? parseFloat(((weightedScore / maxWeightedScore) * 100).toFixed(2))
    : 0;

  for (const cat of Object.values(categoryScores)) {
    cat.percentage = cat.maxWeightedScore > 0
      ? parseFloat(((cat.weightedScore / cat.maxWeightedScore) * 100).toFixed(2))
      : 0;
  }

  return {
    rawScore,
    totalQuestions:  questions.length,
    weightedScore,
    maxWeightedScore,
    percentageScore,
    categoryScores,
  };
}
