// icons.jsx — inline SVG icon set used across the landing page

export const ic = {
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="12" height="17" rx="2" stroke="#2E6CF6" strokeWidth="1.8" />
      <path d="M9 4a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 4M9 10h6M9 14h4" stroke="#2E6CF6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 19V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2z" stroke="#2E6CF6" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13l2 2 4-4" stroke="#2E6CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 15c-1 2-1 4-1 4s2 0 4-1m1-3a8 8 0 015-9c2-1 5-1 5-1s0 3-1 5a8 8 0 01-9 5l-4-4z" stroke="#2E6CF6" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#6B7280" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="#6B7280" strokeWidth="1.6" />
      <path d="M8 10h8M8 14h5" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 10V8a6 6 0 1112 0v2m-9 0h6a3 3 0 013 3v5a3 3 0 01-3 3H9a3 3 0 01-3-3v-5a3 3 0 013-3z" stroke="#6B7280" strokeWidth="1.8" />
    </svg>
  ),
};

export function TestIcon({ kind }) {
  if (kind === 'iq')
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M9 3a4 4 0 00-4 4 3.5 3.5 0 00-1 6.5A3.5 3.5 0 009 19V3z" stroke="#0A1F44" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M15 3a4 4 0 014 4 3.5 3.5 0 011 6.5A3.5 3.5 0 0115 19V3z" stroke="#2E6CF6" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 3v16" stroke="#0A1F44" strokeWidth="1.6" />
      </svg>
    );
  if (kind === 'persona')
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#2E6CF6" strokeWidth="1.6" />
        <path d="M5 20a7 7 0 0114 0" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
      <path d="M9 18h6m-5 3h4M12 3a6 6 0 00-4 10.5c.7.6 1 1.2 1 2h6c0-.8.3-1.4 1-2A6 6 0 0012 3z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export const seal = (
  <svg className="seal" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l2 1.6 2.5-.4 1 2.3 2.3 1-.4 2.5L21 12l-1.6 2 .4 2.5-2.3 1-1 2.3-2.5-.4L12 22l-2-1.6-2.5.4-1-2.3-2.3-1 .4-2.5L3 12l1.6-2-.4-2.5 2.3-1 1-2.3 2.5.4z"
      fill="#2E6CF6"
    />
    <path d="M8.5 12l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
