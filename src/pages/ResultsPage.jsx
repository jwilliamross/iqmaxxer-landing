import { useNavigate } from 'react-router-dom';
import { ic } from '../components/icons.jsx';

export default function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="page-placeholder">
      <div className="tag">{ic.report} Sample result</div>
      <h1>Your cognitive profile is ready.</h1>
      <p>
        This page will display your percentile score, sub-scale breakdown, and
        personalised recommendations. Results are blurred until checkout is complete.
      </p>
      <div
        className="reveal-ring"
        style={{ background: 'conic-gradient(#2E6CF6 0 84%, #E4E8EF 84% 100%)', margin: '0 auto 28px' }}
      >
        <div className="inner">
          <b className="blur-teaser">84</b>
          <span>Percentile</span>
        </div>
      </div>
      <button className="btn btn-signal" style={{ width: 'auto', padding: '16px 32px' }} onClick={() => navigate('/checkout')}>
        Unlock full report <span className="arrow">→</span>
      </button>
    </div>
  );
}
