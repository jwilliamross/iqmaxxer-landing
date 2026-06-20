import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const FEATURES = [
  'Estimated IQ range (80–160 scale)',
  'Full percentile ranking vs. 2.4M test-takers',
  'Category-by-category cognitive breakdown',
  'Strongest and weakest cognitive areas',
  'Personalized performance explanation',
  'Downloadable & shareable certificate',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  return (
    <div className="checkout-page">
      <div className="checkout-card">

        {/* Blue header */}
        <div className="checkout-top">
          <div className="tag" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 12 }}>
            IQMaxxer · Full Report
          </div>
          <h2>One-time report unlock</h2>
          <div className="checkout-price-row">
            <span className="sym">$</span>
            <span className="amt">14.99</span>
            <span className="sym" style={{ fontSize: 16, alignSelf: 'flex-end', marginBottom: 6 }}>CAD</span>
          </div>
          <p className="checkout-price-note">One-time payment in CAD · No subscription · No hidden fees</p>
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
            onClick={() => setClicked(true)}
          >
            Continue to Secure Checkout <span className="arrow">→</span>
          </button>

          {clicked && (
            <p className="checkout-notice">
              Payment connection coming next — we're adding Stripe before launch.
            </p>
          )}

          <button className="checkout-back" onClick={() => navigate(-1)}>
            ← Back to results
          </button>
        </div>

      </div>
    </div>
  );
}
