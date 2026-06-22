// Clean SVG renderers for the 8 visual questions, keyed by the question `code`.
// The DB row carries the prompt / correct_answer / category / difficulty and a
// `visual` flag; the figure (and option tiles, when visual) come from here.
//
// Registry entry shape:
//   { figure: <svg/> | null, options?: { A:<svg/>, B:<svg/>, C:<svg/>, D:<svg/> } }
// If `options` is omitted, the quiz falls back to the DB text options (option_a..d).

const INK = '#0A1F44';
const SIGNAL = '#2E6CF6';
const LINE = '#d8dee9';

// ── primitives ───────────────────────────────────────────────────────────────

function Frame({ size = 72, children, vb }) {
  return (
    <svg viewBox={vb || `0 0 ${size} ${size}`} width="100%" style={{ display: 'block' }}>
      {children}
    </svg>
  );
}

// up to 9 dots in a 3x3 layout inside a cell of side s
function dots(n, s, ox = 0, oy = 0, r = null) {
  const pad = s * 0.22;
  const gap = (s - 2 * pad) / 2;
  const rad = r ?? s * 0.08;
  const out = [];
  for (let i = 0; i < 9 && i < n; i++) {
    const c = i % 3;
    const rr = Math.floor(i / 3);
    out.push(<circle key={i} cx={ox + pad + c * gap} cy={oy + pad + rr * gap} r={rad} fill={INK} />);
  }
  return out;
}

