// Brand.jsx — IQMaxxer logo mark + wordmark

export function Mark({ size = 22, light = false }) {
  const navy = light ? '#fff' : '#0A1F44';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="IQMaxxer">
      <rect x="4" y="28" width="6" height="16" rx="1.5" fill={navy} />
      <rect x="14" y="22" width="6" height="22" rx="1.5" fill={navy} />
      <rect x="24" y="14" width="6" height="30" rx="1.5" fill={navy} />
      <rect x="34" y="6" width="6" height="38" rx="1.5" fill="#2E6CF6" />
      <circle cx="7" cy="24" r="2" fill="#2E6CF6" />
      <circle cx="17" cy="18" r="2" fill="#2E6CF6" />
      <circle cx="27" cy="10" r="2" fill="#2E6CF6" />
      <circle cx="37" cy="2" r="2" fill={navy} />
      <path
        d="M7 24 L17 18 L27 10 L37 2"
        stroke="#2E6CF6"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Wordmark({ light = false }) {
  return (
    <span className="wm" style={light ? { color: '#fff' } : undefined}>
      IQ<em style={light ? { color: '#8BB1FF' } : undefined}>Maxxer</em>
    </span>
  );
}
