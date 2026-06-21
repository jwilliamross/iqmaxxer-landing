// ─────────────────────────────────────────────────────────────────────────────
// DRAFT QUESTION BANK PREVIEW — DEV/LOCAL ONLY
//
// This page is a safe, offline preview of data/question_bank_draft.json.
// It does NOT touch Supabase, does NOT create sessions, does NOT save answers,
// and is completely separate from the production /quiz flow (QuizPage.jsx).
//
// It exists so the 20-item draft bank can be viewed and answered in the browser
// before any seeding/wiring happens. Scoring here is local-only and reuses the
// pure helpers in ../lib/scoringUtils.js (which have no Supabase dependency).
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bank from '../../data/question_bank_draft.json';
import { calculateScore, checkCorrect } from '../lib/scoringUtils.js';

// ─── Adapter ────────────────────────────────────────────────────────────────
// Map each draft item to the shape the quiz UI / scoring utils expect, while
// preserving the original metadata under `meta` for display + debug.
function adaptItem(raw) {
  return {
    // Fields consumed by scoringUtils + the option UI:
    id:             raw.item_id,
    prompt:         raw.prompt,
    option_a:       raw.option_a,
    option_b:       raw.option_b,
    option_c:       raw.option_c,
    option_d:       raw.option_d,
    correct_answer: raw.correct_answer,
    category:       raw.user_category,
    difficulty:     raw.difficulty_target,
    // Metadata (display + debug only):
    meta: {
      version:               raw.version,
      item_format:           raw.item_format,
      visual_asset_required: raw.visual_asset_required === true,
      visual_asset_id:       raw.visual_asset_id ?? null,
      rawOptions: {
        A: raw.option_a,
        B: raw.option_b,
        C: raw.option_c,
        D: raw.option_d,
      },
    },
  };
}

function buildOptions(q) {
  return ['a', 'b', 'c', 'd']
    .filter((l) => q[`option_${l}`] != null)
    .map((l) => ({ key: l.toUpperCase(), label: q[`option_${l}`] }));
}

// ─── Small presentational bits ───────────────────────────────────────────────

function MetaRow({ q, index, total }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 14px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        color: 'var(--muted)',
        marginBottom: 18,
      }}
    >
      <span>ITEM {index + 1}/{total}</span>
      <span>· {q.id}</span>
      <span>· {q.category}</span>
      <span>· D{q.difficulty}</span>
      <span>· v{q.meta.version}</span>
      <span>· {q.meta.item_format}</span>
    </div>
  );
}

function VisualPlaceholder({ q }) {
  return (
    <div
      style={{
        border: '1.5px dashed var(--line-2, #d8dee9)',
        borderRadius: 12,
        padding: '22px 18px',
        background: 'rgba(46,108,246,0.03)',
        marginBottom: 22,
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontWeight: 800,
          fontSize: 15,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
        }}
      >
        🖼️ Visual asset pending
      </p>
      <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--slate)' }}>
        <div><b>item_id:</b> {q.id}</div>
        <div><b>item_format:</b> {q.meta.item_format}</div>
        <div><b>visual_asset_id:</b> {q.meta.visual_asset_id ?? '—'}</div>
        <div><b>category:</b> {q.category}</div>
        <div><b>difficulty:</b> {q.difficulty}</div>
        <div><b>correct_answer:</b> {q.correct_answer}</div>
      </div>
      <p style={{ margin: '14px 0 0', fontSize: 12, color: 'var(--muted)' }}>
        This item requires an SVG that has not been generated yet, so it is not
        answerable in preview. Advance to continue.
      </p>

      {/* Developer/debug area — raw placeholder option strings, clearly labelled */}
      <details style={{ marginTop: 14 }}>
        <summary
          style={{
            cursor: 'pointer',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'var(--muted)',
          }}
        >
          DEV: raw option references
        </summary>
        <pre
          style={{
            margin: '8px 0 0',
            padding: 10,
            background: 'var(--paper, #fff)',
            border: '1px solid var(--line, #eceff4)',
            borderRadius: 8,
            fontSize: 11,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'var(--slate)',
          }}
        >
{Object.entries(q.meta.rawOptions)
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}
        </pre>
      </details>
    </div>
  );
}

