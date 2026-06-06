// widgets.jsx — animated + interactive building blocks for the landing page
import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView.js';

/* ── Reveal-on-scroll wrapper ── */
export function Reveal({ children, delay = 0 }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  return (
    <div ref={ref} className={'fade-up' + (seen ? ' in' : '')} style={{ transitionDelay: delay + 'ms' }}>
      {children}
    </div>
  );
}

/* ── Stars ── */
export function Stars({ n = 5 }) {
  return (
    <div className="stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill={i < n ? '#F5A623' : '#E4E8EF'}>
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Count-up number (animates when scrolled into view) ── */
export function CountUp({ to, dur = 1400, fmt = (v) => v }) {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf;
    let start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);
  return <span ref={ref}>{fmt(val)}</span>;
}

/* ── Animated bell curve with draggable percentile slider ──
   (Not used on the current page, but kept available for reuse.) */
export function BellCurve() {
  const W = 320;
  const H = 150;
  const base = 128;
  const peak = 18;
  const mean = 100;
  const sd = 15;
  const xFor = (iq) => ((iq - 55) / (145 - 55)) * (W - 24) + 12;
  const yFor = (iq) => {
    const z = (iq - mean) / sd;
    const g = Math.exp(-0.5 * z * z);
    return base - g * (base - peak);
  };
  let d = '';
  for (let iq = 55; iq <= 145; iq += 1.5) {
    const x = xFor(iq);
    const y = yFor(iq);
    d += iq === 55 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  const fillD = `${d} L${xFor(145).toFixed(1)} ${base} L${xFor(55).toFixed(1)} ${base} Z`;

  const [ref, seen] = useInView({ threshold: 0.4 });
  const [iq, setIq] = useState(100);
  const pct = (() => {
    const z = (iq - mean) / sd;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const dd = 0.3989423 * Math.exp((-z * z) / 2);
    let p = dd * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    p = z > 0 ? 1 - p : p;
    return Math.max(1, Math.min(99, Math.round(p * 100)));
  })();
  const mx = xFor(iq);
  const my = yFor(iq);

  return (
    <div className="curve-card" ref={ref}>
      <div className="curve-head">
        <span className="lbl">Population distribution</span>
        <span className="val">You ≈ {pct}th pct</span>
      </div>
      <svg className="curve-svg" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="bcfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E6CF6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2E6CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="12" y1={base} x2={W - 12} y2={base} stroke="#E4E8EF" strokeWidth="1" />
        {[55, 70, 85, 100, 115, 130, 145].map((t) => (
          <g key={t}>
            <line x1={xFor(t)} y1={base} x2={xFor(t)} y2={base + 4} stroke="#D8DEE8" strokeWidth="1" />
            <text x={xFor(t)} y={base + 15} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="JetBrains Mono, monospace">
              {t}
            </text>
          </g>
        ))}
        <path d={fillD} fill="url(#bcfill)" opacity={seen ? 1 : 0} style={{ transition: 'opacity .8s ease .3s' }} />
        <path
          d={d}
          fill="none"
          stroke="#2E6CF6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="900"
          strokeDashoffset={seen ? 0 : 900}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) .2s' }}
        />
        <line x1={mx} y1={my} x2={mx} y2={base} stroke="#0A1F44" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.55" />
        <circle cx={mx} cy={my} r="6" fill="#0A1F44" stroke="#fff" strokeWidth="2.5" />
      </svg>
      <div className="slider-wrap">
        <input type="range" min="55" max="145" value={iq} onChange={(e) => setIq(Number(e.target.value))} aria-label="Estimate your IQ" />
        <div className="slider-hint">
          <span>Drag to estimate · {iq} IQ</span>
          <span>Avg 100</span>
        </div>
      </div>
    </div>
  );
}

/* ── Press marquee ── */
export function PressMarquee() {
  const outlets = [
    { t: 'Forbes', s: true },
    { t: 'TechCrunch' },
    { t: 'Newsweek', s: true },
    { t: 'USA TODAY' },
    { t: 'WIRED' },
    { t: 'Business Insider' },
    { t: 'Yahoo Finance' },
    { t: 'The Times', s: true },
  ];
  const row = [...outlets, ...outlets];
  return (
    <div className="marquee">
      <div className="cap">As featured in</div>
      <div className="track">
        {row.map((o, i) => (
          <span key={i} className={'logo' + (o.s ? ' serif' : '')}>
            {o.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Reviews carousel (auto-advance) ── */
const REVIEWS = [
  { name: 'Marcus T.', n: 5, body: '"Sharpest assessment I’ve taken online. The percentile breakdown by sub-scale actually told me something I didn’t know."', when: '2 days ago' },
  { name: 'Priya N.', n: 5, body: '"Fast, clean, no fluff. Retested after a month of the brain drills and my logical reasoning score jumped 6 points."', when: 'yesterday' },
  { name: 'devon.r@…', n: 4, body: '"Skeptical going in. The report is genuinely detailed and the data-export option sold me — it’s mine to keep."', when: '4 days ago' },
  { name: 'Aisha K.', n: 5, body: '"Felt like a real cognitive exam, not a buzzfeed quiz. Loved tracking the delta between sessions."', when: 'yesterday' },
  { name: 'Tom W.', n: 5, body: '"Treated it like a speed round and was genuinely surprised by the spatial section. Came back the next day to do it properly."', when: '3 days ago' },
];
export function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 3200);
    return () => clearInterval(id);
  }, [paused]);
  const r = REVIEWS[i];
  return (
    <div>
      <div
        className="review-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <Stars n={r.n} />
        <div className="name">{r.name}</div>
        <p className="body" key={i} style={{ animation: 'fadeIn .4s ease' }}>
          {r.body}
        </p>
        <div className="when">{r.when}</div>
      </div>
      <div className="dots">
        {REVIEWS.map((_, k) => (
          <button key={k} className={'d' + (k === i ? ' on' : '')} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} />
        ))}
      </div>
      <div className="tp-line">
        <span className="tp-badge">
          <svg viewBox="0 0 24 24" fill="#15803D">
            <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
          </svg>
          Trustpilot
        </span>
        <span>
          Rated <b>4.7</b>/5 across <b>128,400+</b> reviews
        </span>
      </div>
    </div>
  );
}

/* ── FAQ accordion ── */
const FAQS = [
  { q: 'How accurate is the IQMaxxer test?', a: 'Our assessment is built on standardized item-response models and normed against a sample of over 2 million test-takers. Each result is reported as a percentile with a confidence band — we show you the uncertainty rather than hiding it.' },
  { q: 'How long does the test take?', a: 'The core assessment runs about 14 minutes across four sub-scales: verbal reasoning, spatial logic, pattern recognition and working memory. You can pause and resume on the same device.' },
  { q: 'Is my data secure?', a: 'Yes. Responses are encrypted on-device before transmission. We never sell, share, or train models on your individual results, and you can export or permanently delete your full record at any time.' },
  { q: 'Can I retake the test?', a: 'Absolutely — we encourage it. A single session is a snapshot, not a verdict. Retesting after ~30 days surfaces a meaningful delta so you can track real cognitive change over time.' },
  { q: 'What if I’m not satisfied?', a: 'Every plan is covered by a no-questions-asked refund window. Cancel in two taps from Settings; access continues through the end of your billing period.' },
];
export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={'faq-item' + (isOpen ? ' open' : '')} key={i}>
            <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              {f.q}
              <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#0A1F44" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="faq-a" style={{ maxHeight: isOpen ? 240 : 0 }}>
              <div className="faq-a-inner">{f.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── IQ → Income comparison chart (conversion driver) ── */
const INCOME_DATA = [
  { iq: '85', inc: 34, band: 'Below average' },
  { iq: '100', inc: 53, band: 'Average' },
  { iq: '115', inc: 79, band: 'Above average' },
  { iq: '130', inc: 118, band: 'Superior' },
  { iq: '145', inc: 167, band: 'Top 0.1%' },
];
export function IncomeChart() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const max = 167;
  return (
    <div ref={ref} className="inc-wrap">
      <div className="inc-chart">
        {INCOME_DATA.map((d, i) => {
          const h = seen ? (d.inc / max) * 100 : 0;
          const hot = i >= 3;
          return (
            <div className="inc-col" key={i}>
              <div className="inc-val" style={{ opacity: seen ? 1 : 0, transitionDelay: i * 110 + 650 + 'ms' }}>
                $<CountUp to={d.inc} dur={1300} fmt={(v) => Math.round(v)} />k
              </div>
              <div className="inc-bar-track">
                <div className={'inc-bar' + (hot ? ' hot' : '')} style={{ height: h + '%', transitionDelay: i * 110 + 'ms' }}>
                  {i === INCOME_DATA.length - 1 && <span className="inc-flag">YOU?</span>}
                </div>
              </div>
              <div className="inc-iq">IQ {d.iq}</div>
            </div>
          );
        })}
      </div>
      <div className="inc-legend">
        <span>
          <i className="dot cool"></i>Avg. annual income
        </span>
        <span>
          <i className="dot hot"></i>Where high performers land
        </span>
      </div>
    </div>
  );
}