// arrow pointing up, rotated `angle` degrees clockwise, centered in side s
function arrow(angle, s, ox = 0, oy = 0) {
  const cx = ox + s / 2;
  const cy = oy + s / 2;
  const h = s * 0.3;
  return (
    <g
      transform={`rotate(${angle} ${cx} ${cy})`}
      stroke={INK}
      strokeWidth={Math.max(2, s * 0.05)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={cx} y1={cy + h} x2={cx} y2={cy - h} />
      <polyline points={`${cx - h * 0.55},${cy - h * 0.35} ${cx},${cy - h} ${cx + h * 0.55},${cy - h * 0.35}`} />
    </g>
  );
}

const shapeProps = { fill: 'none', stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' };

function shape(name, s = 72, scale = 1) {
  const c = s / 2;
  const R = (s * 0.34) * scale;
  switch (name) {
    case 'circle':
      return <circle cx={c} cy={c} r={R} {...shapeProps} />;
    case 'square':
      return <rect x={c - R} y={c - R} width={R * 2} height={R * 2} {...shapeProps} />;
    case 'triangle':
      return <polygon points={`${c},${c - R} ${c + R},${c + R} ${c - R},${c + R}`} {...shapeProps} />;
    case 'pentagon': {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a = (-90 + i * 72) * (Math.PI / 180);
        pts.push(`${c + R * Math.cos(a)},${c + R * Math.sin(a)}`);
      }
      return <polygon points={pts.join(' ')} {...shapeProps} />;
    }
    default:
      return null;
  }
}

// small filled symbols for the cube-net faces / options
function symbol(name, s = 72) {
  const c = s / 2;
  const R = s * 0.26;
  switch (name) {
    case 'dot':
      return <circle cx={c} cy={c} r={R} fill={INK} />;
    case 'square':
      return <rect x={c - R} y={c - R} width={R * 2} height={R * 2} fill={INK} />;
    case 'triangle':
      return <polygon points={`${c},${c - R} ${c + R},${c + R} ${c - R},${c + R}`} fill={INK} />;
    case 'plus':
      return (
        <g fill={INK}>
          <rect x={c - R * 0.28} y={c - R} width={R * 0.56} height={R * 2} />
          <rect x={c - R} y={c - R * 0.28} width={R * 2} height={R * 0.56} />
        </g>
      );
    case 'diamond':
      return <polygon points={`${c},${c - R} ${c + R},${c} ${c},${c + R} ${c - R},${c}`} fill={INK} />;
    case 'ring':
      return <circle cx={c} cy={c} r={R} fill="none" stroke={INK} strokeWidth={s * 0.07} />;
    default:
      return null;
  }
}

function cell(s, content, key) {
  return (
    <g key={key}>
      <rect x={1} y={1} width={s - 2} height={s - 2} fill="#fff" stroke={LINE} strokeWidth={1.5} rx={4} />
      {content}
    </g>
  );
}

function Question({ s = 72 }) {
  return (
    <text x={s / 2} y={s / 2 + s * 0.18} textAnchor="middle" fontSize={s * 0.5} fontWeight="800" fill={SIGNAL}>?</text>
  );
}

// 3x3 matrix built from a per-index cell renderer (i = 0..8). Index 8 is the "?".
function matrix3x3(renderCell) {
  const S = 120;
  const cs = S / 3;
  const out = [];
  for (let i = 0; i < 9; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const content = (
      <g transform={`translate(${col * cs} ${row * cs})`}>
        <rect x={1} y={1} width={cs - 2} height={cs - 2} fill="#fff" stroke={LINE} strokeWidth={1.5} />
        {i === 8 ? <Question s={cs} /> : renderCell(i, cs)}
      </g>
    );
    out.push(<g key={i}>{content}</g>);
  }
  return <Frame size={S}>{out}</Frame>;
}

// letter "F" with an arbitrary transform (for rotation vs mirror)
function letterF(transform) {
  return (
    <Frame size={72}>
      <g transform={transform}>
        <text x={36} y={50} textAnchor="middle" fontSize={46} fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">F</text>
      </g>
    </Frame>
  );
}

// ── registry ───────────────────────────────────────────────────────────────

export const VISUALS = {
  // Abstract — dot-count matrix (1..9; answer 9)
  'ABS-MAT-201': {
    figure: matrix3x3((i, cs) => <g>{dots(i + 1, cs)}</g>),
    options: {
      A: <Frame>{dots(8, 72)}</Frame>,
      B: <Frame>{dots(9, 72)}</Frame>, // correct
      C: <Frame>{dots(7, 72)}</Frame>,
      D: <Frame>{dots(6, 72)}</Frame>,
    },
  },

  // Abstract — rotating arrow matrix (i*45°; next = 360° = up)
  'ABS-MAT-202': {
    figure: matrix3x3((i, cs) => arrow(i * 45, cs)),
    options: {
      A: <Frame>{arrow(0, 72)}</Frame>, // up — correct
      B: <Frame>{arrow(90, 72)}</Frame>,
      C: <Frame>{arrow(180, 72)}</Frame>,
      D: <Frame>{arrow(270, 72)}</Frame>,
    },
  },

  // Abstract — figure analogy: small→big circle :: small→big square
  'ABS-ANA-201': {
    figure: (
      <Frame vb="0 0 230 64" size={64}>
        {/* small circle */}
        <circle cx={22} cy={32} r={9} {...shapeProps} />
        <text x={48} y={38} fontSize={20} fill={INK}>→</text>
        {/* big circle */}
        <circle cx={86} cy={32} r={20} {...shapeProps} />
        <text x={116} y={38} fontSize={20} fill={INK}>::</text>
        {/* small square */}
        <rect x={135} y={23} width={18} height={18} {...shapeProps} />
        <text x={165} y={38} fontSize={20} fill={INK}>→</text>
        <text x={205} y={42} textAnchor="middle" fontSize={30} fontWeight="800" fill={SIGNAL}>?</text>
      </Frame>
    ),
    options: {
      A: <Frame>{shape('square', 72, 1.25)}</Frame>, // big square — correct
      B: <Frame>{shape('square', 72, 0.6)}</Frame>,
      C: <Frame>{shape('circle', 72, 1.25)}</Frame>,
      D: <Frame>{shape('triangle', 72, 1.25)}</Frame>,
    },
  },

  // Abstract — odd one out (circle has no straight edges)
  'ABS-CLS-201': {
    figure: null,
    options: {
      A: <Frame>{shape('square', 72)}</Frame>,
      B: <Frame>{shape('triangle', 72)}</Frame>,
      C: <Frame>{shape('pentagon', 72)}</Frame>,
      D: <Frame>{shape('circle', 72)}</Frame>, // correct — odd one out
    },
  },

  // Spatial — which is a MIRROR (not a rotation) of F
  'SPA-ROT-201': {
    figure: letterF(''),
    options: {
      A: letterF('rotate(90 36 36)'),
      B: letterF('rotate(180 36 36)'),
      C: letterF('translate(72 0) scale(-1 1)'), // mirror — correct
      D: letterF('rotate(270 36 36)'),
    },
  },

  // Spatial — cube net: face opposite the dot (●) is the square (■)
  'SPA-NET-201': {
    figure: (() => {
      const S = 40; // face side
      const faces = [
        { x: 1, y: 0, sym: 'triangle' }, // U (top)
        { x: 0, y: 1, sym: 'ring' },     // L
        { x: 1, y: 1, sym: 'dot' },      // F (center)
        { x: 2, y: 1, sym: 'diamond' },  // R
        { x: 1, y: 2, sym: 'plus' },     // D
        { x: 1, y: 3, sym: 'square' },   // B
      ];
      return (
        <Frame vb={`0 0 ${S * 3} ${S * 4}`} size={S * 4}>
          {faces.map((f, i) => (
            <g key={i} transform={`translate(${f.x * S} ${f.y * S})`}>
              <rect x={1} y={1} width={S - 2} height={S - 2} fill="#fff" stroke={LINE} strokeWidth={1.5} />
              <g transform={`translate(${S * 0.15} ${S * 0.15}) scale(0.7)`}>{symbol(f.sym, S)}</g>
            </g>
          ))}
        </Frame>
      );
    })(),
    options: {
      A: <Frame>{symbol('triangle', 72)}</Frame>,
      B: <Frame>{symbol('square', 72)}</Frame>, // opposite the dot — correct
      C: <Frame>{symbol('plus', 72)}</Frame>,
      D: <Frame>{symbol('diamond', 72)}</Frame>,
    },
  },

  // Spatial — which piece completes the square (fills the cut corner)
  'SPA-ASM-201': {
    figure: (
      <Frame size={100}>
        {/* square with top-right corner triangle removed */}
        <polygon points="6,6 60,6 60,40 94,40 94,94 6,94" fill="rgba(46,108,246,0.06)" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <text x={74} y={26} textAnchor="middle" fontSize={26} fontWeight="800" fill={SIGNAL}>?</text>
      </Frame>
    ),
    options: {
      // correct: a rectangle matching the 34x34 missing corner block
      A: <Frame><rect x={20} y={20} width={32} height={32} fill="rgba(46,108,246,0.10)" stroke={INK} strokeWidth={3} /></Frame>,
      B: <Frame><polygon points="20,52 52,52 52,20" fill="rgba(46,108,246,0.10)" stroke={INK} strokeWidth={3} strokeLinejoin="round" /></Frame>,
      C: <Frame><rect x={26} y={26} width={20} height={20} fill="rgba(46,108,246,0.10)" stroke={INK} strokeWidth={3} /></Frame>,
      D: <Frame><circle cx={36} cy={36} r={17} fill="rgba(46,108,246,0.10)" stroke={INK} strokeWidth={3} /></Frame>,
    },
  },

  // Spatial — paper folded into quarters, one hole punched, unfolded → 4 holes (text options)
  'SPA-FOLD-201': {
    figure: (
      <Frame size={100}>
        <rect x={8} y={8} width={84} height={84} fill="#fff" stroke={INK} strokeWidth={3} />
        <line x1={50} y1={8} x2={50} y2={92} stroke={LINE} strokeWidth={2} strokeDasharray="5 5" />
        <line x1={8} y1={50} x2={92} y2={50} stroke={LINE} strokeWidth={2} strokeDasharray="5 5" />
        {/* punched hole in the top-left quarter */}
        <circle cx={29} cy={29} r={7} fill={INK} />
      </Frame>
    ),
    // options come from DB text (2 / 3 / 4 / 8)
  },
};

export function getVisual(code) {
  return (code && VISUALS[code]) || null;
}
