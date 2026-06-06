import { useState } from 'react';
import { Mark } from './Brand.jsx';
import { login, signup } from '../services/authService.js';

export function AuthModal({ mode: initialMode, onClose }) {
  const [mode,     setMode]     = useState(initialMode);
  const [closing,  setClosing]  = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  const switchMode = (next) => {
    setMode(next);
    setEmailErr('');
    setPassErr('');
  };

  const submit = async () => {
    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr('Enter a valid email address.');
      valid = false;
    } else {
      setEmailErr('');
    }
    if (!password) {
      setPassErr('Enter your password.');
      valid = false;
    } else {
      setPassErr('');
    }
    if (!valid) return;

    setLoading(true);
    if (mode === 'login') {
      await login({ email: email.trim(), password });
    } else {
      await signup({ email: email.trim(), password });
    }
    setLoading(false);
    close();
  };

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div className={'modal-scrim' + (closing ? ' closing' : '')} onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />

        {/* Brand mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Mark size={26} />
        </div>

        <h3 style={{ textAlign: 'center', margin: '0 0 6px' }}>
          {mode === 'login' ? 'Log in to IQMaxxer' : 'Create your account'}
        </h3>
        <p className="sub" style={{ textAlign: 'center', fontSize: 14, marginBottom: 22 }}>
          {mode === 'login'
            ? 'Welcome back. Enter your details to continue.'
            : 'Save your results, track progress, and unlock your full cognitive profile.'}
        </p>

        {/* Email */}
        <input
          className={`field${emailErr ? ' err' : ''}`}
          type="email"
          inputMode="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
          onKeyDown={handleKey}
          autoFocus
        />
        <p className="err-msg">{emailErr}</p>

        {/* Password */}
        <input
          className={`field${passErr ? ' err' : ''}`}
          type="password"
          placeholder={mode === 'login' ? 'Password' : 'Create a password'}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPassErr(''); }}
          onKeyDown={handleKey}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <p className="err-msg">{passErr}</p>

        {/* Submit */}
        <button
          className="btn btn-signal"
          onClick={submit}
          disabled={loading}
          style={loading ? { opacity: 0.72 } : undefined}
        >
          {loading
            ? (mode === 'login' ? 'Logging in…' : 'Creating account…')
            : (mode === 'login' ? 'Log in' : 'Create account')}
          {!loading && <span className="arrow">→</span>}
        </button>

        {/* Mode switch */}
        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button className="auth-switch-btn" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
