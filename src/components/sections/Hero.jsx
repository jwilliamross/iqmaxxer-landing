import { useNavigate } from 'react-router-dom';
import { ic } from '../icons.jsx';
import { IncomeChart } from '../widgets.jsx';

export default function Hero() {
  const navigate = useNavigate();
  const go = () => navigate('/quiz/start');

  return (
    <section className="hero">
      <div className="eyebrow">Cognitive assessment</div>
      <h1 className="disp">
        Want to know your <em>real</em> IQ?
      </h1>
      <p className="lede">
        Take a standardized 14-minute assessment and unlock a precise, private breakdown of how your mind actually works.
      </p>
      <div className="hero-ctas">
        <button className="btn btn-signal" onClick={go}>
          Start IQ test now <span className="arrow">→</span>
        </button>
        <button className="btn btn-ghost" onClick={go}>How it works</button>
      </div>
      <div className="trust-line">
        {ic.lock}
        Encrypted · 14 min · 2.4M tested
      </div>
      <div className="inc-card">
        <div className="inc-card-head">
          <span className="lbl">Avg. annual income by IQ</span>
          <span className="val">+$133k spread</span>
        </div>
        <IncomeChart />
        <div className="inc-delta">
          <div className="big">+$133k</div>
          <div className="cap">
            Average yearly gap between IQ 85 and IQ 145 earners. <b>Every 15 points compounds for life.</b>
          </div>
        </div>
      </div>
    </section>
  );
}
