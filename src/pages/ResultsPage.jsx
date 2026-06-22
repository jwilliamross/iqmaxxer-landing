import { useNavigate, useLocation } from 'react-router-dom';
import { computeIq, categoryHighlights } from '../lib/iqScoring.js';
import Certificate from '../components/Certificate.jsx';

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

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Safe fallbacks so the page never crashes on direct/refresh navigation.
  const score            = state?.score            ?? null;
  const totalQuestions   = state?.totalQuestions   ?? null;
  const weightedScore    = state?.weightedScore    ?? null;
  const maxWeightedScore = state?.maxWeightedScore ?? null;
  const categoryScores   = state?.categoryScores   ?? {};
  const sessionId        = state?.sessionId        ?? null;
  const unlocked         = state?.unlocked === true;

  // IQ + percentile: prefer values computed at quiz completion; recompute as a
  // fallback (e.g. older navigation state) from the weighted score.
  let iq = state?.iq ?? null;
  let percentile = state?.percentile ?? null;
  if (iq == null) {
    const c = computeIq({ weightedScore, maxWeightedScore, rawScore: score, totalQuestions });
    if (c) { iq = c.iq; percentile = c.percentile; }
  }

  const { strongest, weakest } = categoryHighlights(categoryScores);
  const catEntries = Object.entries(categoryScores).sort((a, b) => b[1].pct - a[1].pct);

  // No score data at all (arrived here directly) — guide the user back.
  if (iq == null) {
    return (
      <div className="page-placeholder" style={{ justifyContent: 'flex-start', paddingTop: 48 }}>
        <div className="results-body">
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>No result to show yet</h1>
          <p style={{ color: 'var(--slate)', marginBottom: 22, textAlign: 'center' }}>
            Take the test to see your cognitive profile.
          </p>
          <button className="btn btn-signal" onClick={() => navigate('/quiz/start')}>
            Start the test <span className="arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-placeholder" style={{ justifyContent: 'flex-start', paddingTop: 48 }}>
      <div className="results-body">

        <div className="tag" style={{ marginBottom: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
          Your IQ test result
        </div>

        <h1 style={{ fontSize: 30, marginBottom: 10 }}>
          {unlocked ? 'Your full report' : 'Your cognitive profile is ready.'}
        </h1>

        {/* Percentile teaser — shown free (the hook). */}
        {percentile != null && (
          <p style={{ marginBottom: 18, textAlign: 'center', fontSize: 16 }}>
            You scored higher than{' '}
            <strong style={{ color: 'var(--signal)' }}>{percentile}%</strong> of test-takers.
          </p>
        )}

        {/* IQ ring — blurred + locked when not unlocked, revealed when paid. */}
        <div
          className="reveal-ring"
          style={{
            background: `conic-gradient(#2E6CF6 0 ${percentile ?? 50}%, #E4E8EF ${percentile ?? 50}% 100%)`,
            margin: '0 auto 12px',
            position: 'relative',
          }}
        >
          <div className="inner">
            <b
              style={
                unlocked
                  ? undefined
                  : { filter: 'blur(10px)', userSelect: 'none', pointerEvents: 'none' }
              }
            >
              {iq}
            </b>
            <span>{unlocked ? 'Estimated IQ' : 'IQ locked'}</span>
          </div>
          {!unlocked && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink)',
                pointerEvents: 'none',
              }}
            >
              <LockIcon />
            </div>
          )}
        </div>

        {/* Strong / weak highlights — shown free. */}
        {(strongest || weakest) && (
          <p style={{ textAlign: 'center', color: 'var(--slate)', fontSize: 14, marginBottom: 4 }}>
            {strongest && <>Strongest area: <strong style={{ color: 'var(--ink)' }}>{strongest}</strong></>}
            {strongest && weakest && ' · '}
            {weakest && <>Most room to grow: <strong style={{ color: 'var(--ink)' }}>{weakest}</strong></>}
          </p>
        )}

        {score != null && totalQuestions != null && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12.5, marginTop: 2 }}>
            {score} of {totalQuestions} correct
          </p>
        )}

        {/* ── UNLOCKED: full paid report ─────────────────────────── */}
        {unlocked ? (
          <>
            {catEntries.length > 0 && (
              <div className="results-cat-section">
                <span className="results-cat-label">Score by category</span>
                <div className="results-cat-rows">
                  {catEntries.map(([cat, data]) => (
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

            <div style={{ marginTop: 22 }}>
              <Certificate iq={iq} percentile={percentile} sessionId={sessionId} />
            </div>

            <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 16, textAlign: 'center' }}>
              This is an <strong>estimated</strong> score for self-insight and entertainment — not a
              clinical diagnosis. Scores are recalibrated as more people take the test.
            </p>

            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 14 }}
              onClick={() => navigate('/')}
            >
              ← Back to home
            </button>
          </>
        ) : (
          /* ── LOCKED: free teaser + unlock CTA ─────────────────── */
          <div className="results-locked">
            <div className="locked-header">
              <span className="locked-header-icon"><LockIcon /></span>
              <span className="locked-header-title">Unlock Your Full IQMaxxer Report</span>
            </div>
            <div className="locked-body">
              <ul className="locked-list">
                <li><Tick /> Your exact estimated IQ score</li>
                <li><Tick /> Full percentile ranking</li>
                <li><Tick /> Category-by-category cognitive breakdown</li>
                <li><Tick /> Your strongest &amp; weakest areas in detail</li>
                <li><Tick /> Downloadable &amp; shareable certificate</li>
              </ul>
              <button
                className="btn btn-signal"
                style={{ width: '100%' }}
                onClick={() => navigate('/checkout', { state })}
              >
                Unlock Full Report <span className="arrow">→</span>
              </button>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 10 }}>
                🔒 Secure checkout · One-time payment · 30-day money-back guarantee
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