// ─── Score summary ────────────────────────────────────────────────────────────

function ScoreSummary({ questions, picked, onRestart, onExit }) {
  const { rawScore, weightedScore, maxWeightedScore, categoryScores } =
    calculateScore(questions, picked);

  const answered = Object.keys(picked).length;
  const visualCount = questions.filter((q) => q.meta.visual_asset_required).length;
  const textCount = questions.length - visualCount;

  return (
    <div className="quiz-start-page">
      <div className="quiz-start-form">
        <h2 className="quiz-start-h" style={{ marginBottom: 4 }}>
          Preview score
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 22 }}>
          Local-only — nothing was saved to Supabase.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 22,
          }}
        >
          <Stat label="Raw score" value={`${rawScore} / ${questions.length}`} />
          <Stat label="Answered" value={`${answered} / ${questions.length}`} />
          <Stat
            label="Weighted"
            value={`${weightedScore} / ${maxWeightedScore}`}
          />
          <Stat
            label="Text / Visual"
            value={`${textCount} / ${visualCount}`}
          />
        </div>

        {visualCount > 0 && (
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
            Note: the {visualCount} visual items are not answerable in preview, so
            they always count as unanswered here.
          </p>
        )}

        <h3
          style={{
            fontSize: 13,
            fontWeight: 800,
            margin: '18px 0 10px',
            color: 'var(--ink)',
          }}
        >
          By category
        </h3>
        <div style={{ display: 'grid', gap: 8, marginBottom: 26 }}>
          {Object.entries(categoryScores).map(([cat, c]) => (
            <div
              key={cat}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                padding: '8px 12px',
                border: '1px solid var(--line, #eceff4)',
                borderRadius: 10,
              }}
            >
              <span style={{ color: 'var(--ink)' }}>{cat}</span>
              <span style={{ color: 'var(--slate)' }}>
                {c.correct}/{c.total} · {c.pct}%
              </span>
            </div>
          ))}
        </div>

        <div className="quiz-nav">
          <button className="btn btn-ghost" onClick={onExit}>
            ← Exit preview
          </button>
          <button className="btn btn-signal" onClick={onRestart}>
            Restart <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        border: '1px solid var(--line, #eceff4)',
        borderRadius: 10,
        padding: '12px 14px',
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          marginBottom: 4,
        }}
      >
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}

// ─── Mode toggle ───────────────────────────────────────────────────────────────

