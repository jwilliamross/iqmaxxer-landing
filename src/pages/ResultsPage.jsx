import { useNavigate, useLocation } from 'react-router-dom';

// Lock icon
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Tick icon for feature lists
function Tick({ color = 'var(--signal)' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function getTier(pct) {
  if (pct >= 90) return { label: 'Exceptional', msg: 'You placed in the top tier of test-takers.' };
  if (pct >= 75) return { label: 'Strong result', msg: 'Well above average performance.' };
  if (pct >= 60) return { label: 'Above average', msg: 'A solid result across the test.' };
  return { label: 'Good effort', msg: 'Your report shows exactly where to improve.' };
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // All values read with safe fallbacks so the page never crashes when arrived
  // at directly (no navigation state) or when an older quiz omits a field.
  const score            = state?.score            ?? null;
  const totalQuestions   = state?.totalQuestions   ?? null;
  const weightedScore    = state?.weightedScore    ?? null;
  const maxWeightedScore = state?.maxWeightedScore ?? null;
  const categoryScores   = state?.categoryScores   ?? {};

  // Primary ring: raw percentage correct (unchanged behaviour).
  const pct  = score != null && totalQuestions ? Math.round((score / totalQuestions) * 100) : null;
  const tier = pct != null ? getTier(pct) : null;

  // Difficulty-weighted percentage (Stage 2). Only shown when both values exist
  // and the denominator is non-zero, so there is no divide-by-zero.
  const weightedPct =
    weightedScore != null && maxWeightedScore
      ? Math.round((weightedScore / maxWeightedScore) * 100)
      : null;

  // Show category breakdown only when there are meaningful category names
  // (more than one category, or a single category that is not the catch-all "General").
  const catEntries = Object.entries(categoryScores);
  const showCategories =
    catEntries.length > 1 ||
    (catEntries.length === 1 && catEntries[0][0] !== 'General');

  return (
    <div className="page-placeholder" style={{ justifyContent: 'flex-start', paddingTop: 48 }}>
      <div className="results-body">

        {/* ── Free summary ───────────────────────────────────────── */}
        <div className="tag" style={{ marginBottom: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
          Your IQ test result
        </div>

        <h1 style={{ fontSize: 30, marginBottom: 10 }}>Your cognitive profile is ready.</h1>

        {tier && (
          <p style={{ marginBottom: 20, textAlign: 'center' }}>
            {tier.msg}
          </p>
        )}

        {/* Score ring */}
        <div
          className="reveal-ring"
          style={{
            background: pct != null
              ? `conic-gradient(#2E6CF6 0 ${pct}%, #E4E8EF ${pct}% 100%)`
              : 'conic-gradient(#E4E8EF 0 100%)',
            margin: '0 auto 10px',
          }}
        >
          <div className="inner">
            <b>{pct != null ? pct : '—'}</b>
            <span>{pct != null ? '% correct' : 'complete'}</span>
          </div>
        </div>

        {score != null && totalQuestions != null && (
          <p style={{ textAlign: 'center', color: 'var(--slate)', fontSize: 14, marginBottom: 0 }}>
            {score} of {totalQuestions} correct
            {tier && (
              <> &middot; <strong style={{ color: 'var(--ink)' }}>{tier.label}</strong></>
            )}
          </p>
        )}

        {/* Difficulty-weighted score (Stage 2) — only when present */}
        {weightedPct != null && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12.5, marginTop: 4 }}>
            Difficulty-weighted score: {weightedPct}%
          </p>
        )}

        {/* Category breakdown */}
        {showCategories && (
          <div className="results-cat-section">
            <span className="results-cat-label">Score by category</span>
            <div className="results-cat-rows">
              {catEntries
                .sort((a, b) => b[1].pct - a[1].pct)
                .map(([cat, data]) => (
                  <div className="results-cat-row" key={cat}>
                    <span className="results-cat-name" title={cat}>{cat}</span>
                    <div className="results-cat-bar-wrap">
                      <div className="results-cat-bar-fill" style={{ width: `${data.pct}%` }} />
                    </div>
                    <span className="results-cat-pct">{data.pct}%</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Locked section ─────────────────────────────────────── */}
        <div className="results-locked">
          <div className="locked-header">
            <span className="locked-header-icon"><LockIcon /></span>
            <span className="locked-header-title">Unlock Your Full IQMaxxer Report</span>
          </div>
          <div className="locked-body">
            <ul className="locked-list">
              <li><Tick /> Estimated IQ range on the standard 80–160 scale</li>
              <li><Tick /> Percentile ranking vs. 2.4M IQMaxxer test-takers</li>
              <li><Tick /> Your strongest cognitive categories</li>
              <li><Tick /> Areas with the most improvement potential</li>
              <li><Tick /> Personalized cognitive explanation</li>
              <li><Tick /> Downloadable &amp; shareable certificate</li>
            </ul>
            <button
              className="btn btn-signal"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Unlock Full Report <span className="arrow">→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
