import { seal } from '../icons.jsx';
import { Reveal } from '../widgets.jsx';

const GETS = [
  'Your verified IQ score with a full percentile breakdown of how you performed',
  'A cognitive profile revealing your strengths and natural thinking patterns',
  'Targeted brain exercises matched to your weakest sub-scales',
  'Session-over-session tracking so you can watch your delta climb',
];

export default function WhatYouGet() {
  return (
    <section className="sec alt">
      <Reveal>
        <div className="eyebrow">What you'll get</div>
        <h2 className="title">A report you'll actually use.</h2>
      </Reveal>
      <div className="scroller">
        {GETS.map((g, k) => (
          <div className="get-card" key={k}>
            {seal}
            <p>{g}</p>
          </div>
        ))}
      </div>
      <div className="swipe-hint">
        <span>Swipe</span>
        <span className="ln"></span>
        <span>{GETS.length} benefits</span>
      </div>
    </section>
  );
}
