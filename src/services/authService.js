// authService — wire up Supabase (or another auth provider) here when ready.
// Import supabase from '../lib/supabaseClient.js' and replace the stubs below.
//
// Example login implementation:
//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//   return { user: data?.user ?? null, error };

export async function login({ email, password }) {
  console.log('[authService] login', email);
  return { user: null, error: null };
}

export async function signup({ email, password }) {
  console.log('[authService] signup', email);
  return { user: null, error: null };
}

export async function logout() {
  console.log('[authService] logout');
}

export async function getCurrentUser() {
  // Replace with: const { data } = await supabase.auth.getUser(); return data?.user ?? null;
  return null;
}
