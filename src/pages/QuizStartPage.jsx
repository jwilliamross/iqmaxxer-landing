import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ic } from '../components/icons.jsx';

// ─── Gender symbol SVGs ───────────────────────────────────────
function FemaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <line x1="12" y1="14.5" x2="12" y2="21" />
      <line x1="9" y1="18.5" x2="15" y2="18.5" />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="13.5" r="5.5" />
      <line x1="14.8" y1="9.2" x2="20" y2="4" />
      <polyline points="16 4 20 4 20 8" />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff"
      strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const GENDERS = [
  { id: 'female', label: 'Female',              icon: <FemaleIcon /> },
  { id: 'male',   label: 'Male',                icon: <MaleIcon />   },
  { id: 'other',  label: 'Prefer not to say',   icon: <NeutralIcon /> },
];

// ─── Page ────────────────────────────────────────────────────
export default function QuizStartPage() {
  const navigate = useNavigate();

  // step 0 = gender/age, step 1 = email
  const [step, setStep] = useState(0);

  const [gender,    setGender]    = useState(null);
  const [genderErr, setGenderErr] = useState('');
  const [age,       setAge]       = useState('');
  const [ageErr,    setAgeErr]    = useState('');
  const [email,     setEmail]     = useState('');
  const [emailErr,  setEmailErr]  = useState('');

  const submitStep0 = () => {
    if (!gender) {
      setGenderErr('Please select an option to continue.');
      return;
    }
    const n = parseInt(age, 10);
    if (!age || isNaN(n) || n < 13 || n > 110) {
      setAgeErr('Enter a valid age (13–110) to continue.');
      return;
    }
    setGenderErr('');
    setAgeErr('');
    setStep(1);
  };

  const submitStep1 = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setEmailErr('Enter a valid email to save your results.');
      return;
    }
    // Pass profile through navigation state; quiz page can read via useLocation().state
    navigate('/quiz', { state: { gender, age: parseInt(age, 10), email: email.trim() } });
  };

  const progress = step === 0 ? 33 : 66;

  return (
    <div className="quiz-start-page">
      <div className="quiz-start-form">

        {/* Progress bar */}
        <div className="m-progress" style={{ marginBottom: 28 }}>
          <span style={{ width: `${progress}%` }} />
        </div>

        {/* ── Step 0: gender + age ── */}
        {step === 0 && (
          <>
            <div className="step-lbl" style={{ marginBottom: 12 }}>Step 1 of 3 · Tell us about you</div>
            <h2 className="quiz-start-h">A few quick things first.</h2>
            <p className="quiz-start-sub">
              Norms vary by age and gender. This helps us return the most accurate percentile for you.
            </p>

            {/* Gender */}
            <div className="quiz-start-field-group">
              <label className="quiz-start-label">Gender</label>
              <div className="gender-cards">
                {GENDERS.map((g) => {
                  const sel = gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      className={`gender-card ${g.id}${sel ? ' sel' : ''}`}
                      onClick={() => { setGender(g.id); setGenderErr(''); }}
                    >
                      <div className="gc-icon">{g.icon}</div>
                      <span className="gc-label">{g.label}</span>
                      <div className="gc-check">{sel && <CheckIcon />}</div>
                    </button>
                  );
                })}
              </div>
              {genderErr && <p className="err-msg" style={{ marginTop: 8 }}>{genderErr}</p>}
            </div>

            {/* Age */}
            <div className="quiz-start-field-group">
              <label className="quiz-start-label">Age</label>
              <input
                className={`field${ageErr ? ' err' : ''}`}
                type="number"
                inputMode="numeric"
                placeholder="e.g. 28"
                min="13"
                max="110"
                value={age}
                onChange={(e) => { setAge(e.target.value); setAgeErr(''); }}
                onKeyDown={(e) => e.key === 'Enter' && submitStep0()}
                style={{ marginBottom: 0 }}
              />
              {ageErr && <p className="err-msg">{ageErr}</p>}
            </div>

            <button className="btn btn-signal" onClick={submitStep0}>
              Continue <span className="arrow">→</span>
            </button>
          </>
        )}

        {/* ── Step 1: email ── */}
        {step === 1 && (
          <>
            <div className="step-lbl" style={{ marginBottom: 12 }}>Step 2 of 3 · Secure your spot</div>
            <h2 className="quiz-start-h">Where should we send your detailed report?</h2>
            <p className="quiz-start-sub">
              Your assessment is encrypted on-device. No spam — just your results and progress.
            </p>
            <input
              className={`field${emailErr ? ' err' : ''}`}
              type="email"
              inputMode="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
              onKeyDown={(e) => e.key === 'Enter' && submitStep1()}
              autoFocus
            />
            <p className="err-msg">{emailErr}</p>
            <button className="btn btn-signal" onClick={submitStep1}>
              Start my IQ test <span className="arrow">→</span>
            </button>
            <div className="lock-row" style={{ marginTop: 14 }}>
              {ic.lock} End-to-end encrypted
            </div>
          </>
        )}

      </div>
    </div>
  );
}
