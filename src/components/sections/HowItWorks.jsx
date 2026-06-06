import { ic } from '../icons.jsx';
import { Reveal } from '../widgets.jsx';

const STEPS = [
  { n: '01', t: 'Take the test', d: 'Get an unbiased, standardized view of how you reason — across four core sub-scales.', i: ic.clipboard },
  { n: '02', t: 'Get your detailed report', d: 'See your percentile, your strengths, and the exact areas with the most room to grow.', i: ic.report },
  { n: '03', t: 'Begin your journey', d: 'Start improving with expert courses, brain-training drills and progress tracking.', i: ic.rocket },
];

export default function HowItWorks() {
  return (
    <section className="sec alt">
      <Reveal>
        <div className="eyebrow">How it works</div>
        <h2 className="title">Three steps to a sharper you.</h2>
        <p className="kicker">No jargon, no gatekeeping — a clear path from curiosity to measurable growth.</p>
      </Reveal>
      <div className="steps">
        {STEPS.map((s, k) => (
          <Reveal key={k} delay={k * 80}>
            <div className="step">
              <div className="ic">{s.i}</div>
              <div>
                <div className="n">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
