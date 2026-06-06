// paymentService — handles checkout and subscription management
// Integrate Stripe (or similar) here when ready.

export async function createCheckoutSession({ email, priceId }) {
  // TODO: call your backend to create a Stripe checkout session, return URL
  console.log('[paymentService] createCheckoutSession', { email, priceId });
  return { url: null };
}

export async function getSubscriptionStatus({ email }) {
  // TODO: check active subscription via Supabase or Stripe customer portal
  console.log('[paymentService] getSubscriptionStatus', email);
  return { active: false };
}
