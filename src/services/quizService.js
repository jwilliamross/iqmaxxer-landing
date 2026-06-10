import { supabase } from '../lib/supabaseClient.js';

// ─── questions ────────────────────────────────────────────────────────────────
export async function getQuestions() {
  if (!supabase) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' },
    };
  }
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true });
  return { data, error };
}

// ─── test_sessions ────────────────────────────────────────────────────────────
// Creates ONE row per quiz attempt. All three profile fields saved together.
export async function createSession({ email, age, gender }) {
  if (!supabase) {
    console.warn('[quizService] createSession: Supabase not configured.');
    return { sessionId: null, error: null };
  }
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      email:  email  ?? null,
      age:    age    ?? null,
      gender: gender ?? null,
    })
    .select('id')
    .single();

  if (error) console.error('[quizService] createSession:', error.message);
  return { sessionId: data?.id ?? null, error };
}

// ─── answers ──────────────────────────────────────────────────────────────────
export async function saveAnswer({ sessionId, questionId, selectedAnswer, isCorrect }) {
  if (!supabase || !sessionId) return { error: null };
  const { error } = await supabase
    .from('answers')
    .insert({
      session_id:      sessionId,
      question_id:     questionId,
      selected_answer: selectedAnswer,
      is_correct:      isCorrect ?? null,
    });
  if (error) console.error('[quizService] saveAnswer:', error.message);
  return { error };
}

// ─── complete session ─────────────────────────────────────────────────────────
// Marks the session done. Tries to save category_scores (jsonb) if the column exists.
// If not, falls back gracefully and logs the SQL needed to add it.
export async function completeSession({ sessionId, score, totalQuestions, categoryScores }) {
  if (!supabase || !sessionId) return { error: null };

  const base = {
    status:          'completed',
    score,
    total_questions: totalQuestions,
    completed_at:    new Date().toISOString(),
  };

  // Try with category_scores first
  if (categoryScores && Object.keys(categoryScores).length > 0) {
    const { error: errWith } = await supabase
      .from('test_sessions')
      .update({ ...base, category_scores: categoryScores })
      .eq('id', sessionId);

    if (!errWith) return { error: null };

    // 42703 = undefined_column in PostgreSQL
    const isMissingColumn =
      errWith.code === '42703' ||
      (errWith.message ?? '').toLowerCase().includes('category_scores');

    if (!isMissingColumn) {
      console.error('[quizService] completeSession:', errWith.message);
      return { error: errWith };
    }

    console.warn(
      '[quizService] category_scores column not found — run this SQL in Supabase:\n' +
      'ALTER TABLE public.test_sessions ADD COLUMN IF NOT EXISTS category_scores jsonb;'
    );
  }

  // Fallback: save without category_scores
  const { error } = await supabase
    .from('test_sessions')
    .update(base)
    .eq('id', sessionId);

  if (error) console.error('[quizService] completeSession:', error.message);
  return { error };
}
