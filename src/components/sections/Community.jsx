export default function Community() {
  return (
    <section className="sec ink">
      <h2 className="title" style={{ color: '#fff' }}>Community</h2>
      <p className="kicker">Follow us for daily quizzes, challenges and brain teasers to keep your mind sharp.</p>
      <div className="social">
        <a href="#" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
          </svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="#fff">
            <path d="M14 9V7c0-1 .5-1.5 1.5-1.5H17V2.5h-2.5C12 2.5 11 4 11 6.5V9H8.5v3H11v9h3v-9h2.3l.5-3H14z" />
          </svg>
        </a>
        <a href="#" aria-label="Reddit">
          <svg viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="13" r="8" opacity="0.18" />
            <path d="M20 12a2 2 0 00-3.4-1.4A9 9 0 0012 9l1-4 3 .7" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16.5" cy="5.7" r="1.1" />
            <circle cx="9" cy="14" r="1.2" />
            <circle cx="15" cy="14" r="1.2" />
            <path d="M9.5 17c1.5 1 3.5 1 5 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        </a>
      </div>
    </section>
  );
}
