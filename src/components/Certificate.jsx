// IQMaxxer paid deliverable: a printable / save-as-PDF certificate.
// No external libraries — "Download" opens an isolated print window (browsers
// let the user Save as PDF from the print dialog), so it works everywhere.

function fmtDate(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function certificateMarkup({ iq, percentile, dateStr, verificationId, name }) {
  // Self-contained HTML for the print window.
  return `<!doctype html><html><head><meta charset="utf-8" />
  <title>IQMaxxer Certificate</title>
  <style>
    @page { size: landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Georgia, 'Times New Roman', serif; color: #0A1F44;
      display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
    .cert { width: 960px; max-width: 96vw; padding: 56px 64px; border: 3px solid #0A1F44;
      outline: 1px solid #2E6CF6; outline-offset: 6px; text-align: center; }
    .brand { font-family: -apple-system, Segoe UI, Roboto, sans-serif; letter-spacing: .28em;
      font-size: 13px; text-transform: uppercase; color: #2E6CF6; font-weight: 700; }
    .title { font-size: 34px; margin: 18px 0 6px; }
    .sub { font-size: 14px; color: #5b6b86; font-style: italic; margin-bottom: 28px; }
    .name { font-size: 24px; font-weight: 700; border-bottom: 1px solid #c9d2e3;
      display: inline-block; padding: 0 26px 8px; margin-bottom: 26px; }
    .iq-label { font-family: -apple-system, Segoe UI, Roboto, sans-serif; font-size: 12px;
      letter-spacing: .16em; text-transform: uppercase; color: #5b6b86; }
    .iq { font-size: 80px; font-weight: 800; line-height: 1; margin: 6px 0; }
    .pct { font-size: 16px; color: #0A1F44; margin-bottom: 30px; }
    .foot { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 34px;
      font-family: -apple-system, Segoe UI, Roboto, sans-serif; font-size: 12px; color: #5b6b86; }
    .foot .line { border-top: 1px solid #0A1F44; padding-top: 6px; min-width: 200px; }
    .est { font-size: 11px; color: #8a97ad; margin-top: 22px;
      font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
  </style></head><body>
  <div class="cert">
    <div class="brand">IQMaxxer</div>
    <div class="title">Certificate of Cognitive Assessment</div>
    <div class="sub">This certifies that the individual below completed the IQMaxxer assessment</div>
    <div class="name">${name || 'Verified Test-Taker'}</div>
    <div class="iq-label">Estimated IQ Score</div>
    <div class="iq">${iq}</div>
    <div class="pct">Scored higher than ${percentile}% of test-takers</div>
    <div class="foot">
      <div class="line">${dateStr}<br/>Date of assessment</div>
      <div class="line">${verificationId}<br/>Verification ID</div>
    </div>
    <div class="est">Estimated score for entertainment and self-insight; not a clinical diagnosis.</div>
  </div>
  </body></html>`;
}

export default function Certificate({ iq, percentile, sessionId, name }) {
  const dateStr = fmtDate();
  const verificationId = sessionId ? `IQX-${sessionId}` : 'IQX-PREVIEW';

  const handleDownload = () => {
    const html = certificateMarkup({ iq, percentile, dateStr, verificationId, name });
    const w = window.open('', '_blank', 'width=1024,height=720');
    if (!w) return; // popup blocked
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    // Give the new document a tick to lay out before invoking print.
    setTimeout(() => w.print(), 300);
  };

  return (
    <div
      style={{
        border: '2px solid var(--ink)',
        outline: '1px solid var(--signal)',
        outlineOffset: 4,
        borderRadius: 6,
        padding: '26px 22px',
        textAlign: 'center',
        background: '#fff',
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: '0.22em',
          fontSize: 11,
          textTransform: 'uppercase',
          color: 'var(--signal)',
          fontWeight: 700,
        }}
      >
        IQMaxxer
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, margin: '8px 0 2px', color: 'var(--ink)' }}>
        Certificate of Cognitive Assessment
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 14 }}>
        {name || 'Verified Test-Taker'}
      </div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)' }}>
        ESTIMATED IQ
      </div>
      <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: 'var(--ink)' }}>{iq}</div>
      <div style={{ fontSize: 13, color: 'var(--slate)', margin: '6px 0 16px' }}>
        Higher than {percentile}% of test-takers · {dateStr}
      </div>
      <button className="btn btn-signal" style={{ width: '100%' }} onClick={handleDownload}>
        Download certificate <span className="arrow">→</span>
      </button>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8 }}>
        Verification ID: {verificationId}
      </div>
    </div>
  );
}
