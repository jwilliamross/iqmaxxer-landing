import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const navigate = useNavigate();

  return (
    <div className="page-placeholder">
      <div className="tag">Checkout</div>
      <h1>Unlock your full report.</h1>
      <p>
        Payment and subscription management will be integrated here via Stripe or a similar
        payment provider. Plans, pricing, and trial options go in this section.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-signal" style={{ width: 'auto', padding: '16px 32px' }}>
          Subscribe — coming soon
        </button>
        <button className="btn btn-ghost" style={{ width: 'auto', padding: '16px 24px' }} onClick={() => navigate('/')}>
          Back to home
        </button>
      </div>
    </div>
  );
}
