import { CountUp } from '../widgets.jsx';

export default function Stats() {
  return (
    <section className="sec">
      <div className="stats">
        <div className="stat">
          <div className="n"><CountUp to={2.4} fmt={(v) => v.toFixed(1)} /><span className="u">M</span></div>
          <div className="k">Tests completed</div>
        </div>
        <div className="stat">
          <div className="n"><CountUp to={190} fmt={(v) => Math.round(v)} /><span className="u">+</span></div>
          <div className="k">Countries</div>
        </div>
        <div className="stat">
          <div className="n"><CountUp to={4.7} fmt={(v) => v.toFixed(1)} /><span className="u">★</span></div>
          <div className="k">Avg rating</div>
        </div>
        <div className="stat">
          <div className="n"><CountUp to={14} fmt={(v) => Math.round(v)} /><span className="u"> min</span></div>
          <div className="k">To complete</div>
        </div>
      </div>
    </section>
  );
}
