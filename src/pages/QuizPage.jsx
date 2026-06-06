import { useNavigate } from 'react-router-dom';
import { ic } from '../components/icons.jsx';

export default function QuizPage() {
  const navigate = useNavigate();

  return (
    <div className="page-placeholder">
      <div className="tag">{ic.clipboard} Reasoning Assessment</div>
      <h1>Quiz</h1>
      <p>
        This page will host the 25-question reasoning assessment across four sub-scales:
        verbal, spatial, pattern recognition, and working memory.
      </p>
      <button className="btn btn-signal" style={{ width: 'auto', padding: '16px 32px' }} onClick={() => navigate('/results')}>
        Preview results page <span className="arrow">→</span>
      </button>
    </div>
  );
}
