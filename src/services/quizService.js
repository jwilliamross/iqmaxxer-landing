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
// Creates ONE row per quiz attempt. Call once when /quiz mounts.
export async function createSession({ email, age, gender }) {
  if (!supabase) {
    console.warn('[quizService] createSession: Supabase not configured.');
    return { sessionId: null, error: null };
  }
  // Created via a SECURITY DEFINER RPC so anon never needs read access to
  // test_sessions (keeps customer email/age/gender private). Returns the new id.
  const { data, error } = await supabase.rpc('create_test_session', {
    p_email:  email  ?? null,
    p_age:    age    ?? null,
    p_gender: gender ?? null,
  });

  if (error) console.error('[quizService] createSession:', error.message);
  return { sessionId: data ?? null, error };
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
// Marks session complete. Saves weighted_score and category_scores if the
// Stage 2B SQL columns exist. Falls back to base fields only if they don't.
export async function completeSession({
  sessionId,
  score,
  totalQuestions,
  weightedScore,
  categoryScores,
  iqEstimate,
  percentile,
}) {
  if (!supabase || !sessionId) return { error: null };

  const base = {
    status:          'completed',
    score,
    total_questions: totalQuestions,
    completed_at:    new Date().toISOString(),
  };

  // Build the extra fields if the optional columns exist
  const extras = {};
  if (weightedScore != null) extras.weighted_score = weightedScore;
  if (categoryScores && Object.keys(categoryScores).length > 0) {
    extras.category_scores = categoryScores;
  }
  if (iqEstimate != null) extras.iq_estimate = iqEstimate;
  if (percentile != null) extras.percentile = percentile;

  if (Object.keys(extras).length > 0) {
    const { error: errWith } = await supabase
      .from('test_sessions')
      .update({ ...base, ...extras })
      .eq('id', sessionId);

    if (!errWith) return { error: null };

    // 42703 = undefined_column in PostgreSQL — Stage 2B SQL not yet run
    const isMissingColumn =
      errWith.code === '42703' ||
      (errWith.message ?? '').toLowerCase().includes('column');

    if (!isMissingColumn) {
      console.error('[quizService] completeSession:', errWith.message);
      return { error: errWith };
    }

    console.warn(
      '[quizService] weighted_score / category_scores columns not found.\n' +
      'Run Stage 2B SQL in Supabase:\n' +
      '  ALTER TABLE public.test_sessions ADD COLUMN IF NOT EXISTS category_scores jsonb;\n' +
      '  ALTER TABLE public.test_sessions ADD COLUMN IF NOT EXISTS weighted_score numeric(6,2);'
    );
  }

  // Fallback: save base fields only (identical to original behavior)
  const { error } = await supabase
    .from('test_sessions')
    .update(base)
    .eq('id', sessionId);

  if (error) console.error('[quizService] completeSession:', error.message);
  return { error };
}
