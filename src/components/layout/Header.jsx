import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mark, Wordmark } from '../Brand.jsx';
import { AuthModal } from '../AuthModal.jsx';

export default function Header() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'

  return (
    <>
      <header className="hdr">
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Mark size={22} />
          <Wordmark />
        </div>

        <nav className="hdr-nav">
          <button className="hdr-login" onClick={() => setAuthMode('login')}>
            Log In
          </button>
          <button className="hdr-signup" onClick={() => setAuthMode('signup')}>
            Sign Up
          </button>
          <button className="hdr-cta" onClick={() => navigate('/quiz/start')}>
            Start Test
          </button>
        </nav>
      </header>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </>
  );
}
