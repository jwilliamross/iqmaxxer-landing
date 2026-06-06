// quizService — manages quiz sessions and answer submission
// Wire up supabase once env vars are set and this is ready to go live.

// import { supabase } from '../lib/supabaseClient.js';

export async function startSession({ email }) {
  // TODO: create a quiz_session row in Supabase, return session id
  console.log('[quizService] startSession', email);
  return { sessionId: null };
}

export async function submitAnswer({ sessionId, questionId, answer }) {
  // TODO: upsert answer into quiz_answers table
  console.log('[quizService] submitAnswer', { sessionId, questionId, answer });
}
