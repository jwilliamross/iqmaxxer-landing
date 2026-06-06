// StartModal.jsx — interactive multi-step "Start Test" flow
import { useState, useEffect } from 'react';
import { ic } from './icons.jsx';

const STAT_LINES = [
  'Scoring verbal reasoning…',
  'Calibrating against 2.1M norms…',
  'Computing percentile band…',
  'Encrypting your result…',
];

export function StartModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [pick, setPick] = useState(null);
  const [statI, setStatI] = useState(0);

  // mount / unmount with exit animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      setStep(0);
      setEmail('');
      setErr('');
      setPick(null);
    } else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // analyzing ticker → auto-advance to the reveal
  useEffect(() => {
    if (step !== 2) return;
    setStatI(0);
    const id = setInterval(() => setStatI((v) => Math.min(STAT_LINES.length - 1, v + 1)), 600);
    const t = setTimeout(() => setStep(3), 2500);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [step]);

  if (!mounted) return null;

  const progress = [22, 52, 80, 100][step];

  const submitEmail = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setErr('Enter a valid email to save your results.');
      return;
    }
    setErr('');
    setStep(1);
  };

  return (
    <div className={'modal-scrim' + (closing ? ' closing' : '')} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab"></div>
        <div className="m-progress">
          <span style={{ width: progress + '%' }}></span>
        </div>

        {step === 0 && (
          <div>
            <div className="step-lbl">Step 1 of 3 · Secure your spot</div>
            <h3>Where should we send your detailed report?</h3>
            <p className="sub">Your assessment is encrypted on-device. No spam — just your results and progress.</p>
            <input
              className={'field' + (err ? ' err' : '')}
              type="email"
              inputMode="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && submitEmail()}
              autoFocus
            />
            <p className="err-msg">{err}</p>
            <button className="btn btn-signal" onClick={submitEmail}>
              Continue <span className="arrow">→</span>
            </button>
            <div className="lock-row" style={{ marginTop: 14 }}>
              {ic.lock}
              End-to-end encrypted
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="step-lbl">Step 2 of 3 · Warm-up question</div>
            <h3>Which word completes the analogy?</h3>
            <p className="sub">
              <b>Archipelago</b> is to <b>islands</b> as <b>constellation</b> is to —
            </p>
            <div className="opt-list">
              {['Planets', 'Stars', 'Galaxies', 'Meteors'].map((o, k) => (
                <button key={k} className={'opt' + (pick === k ? ' sel' : '')} onClick={() => setPick(k)}>
                  <b>{String.fromCharCode(65 + k)}</b>
                  {o}
                </button>
              ))}
            </div>
            <button
              className="btn btn-signal"
              disabled={pick === null}
              style={pick === null ? { opacity: 0.45 } : undefined}
              onClick={() => setStep(2)}
            >
              Score my answer <span className="arrow">→</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="analyze">
            <div className="ring"></div>
            <h3 style={{ textAlign: 'center' }}>Analyzing your response</h3>
            <p className="stat-line">{STAT_LINES[statI]}</p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div className="step-lbl" style={{ textAlign: 'center' }}>Result preview</div>
            <h3 style={{ textAlign: 'center' }}>Your warm-up percentile is ready.</h3>
            <div className="reveal-ring" style={{ background: 'conic-gradient(#2E6CF6 0 84%, #E4E8EF 84% 100%)' }}>
              <div className="inner">
                <b className="blur-teaser">84</b>
                <span>Percentile</span>
              </div>
            </div>
            <p className="sub" style={{ textAlign: 'center' }}>
              You scored above most test-takers on this item. Take the full 14-minute assessment to unlock your verified composite score
              and sub-scale breakdown.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Unlock my full report <span className="arrow">→</span>
            </button>
            <div className="lock-row" style={{ marginTop: 14 }}>
              {ic.lock}
              Sent to {email || 'your inbox'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
