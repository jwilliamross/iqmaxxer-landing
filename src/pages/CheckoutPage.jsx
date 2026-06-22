import { useNavigate, useLocation } from 'react-router-dom';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const FEATURES = [
  'Your exact estimated IQ score',
  'Full percentile ranking',
  'Category-by-category cognitive breakdown',
  'Your strongest & weakest areas',
  'Downloadable & shareable certificate',
];

const CARDS = ['VISA', 'Mastercard', 'Amex', 'PayPal'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Stripe is not wired yet (deferred). For now "purchase" simulates a successful
  // payment by returning to results with the report unlocked. When Stripe is added,
  // its payment-success callback should navigate here with the SAME { ...state, unlocked: true }.
  const completePurchase = () => {
    navigate('/results', { state: { ...(state || {}), unlocked: true } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">

        {/* Blue header */}
        <div className="checkout-top">
          <div className="tag" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 12 }}>
            IQMaxxer · Full Report
          </div>
          <h2>Unlock your full report</h2>
          <div className="checkout-price-row">
            <span className="sym">$</span>
            <span className="amt">14.99</span>
            <span className="sym" style={{ fontSize: 16, alignSelf: 'flex-end', marginBottom: 6 }}>CAD</span>
          </div>
          <p className="checkout-price-note">One-time payment · No subscription · No hidden fees</p>
        </div>

        {/* White body */}
        <div className="checkout-body">
          <ul className="checkout-features">
            {FEATURES.map((f) => (
              <li key={f}><CheckIcon /> {f}</li>
            ))}
          </ul>

          <button
            className="btn btn-signal"
            style={{ width: '100%' }}
            onClick={completePurchase}
          >
            Unlock my full report <span className="arrow">→</span>
          </button>

          {/* Trust row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '6px 16px',
              margin: '14px 0 4px',
              fontSize: 12,
              color: 'var(--slate)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ShieldIcon /> 30-day money-back guarantee
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <LockIcon /> Bank-level encrypted checkout
            </span>
          </div>

          {/* Card badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            {CARDS.map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9.5,
                  letterSpacing: '0.04em',
                  color: 'var(--muted)',
                  border: '1px solid var(--line, #eceff4)',
                  borderRadius: 5,
                  padding: '3px 7px',
                  background: '#fff',
                }}
              >
                {c}
              </span>
            ))}
          </div>

          <p className="checkout-notice" style={{ marginTop: 12 }}>
            Secure card payment connects before public launch.
          </p>

          <button className="checkout-back" onClick={() => navigate(-1)}>
            ← Back to results
          </button>
        </div>

      </div>
    </div>
  );
}