function ModeToggle({ mode, onChange, textCount, allCount }) {
  const tabs = [
    { key: 'text', label: `Playable text-only · ${textCount}` },
    { key: 'all', label: `All ${allCount} items` },
  ];
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map((t) => {
          const active = mode === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              aria-pressed={active}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 10,
                border: active
                  ? '1.5px solid var(--signal)'
                  : '1px solid var(--line, #eceff4)',
                background: active ? 'rgba(46,108,246,0.08)' : 'var(--paper, #fff)',
                color: active ? 'var(--ink)' : 'var(--slate)',
                fontWeight: active ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <p style={{ margin: '8px 2px 0', fontSize: 12, color: 'var(--muted)' }}>
        Visual items require SVG generation before they are playable.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizPreviewPage() {
  const navigate = useNavigate();
  const allQuestions = useMemo(() => (bank.items ?? []).map(adaptItem), []);
  // Preview mode: 'text' = only playable text items, 'all' = every item incl. visual.
  const [mode, setMode] = useState('text'); // default to playable text-only
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState({}); // { [id]: optionKey }
  const [finished, setFinished] = useState(false);

  // Active question set for the selected mode. Scoring + progress derive from this,
  // so everything stays accurate to whichever mode is showing.
  const questions = useMemo(
    () =>
      mode === 'text'
        ? allQuestions.filter((q) => !q.meta.visual_asset_required)
        : allQuestions,
    [mode, allQuestions],
  );

  const textCount = useMemo(
    () => allQuestions.filter((q) => !q.meta.visual_asset_required).length,
    [allQuestions],
  );
  const allCount = allQuestions.length;

  // Switching mode resets the run so `current` can't point past the new set.
  function changeMode(next) {
    if (next === mode) return;
    setMode(next);
    setCurrent(0);
    setPicked({});
    setFinished(false);
  }

  if (allQuestions.length === 0) {
    return (
      <div className="quiz-start-page">
        <p style={{ color: 'var(--slate)' }}>
          No items found in data/question_bank_draft.json.
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <ScoreSummary
        questions={questions}
        picked={picked}
        onRestart={() => {
          setPicked({});
          setCurrent(0);
          setFinished(false);
        }}
        onExit={() => navigate('/')}
      />
    );
  }

  const q = questions[current];
  const isVisual = q.meta.visual_asset_required;
  const options = isVisual ? [] : buildOptions(q);
  const sel = picked[q.id];
  const isLast = current === questions.length - 1;
  const progress = Math.round(((current + 1) / questions.length) * 100);
  // Visual items have no answerable options, so they may always advance.
  const canAdvance = isVisual || sel != null;
  const revealed = !isVisual && sel != null;

  return (
    <div className="quiz-start-page">
      <div className="quiz-start-form">

        {/* Preview banner */}
        <div
          style={{
            border: '1.5px solid var(--signal)',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 20,
            background: 'rgba(46,108,246,0.05)',
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 14,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
            }}
          >
            Draft Question Bank Preview
          </div>
          <div style={{ fontSize: 12, color: 'var(--signal)', marginTop: 2 }}>
            Local preview only — not Supabase
          </div>
        </div>

        {/* Mode toggle */}
        <ModeToggle
          mode={mode}
          onChange={changeMode}
          textCount={textCount}
          allCount={allCount}
        />

        {/* Progress */}
        <div className="m-progress" style={{ marginBottom: 8 }}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <MetaRow q={q} index={current} total={questions.length} />

        {/* Prompt */}
        <h2 className="quiz-start-h" style={{ whiteSpace: 'pre-line', marginBottom: 20 }}>
          {q.prompt || (
            <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>
              Question text unavailable
            </span>
          )}
        </h2>

        {/* Body: visual placeholder OR real options */}
        {isVisual ? (
          <VisualPlaceholder q={q} />
        ) : (
          <div className="opt-list">
            {options.map((o) => {
              const isCorrectOpt = revealed && checkCorrect(q, o.key) === true;
              const isWrongPick = revealed && sel === o.key && !isCorrectOpt;
              const extra = isCorrectOpt
                ? { borderColor: '#16A34A', background: 'rgba(22,163,74,0.07)' }
                : isWrongPick
                ? { borderColor: '#DC2626', background: 'rgba(220,38,38,0.06)' }
                : undefined;
              return (
                <button
                  key={o.key}
                  className={`opt${sel === o.key ? ' sel' : ''}`}
                  style={extra}
                  onClick={() => setPicked((p) => ({ ...p, [q.id]: o.key }))}
                >
                  <b>{o.key}</b>
                  {o.label}
                  {isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#16A34A' }}>✓</span>}
                  {isWrongPick && <span style={{ marginLeft: 'auto', color: '#DC2626' }}>✗</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Correctness feedback */}
        {revealed && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 14,
              color: checkCorrect(q, sel) === true ? '#16A34A' : '#DC2626',
            }}
          >
            {checkCorrect(q, sel) === true
              ? 'Correct ✓'
              : `Incorrect ✗ — correct answer: ${q.correct_answer}`}
          </p>
        )}

        {/* Navigation */}
        <div className="quiz-nav">
          {current > 0 && (
            <button className="btn btn-ghost" onClick={() => setCurrent((c) => c - 1)}>
              ← Back
            </button>
          )}
          <button
            className="btn btn-signal"
            style={!canAdvance ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            onClick={() => {
              if (!canAdvance) return;
              if (isLast) setFinished(true);
              else setCurrent((c) => c + 1);
            }}
            disabled={!canAdvance}
          >
            {isLast ? 'See preview score' : isVisual ? 'Skip (visual)' : 'Next'}
            <span className="arrow"> →</span>
          </button>
        </div>

      </div>
    </div>
  );
}
