import { supabase } from '../lib/supabaseClient.js';

// ─── questions ────────────────────────────────────────────────
// Expected schema for public.questions:
//   id             integer PRIMARY KEY
//   question       text   (also handles: prompt, text, body, title)
//   options        jsonb  -- ["Paris","London",...] or [{"text":"..."},...]
//                  OR flat columns: option_a text, option_b text, option_c text, option_d text
//   correct_answer text   -- option key e.g. "A","B","C","D"  (or integer index 0-3)
//   sub_scale      text   -- optional: "verbal" | "spatial" | "pattern" | "memory"

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

// ─── test_sessions ────────────────────────────────────────────
// Creates ONE row per quiz attempt. Call once when /quiz mounts.
// Saves email, age, and gender in the same row.
//
// test_sessions table must already have these columns:
//   email   text
//   age     integer (or smallint / numeric)
//   gender  text
// All other columns (status, score, total_questions, completed_at) are
// updated later by completeSession().

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

// ─── answers ─────────────────────────────────────────────────
// Inserts one row per answer submitted.
// answers columns: session_id, question_id, selected_answer, is_correct

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

// ─── complete session ─────────────────────────────────────────
// Called once when the user submits the last question.
// Updates test_sessions: status, score, total_questions, completed_at.

export async function completeSession({ sessionId, score, totalQuestions }) {
  if (!supabase || !sessionId) return { error: null };
  const { error } = await supabase
    .from('test_sessions')
    .update({
      status:          'completed',
      score,
      total_questions: totalQuestions,
      completed_at:    new Date().toISOString(),
    })
    .eq('id', sessionId);
  if (error) console.error('[quizService] completeSession:', error.message);
  return { error };
}
