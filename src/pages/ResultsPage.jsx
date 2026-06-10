import { useNavigate, useLocation } from 'react-router-dom';
import { ic } from '../components/icons.jsx';

function getTier(pct) {
  if (pct >= 90) return { label: 'Exceptional', msg: 'You placed in the top tier of test-takers. Your full IQ score and cognitive breakdown are waiting.' };
  if (pct >= 75) return { label: 'Strong result', msg: 'Well above average performance. Your detailed report shows exactly where your strengths lie.' };
  if (pct >= 60) return { label: 'Above average', msg: 'A solid result. Your cognitive profile identifies where to sharpen further.' };
  return { label: 'Solid effort', msg: 'Your full report identifies your biggest growth opportunities and the fastest path to improve.' };
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const score          = state?.score          ?? null;
  const totalQuestions = state?.totalQuestions ?? null;

  const pct  = score != null && totalQuestions ? Math.round((score / totalQuestions) * 100) : null;
  const tier = pct != null ? getTier(pct) : null;

  return (
    <div className="page-placeholder">
      <div className="tag">{ic.report} Your IQ test result</div>
      <h1>Your cognitive profile is ready.</h1>
      <p style={{ maxWidth: 460, margin: '0 auto 28px' }}>
        {tier
          ? tier.msg
          : "You've completed the IQ test. Unlock your full report to see your score and cognitive breakdown."}
      </p>

      {/* Score ring */}
      <div
        className="reveal-ring"
        style={{
          background: pct != null
            ? `conic-gradient(#2E6CF6 0 ${pct}%, #E4E8EF ${pct}% 100%)`
            : 'conic-gradient(#2E6CF6 0 0%, #E4E8EF 0% 100%)',
          margin: '0 auto 10px',
        }}
      >
        <div className="inner">
          <b>{pct != null ? pct : '—'}</b>
          <span>{pct != null ? '% correct' : 'complete'}</span>
        </div>
      </div>

      {score != null && totalQuestions != null && (
        <p style={{ textAlign: 'center', color: 'var(--slate)', fontSize: 14, marginBottom: 28 }}>
          {score} of {totalQuestions} correct
          {tier ? <> &middot; <strong style={{ color: 'var(--ink)' }}>{tier.label}</strong></> : null}
        </p>
      )}

      <button
        className="btn btn-signal"
        style={{ width: 'auto', padding: '16px 32px' }}
        onClick={() => navigate('/checkout')}
      >
        Unlock full IQ report <span className="arrow">→</span>
      </button>
    </div>
  );
}
