import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuestions, createSession } from '../services/quizService.js';

// ─── Helpers ─────────────────────────────────────────────────

// Try common column names for the question prompt.
// Update the first entry to match your Supabase column name exactly.
function getPrompt(q) {
  return q.question ?? q.prompt ?? q.text ?? q.body ?? q.title ?? '';
}

// Normalise options from either a jsonb array or flat option_a/b/c/d columns.
function parseOptions(q) {
  if (Array.isArray(q.options) && q.options.length > 0) {
    return q.options.map((o, i) => ({
      key: String.fromCharCode(65 + i),
      label: typeof o === 'string' ? o : (o.text ?? String(o)),
    }));
  }
  return ['a', 'b', 'c', 'd']
    .filter((l) => q[`option_${l}`] != null)
    .map((l) => ({ key: l.toUpperCase(), label: q[`option_${l}`] }));
}

// ─── Loading screen ───────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="quiz-start-page">
      <div className="analyze" style={{ padding: '0 0 20px' }}>
        <div className="ring" />
        <p className="stat-line">Loading questions…</p>
      </div>
    </div>
  );
}

// ─── Error screen ─────────────────────────────────────────────
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="quiz-start-page">
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16 }}>
          <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.8" />
          <line x1="12" y1="7" x2="12" y2="13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1.1" fill="#DC2626" />
        </svg>
        <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Could not load questions
        </h2>
        <p style={{ color: 'var(--slate)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 26px' }}>
          {message}
        </p>
        <button
          className="btn btn-signal"
          style={{ width: 'auto', padding: '14px 32px' }}
          onClick={onRetry}
        >
          Try again <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ─── Empty screen ─────────────────────────────────────────────
function EmptyScreen({ onBack }) {
  return (
    <div className="quiz-start-page">
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <p style={{ color: 'var(--slate)', marginBottom: 24, fontSize: 15 }}>
          No questions found in the database yet.
        </p>
        <button className="btn btn-ghost" style={{ width: 'auto', padding: '14px 28px' }} onClick={onBack}>
          ← Go back
        </button>
      </div>
    </div>
  );
}

// ─── Quiz page ────────────────────────────────────────────────
export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile  = location.state ?? {}; // { gender, age, email } from onboarding

  const [questions, setQuestions] = useState([]);
  const [status,    setStatus]    = useState('loading'); // 'loading' | 'error' | 'empty' | 'ready'
  const [errMsg,    setErrMsg]    = useState('');
  const [current,   setCurrent]   = useState(0);
  const [picked,    setPicked]    = useState({}); // { [questionId]: optionKey }

  // Save email to test_sessions once on mount (fire-and-forget — no UI feedback needed yet)
  useEffect(() => {
    if (profile.email) {
      createSession({ email: profile.email });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(() => {
    setStatus('loading');
    setErrMsg('');
    getQuestions()
      .then(({ data, error }) => {
        if (error) {
          setErrMsg(error.message ?? 'An unexpected error occurred.');
          setStatus('error');
          return;
        }
        if (!data || data.length === 0) {
          setStatus('empty');
          return;
        }
        setQuestions(data);
        setStatus('ready');
      })
      .catch((err) => {
        setErrMsg(err.message ?? 'An unexpected error occurred.');
        setStatus('error');
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'error')   return <ErrorScreen message={errMsg} onRetry={load} />;
  if (status === 'empty')   return <EmptyScreen onBack={() => navigate(-1)} />;

  // ── Render question ───────────────────────────────────────────
  const q        = questions[current];
  const prompt   = getPrompt(q);
  const options  = parseOptions(q);
  const sel      = picked[q.id];
  const isLast   = current === questions.length - 1;
  const progress = Math.round(((current + 1) / questions.length) * 100);
  const canAdvance = sel != null || options.length === 0;

  const advance = () => {
    if (isLast) {
      navigate('/results', { state: { ...profile, answers: picked } });
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <div className="quiz-start-page">
      <div className="quiz-start-form">

        {/* Progress bar */}
        <div className="m-progress" style={{ marginBottom: 6 }}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
          <span className="step-lbl">
            Question {current + 1} of {questions.length}
            {q.sub_scale ? ` · ${q.sub_scale}` : ''}
          </span>
          <span className="step-lbl" style={{ color: 'var(--muted)' }}>
            {progress}%
          </span>
        </div>

        {/* Question prompt — Issue #1 fix: uses getPrompt() with multi-key fallback */}
        <h2 className="quiz-start-h" style={{ marginBottom: options.length ? 24 : 16 }}>
          {prompt || <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>Question text unavailable</span>}
        </h2>

        {/* Answer options */}
        {options.length > 0 && (
          <div className="opt-list">
            {options.map((o) => (
              <button
                key={o.key}
                className={`opt${sel === o.key ? ' sel' : ''}`}
                onClick={() => setPicked((p) => ({ ...p, [q.id]: o.key }))}
              >
                <b>{o.key}</b>
                {o.label}
              </button>
            ))}
          </div>
        )}

        {/* Navigation — Issue #3 fix: both buttons flex: 1 for equal width */}
        <div className="quiz-nav">
          {current > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => setCurrent((c) => c - 1)}
            >
              ← Back
            </button>
          )}
          <button
            className="btn btn-signal"
            style={!canAdvance ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            onClick={canAdvance ? advance : undefined}
          >
            {isLast ? 'See my results' : 'Next'} <span className="arrow">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
