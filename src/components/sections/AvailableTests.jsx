import { useNavigate } from 'react-router-dom';
import { ic, TestIcon } from '../icons.jsx';
import { Reveal } from '../widgets.jsx';

export default function AvailableTests() {
  const navigate = useNavigate();
  const go = () => navigate('/quiz/start');

  return (
    <section className="sec">
      <Reveal>
        <div className="eyebrow">Available tests</div>
        <h2 className="title">Each test reveals a new part of you.</h2>
        <p className="kicker">Start with intelligence. More dimensions of you are coming soon.</p>
      </Reveal>
      <div className="tests">
        <Reveal>
          <div className="test-card featured">
            <div className="badge">Most popular</div>
            <div className="ti"><TestIcon kind="iq" /></div>
            <h3>IQ / Intelligence Test</h3>
            <div className="test-meta">
              <span>{ic.clock} 14 min</span>
              <span>{ic.list} 25 questions</span>
            </div>
            <button className="btn btn-signal" onClick={go}>
              Start IQ test now <span className="arrow">→</span>
            </button>
          </div>
        </Reveal>
        <Reveal delay={70}>
          <div className="test-card">
            <div className="ti"><TestIcon kind="persona" /></div>
            <h3>Personality Type</h3>
            <div className="test-meta">
              <span>{ic.clock} 20 min</span>
              <span>{ic.list} 90 questions</span>
            </div>
            <button className="btn-soon" disabled>Coming soon</button>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="test-card">
            <div className="ti"><TestIcon kind="career" /></div>
            <h3>Career Aptitude</h3>
            <div className="test-meta">
              <span>{ic.clock} 25 min</span>
              <span>{ic.list} 35 questions</span>
            </div>
            <button className="btn-soon" disabled>Coming soon</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
