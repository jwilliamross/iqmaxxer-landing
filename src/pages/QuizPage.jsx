import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getQuestions,
  createSession,
  saveAnswer,
  completeSession,
} from '../services/quizService.js';
import { checkCorrect, calculateScore } from '../lib/scoringUtils.js';
import { computeIq } from '../lib/iqScoring.js';
import { getVisual } from '../components/quiz/VisualQuestion.jsx';

// ─── Session persistence ──────────────────────────────────────────────────────
// Stored per browser tab (sessionStorage clears on tab close, not on refresh).
// Prevents creating a second test_sessions row if the user refreshes mid-quiz.
const QUIZ_KEY = 'iqmaxxer_quiz';

function loadStored() {
  try { return JSON.parse(sessionStorage.getItem(QUIZ_KEY) ?? 'null'); } catch { return null; }
}
function persistSession(sessionId, profile) {
  try { sessionStorage.setItem(QUIZ_KEY, JSON.stringify({ sessionId, profile })); } catch {}
}
function clearStored() {
  try { sessionStorage.removeItem(QUIZ_KEY); } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Column fallback: Supabase table uses 'prompt' per schema docs.
function getPrompt(q) {
  return q.prompt ?? q.question ?? q.text ?? q.body ?? q.title ?? '';
}

// Handles both jsonb options array and flat option_a/b/c/d columns.
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

// NOTE: scoring logic (checkCorrect, weighted score, category scores) lives in
// ../lib/scoringUtils.js so it can be reused and unit-tested independently.

// ─── Screens ──────────────────────────────────────────────────────────────────

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
        <button className="btn btn-signal" style={{ width: 'auto', padding: '14px 32px' }} onClick={onRetry}>
          Try again <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

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

// ─── Quiz page ────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Profile from onboarding; falls back to stored value if user refreshed
  const stored   = loadStored();
  const profile  = (location.state && Object.keys(location.state).length > 0)
    ? location.state
    : (stored?.profile ?? {});

  const [questions, setQuestions] = useState([]);
  const [status,    setStatus]    = useState('loading');
  const [errMsg,    setErrMsg]    = useState('');
  const [current,   setCurrent]   = useState(0);
  const [picked,    setPicked]    = useState({}); // { [questionId]: optionKey }
  const [sessionId, setSessionId] = useState(stored?.sessionId ?? null);
  const [advancing, setAdvancing] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Prevents StrictMode double-invoke AND cross-refresh duplication.
  // If sessionStorage already has an ID, skip createSession entirely.
  const sessionInitiated = useRef(Boolean(stored?.sessionId));

  // Tracks which question IDs have already had an answer row inserted.
  // Prevents duplicate rows if the user double-clicks Next on non-last questions.
  const savedQIds = useRef(new Set());

  useEffect(() => {
    if (sessionInitiated.current) return;
    sessionInitiated.current = true;

    createSession({
      email:  profile.email  ?? null,
      age:    profile.age    ?? null,
      gender: profile.gender ?? null,
    }).then(({ sessionId: id, error }) => {
      if (error) {
        console.error('[QuizPage] createSession failed:', error.message);
        setSaveError('Could not start your session. Your answers may not be saved.');
      }
      if (id) {
        setSessionId(id);
        persistSession(id, {
          email:  profile.email  ?? null,
          age:    profile.age    ?? null,
          gender: profile.gender ?? null,
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(() => {
    setStatus('loading');
    setErrMsg('');
    getQuestions()
      .then(({ data, error }) => {
        if (error) { setErrMsg(error.message ?? 'An unexpected error occurred.'); setStatus('error'); return; }
        if (!data || data.length === 0) { setStatus('empty'); return; }
        setQuestions(data);
        setStatus('ready');
      })
      .catch((err) => { setErrMsg(err.message ?? 'An unexpected error occurred.'); setStatus('error'); });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'error')   return <ErrorScreen message={errMsg} onRetry={load} />;
  if (status === 'empty')   return <EmptyScreen onBack={() => navigate(-1)} />;

  // ── Derived values ────────────────────────────────────────────
  const q          = questions[current];
  const vis        = getVisual(q.code);
  const visOpts    = vis?.options;
  // Visual items with SVG option tiles build options from the registry; everything
  // else (text questions + visual items with text options) uses the DB columns.
  const options    = visOpts
    ? ['A', 'B', 'C', 'D'].map((k) => ({ key: k, svg: visOpts[k] }))
    : parseOptions(q);
  const sel        = picked[q.id];
  const isLast     = current === questions.length - 1;
  const progress   = Math.round(((current + 1) / questions.length) * 100);
  const canAdvance = sel != null || options.length === 0;

  // ── Advance ───────────────────────────────────────────────────
  const advance = async () => {
    if (!canAdvance || advancing) return;

    const selectedKey = sel;
    const isCorrect   = selectedKey != null ? checkCorrect(q, selectedKey) : null;

    // Deduplication: only save once per question ID. Prevents double-click duplicates.
    const alreadySaved = savedQIds.current.has(q.id);
    let savePromise = Promise.resolve();
    if (sessionId && selectedKey != null && !alreadySaved) {
      savedQIds.current.add(q.id);
      savePromise = saveAnswer({ sessionId, questionId: q.id, selectedAnswer: selectedKey, isCorrect });
    }

    if (!isLast) {
      // Fire-and-forget for non-last questions — don't block UI
      savePromise.catch((err) => console.error('[QuizPage] saveAnswer:', err));
      setCurrent((c) => c + 1);
      return;
    }

    // Last question: await everything, then navigate
    setAdvancing(true);
    setSaveError('');

    const finalPicked = selectedKey != null ? { ...picked, [q.id]: selectedKey } : { ...picked };

    // Stage 2 scoring: raw count + difficulty-weighted score + per-category breakdown.
    const { rawScore, weightedScore, maxWeightedScore, categoryScores } =
      calculateScore(questions, finalPicked);

    // Estimated IQ + percentile from the difficulty-weighted performance.
    const iq = computeIq({
      weightedScore,
      maxWeightedScore,
      rawScore,
      totalQuestions: questions.length,
    });

    try {
      await savePromise;
      if (sessionId) {
        const { error: completeErr } = await completeSession({
          sessionId,
          score: rawScore,
          totalQuestions: questions.length,
          weightedScore,
          categoryScores,
          iqEstimate: iq?.iq ?? null,
          percentile: iq?.percentile ?? null,
        });
        if (completeErr) setSaveError('Your score may not have saved. Your result is still shown below.');
      }
    } catch (err) {
      console.error('[QuizPage] Failed to complete session:', err);
      setSaveError('Your score may not have saved. Your result is still shown below.');
    }

    clearStored();

    navigate('/results', {
      state: {
        ...profile,
        sessionId,
        score: rawScore,
        totalQuestions: questions.length,
        weightedScore,
        maxWeightedScore,
        categoryScores,
        iq: iq?.iq ?? null,
        percentile: iq?.percentile ?? null,
      },
    });
  };

  const prompt = getPrompt(q);

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
            {q.category ? ` · ${q.category}` : ''}
          </span>
          <span className="step-lbl" style={{ color: 'var(--muted)' }}>{progress}%</span>
        </div>

        {/* Question prompt */}
        <h2 className="quiz-start-h" style={{ marginBottom: options.length ? 20 : 16 }}>
          {prompt || (
            <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>
              Question text unavailable
            </span>
          )}
        </h2>

        {/* Visual stimulus (figure) for visual questions */}
        {vis?.figure && (
          <div
            style={{
              maxWidth: 300,
              margin: '0 auto 22px',
              padding: 14,
              border: `1px solid var(--line, ${'#eceff4'})`,
              borderRadius: 12,
              background: '#fff',
            }}
          >
            {vis.figure}
          </div>
        )}

        {/* Answer options */}
        {options.length > 0 && (
          visOpts ? (
            // Visual option tiles (2x2 grid of SVGs)
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 4,
              }}
            >
              {options.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => !advancing && setPicked((p) => ({ ...p, [q.id]: o.key }))}
                  disabled={advancing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `2px solid ${sel === o.key ? 'var(--signal)' : 'var(--line, #e4e8ef)'}`,
                    background: sel === o.key ? 'rgba(46,108,246,0.06)' : '#fff',
                    cursor: advancing ? 'not-allowed' : 'pointer',
                  }}
                >
                  <b style={{ color: 'var(--signal)', fontSize: 14 }}>{o.key}</b>
                  <span style={{ flex: 1, maxWidth: 84 }}>{o.svg}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="opt-list">
              {options.map((o) => (
                <button
                  key={o.key}
                  className={`opt${sel === o.key ? ' sel' : ''}`}
                  onClick={() => !advancing && setPicked((p) => ({ ...p, [q.id]: o.key }))}
                  disabled={advancing}
                >
                  <b>{o.key}</b>
                  {o.label}
                </button>
              ))}
            </div>
          )
        )}

        {/* Save error */}
        {saveError && (
          <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
            {saveError}
          </p>
        )}

        {/* Navigation */}
        <div className="quiz-nav">
          {current > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => setCurrent((c) => c - 1)}
              disabled={advancing}
            >
              ← Back
            </button>
          )}
          <button
            className="btn btn-signal"
            style={!canAdvance || advancing ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            onClick={advance}
            disabled={!canAdvance || advancing}
          >
            {advancing ? 'Saving…' : isLast ? 'See my results' : 'Next'}
            {!advancing && <span className="arrow"> →</span>}
          </button>
        </div>

      </div>
    </div>
  );
}
