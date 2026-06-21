// Pure IQ scoring — no Supabase, no React, no side effects.
// Converts difficulty-weighted test performance into an ESTIMATED IQ + percentile.
//
// NORMING HONESTY: a statistically valid norm needs a large calibration sample of
// real test-takers, which doesn't exist yet. These are PROVISIONAL, model-based
// parameters meant to be RECALIBRATED from live `test_sessions` data as ad traffic
// accumulates (see db/recalibrate_norms.sql). Always present the number as an
// "estimate". The same params are mirrored in the Supabase `scoring_norms` table.

export const DEFAULT_NORM = {
  // Mean & SD of the difficulty-weighted proportion (weightedScore / maxWeightedScore)
  // assumed for the population. p === meanP maps to IQ 100.
  meanP: 0.5,
  sdP: 0.2,
  iqMean: 100,
  iqSd: 15,
  iqMin: 55,
  iqMax: 145,
};

// Standard normal CDF via the Abramowitz & Stegun 7.1.26 erf approximation.
// Returns P(Z <= z). Good to ~1e-7 — plenty for a percentile.
export function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

// Compute estimated IQ + percentile from a completed test.
// Prefers the difficulty-weighted proportion; falls back to raw proportion.
// Returns null if there isn't enough data to score.
export function computeIq(
  { weightedScore, maxWeightedScore, rawScore, totalQuestions },
  norm = DEFAULT_NORM,
) {
  let p = null;
  if (weightedScore != null && maxWeightedScore) {
    p = weightedScore / maxWeightedScore;
  } else if (rawScore != null && totalQuestions) {
    p = rawScore / totalQuestions;
  }
  if (p == null) return null;
  p = Math.max(0, Math.min(1, p));

  const z = (p - norm.meanP) / norm.sdP;
  let iq = Math.round(norm.iqMean + norm.iqSd * z);
  iq = Math.max(norm.iqMin, Math.min(norm.iqMax, iq));

  // Percentile derived from the (clamped) IQ so "IQ X = top Y%" stays internally
  // consistent with the number we actually show.
  const zForPct = (iq - norm.iqMean) / norm.iqSd;
  const percentile = Math.max(1, Math.min(99, Math.round(normalCdf(zForPct) * 100)));

  return { iq, percentile, zScore: z };
}

// Strongest / weakest category from a categoryScores map
// ({ [name]: { correct, total, pct } }). Returns { strongest, weakest } names
// or nulls when there isn't enough signal.
export function categoryHighlights(categoryScores) {
  const entries = Object.entries(categoryScores || {});
  if (entries.length === 0) return { strongest: null, weakest: null };
  const sorted = [...entries].sort((a, b) => b[1].pct - a[1].pct);
  const strongest = sorted[0][0];
  const weakest = sorted[sorted.length - 1][0];
  return { strongest, weakest: weakest === strongest ? null : weakest };
}
