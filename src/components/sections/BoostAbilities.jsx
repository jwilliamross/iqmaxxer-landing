import { Reveal } from '../widgets.jsx';

const BOOST = [
  { n: '1', t: 'Expert video courses', li: ['20+ hours of expert-led lessons', 'Learn at your own pace', 'Track your progress over time'] },
  { n: '2', t: 'Brain-training games', li: ['Diverse cognitive exercises', 'Progressive difficulty levels', 'Train memory, logic, focus & speed'] },
  { n: '3', t: '150+ puzzles', li: ['Intelligence-boosting puzzles', 'Smart difficulty progression', 'Master pattern & strategic thinking'] },
];

export default function BoostAbilities() {
  return (
    <section className="sec ink">
      <Reveal>
        <div className="eyebrow" style={{ color: '#8BB1FF' }}>Boost your abilities</div>
        <h2 className="title" style={{ color: '#fff' }}>Don't just measure it. Maxx it.</h2>
        <p className="kicker">Unlock your potential with a complete cognitive training package.</p>
      </Reveal>
      <div className="boost">
        {BOOST.map((b, k) => (
          <Reveal key={k} delay={k * 80}>
            <div className="boost-card">
              <div className="num">{b.n}</div>
              <h3>{b.t}</h3>
              <ul>
                {b.li.map((x, j) => <li key={j}>{x}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
