// resultsService — fetches and scores quiz results
// Wire up supabase once env vars are set and this is ready to go live.

// import { supabase } from '../lib/supabaseClient.js';

export async function getResults({ sessionId }) {
  // TODO: query scored results from Supabase, return percentile + sub-scale breakdown
  console.log('[resultsService] getResults', sessionId);
  return { percentile: null, subScales: {} };
}
