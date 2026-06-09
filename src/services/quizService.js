import { supabase } from '../lib/supabaseClient.js';

// Expected schema for public.questions:
//   id          integer PRIMARY KEY
//   question    text    (also tried: prompt, text, body)
//   options     jsonb   -- array of strings e.g. ["Paris", "London", ...]
//               OR flat columns: option_a text, option_b text, option_c text, option_d text
//   sub_scale   text    -- optional, e.g. "verbal", "spatial", "pattern", "memory"
//
// Required column addition for test_sessions:
//   ALTER TABLE public.test_sessions ADD COLUMN IF NOT EXISTS email text;

export async function getQuestions() {
  if (!supabase) {
    return {
      data: null,
      error: {
        message:
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
      },
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true });

  return { data, error };
}

// Creates a row in public.test_sessions with the user's email.
// Run this in Supabase SQL editor first:
//   ALTER TABLE public.test_sessions ADD COLUMN IF NOT EXISTS email text;
export async function createSession({ email }) {
  if (!supabase) {
    console.warn('[quizService] createSession: Supabase not configured, skipping.');
    return { sessionId: null, error: null };
  }

  const { data, error } = await supabase
    .from('test_sessions')
    .insert({ email: email ?? null })
    .select('id')
    .single();

  if (error) {
    console.error('[quizService] createSession error:', error.message);
  }

  return { sessionId: data?.id ?? null, error };
}

export async function submitAnswer({ sessionId, questionId, answer }) {
  console.log('[quizService] submitAnswer', { sessionId, questionId, answer });
}
