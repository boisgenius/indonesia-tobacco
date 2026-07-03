'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background: #000;
          font-family: Arial, Helvetica, sans-serif;
        }

        .page-shell {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        .hero {
          min-height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 40px;
          padding-bottom: 120px;
        }
        
        .title {
          font-size: 9.5rem;
          font-weight: 900;
          color: #FFFFFF;
          font-family: Arial, Helvetica, sans-serif;
          letter-spacing: 0;
          line-height: 0.95;
          text-transform: uppercase;
        }

        .lead {
          font-size: 1.05rem;
          line-height: 1.35;
          font-weight: 500;
          color: #6f6f6f;
          margin-top: 2rem;
          max-width: 460px;
        }

        .form {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          max-width: 520px;
        }
        
        .input-wrapper {
          position: relative;
          padding: 2px;
          border-radius: 12px;
          background: conic-gradient(
            from 180deg,
            #00F0FF,
            #5B7FFF,
            #A855F7,
            #F472B6,
            #FF6B6B,
            #FFA500,
            #FFD93D,
            #6BCB77,
            #00F0FF
          );
          animation: borderGlow 3s linear infinite;
        }
        
        @keyframes borderGlow {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
          100% { filter: brightness(1); }
        }
        
        .input {
          width: 300px;
          padding: 0.9rem 1.2rem;
          font-size: 0.95rem;
          font-weight: 400;
          background: #000;
          border: none;
          border-radius: 10px;
          color: #FFFFFF;
          outline: none;
        }
        
        .input::placeholder {
          color: #666;
        }
        
        .button {
          padding: 0.9rem 1.8rem;
          font-size: 0.95rem;
          font-weight: 700;
          background: #FFF;
          color: #000;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .button:hover {
          background: #E0E0E0;
        }
        
        .button:disabled {
          background: #666;
          cursor: not-allowed;
        }
        
        .success-box {
          padding: 2px;
          border-radius: 12px;
          background: conic-gradient(
            from 180deg,
            #00F0FF,
            #5B7FFF,
            #A855F7,
            #F472B6,
            #FF6B6B,
            #FFA500,
            #FFD93D,
            #6BCB77,
            #00F0FF
          );
          animation: successPulse 2s ease-in-out infinite;
        }
        
        @keyframes successPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.3); }
        }
        
        .success-inner {
          background: #000;
          border-radius: 10px;
          padding: 1rem 2rem;
          text-align: center;
        }
        
        .success-text {
          font-size: 1rem;
          font-weight: 500;
          color: #FFF;
        }
        
        .error-text {
          font-size: 0.85rem;
          color: #FF6B6B;
          margin-top: 0.5rem;
        }

        .featured-client {
          margin-top: 1.25rem;
          color: #818181;
          font-size: 0.95rem;
          line-height: 1.4;
          max-width: 520px;
        }

        .featured-client a {
          color: #fff;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .client-section {
          border-top: 1px solid #2e2e2e;
          padding: 72px 40px 120px;
        }

        .client-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.65fr);
          gap: 48px;
          align-items: start;
          max-width: 1180px;
        }

        .eyebrow {
          color: #8a8a8a;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .section-title {
          color: #fff;
          font-size: 3.15rem;
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
          max-width: 760px;
          white-space: nowrap;
        }

        .section-copy {
          color: #a7a7a7;
          font-size: 1.05rem;
          line-height: 1.55;
          max-width: 700px;
          margin-top: 1.25rem;
        }

        .client-proof {
          display: block;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 24px;
          background: #050505;
          color: inherit;
          cursor: pointer;
          text-decoration: none;
        }

        .client-proof-label {
          color: #777;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .client-proof-title {
          color: #fff;
          font-size: 1.55rem;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: 0;
          margin-bottom: 1rem;
        }

        .client-proof-copy {
          color: #adadad;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .client-proof-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 8px;
          background: #fff;
          color: #000;
          font-size: 0.92rem;
          font-weight: 800;
          text-decoration: none;
        }

        .client-proof-link:hover {
          background: #e7e7e7;
        }

        .client-proof-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .client-proof-secondary {
          display: inline-flex;
          color: #8a8a8a;
          font-size: 0.78rem;
          line-height: 1.4;
          text-decoration: none;
          border-bottom: 1px dashed #555;
        }

        .client-proof-secondary:hover {
          color: #fff;
          border-bottom-color: #fff;
        }
        
        @media (max-width: 768px) {
          .hero {
            min-height: calc(100vh - 60px);
            padding: 28px 36px 96px 20px;
          }

          .title {
            font-size: 3.65rem;
          }

          .lead {
            font-size: 1rem;
            max-width: 330px;
          }

          .form {
            flex-direction: column;
            align-items: stretch;
            max-width: min(320px, calc(100vw - 56px));
          }

          .featured-client {
            max-width: min(320px, calc(100vw - 56px));
            font-size: 0.9rem;
          }

          .input-wrapper,
          .input,
          .button {
            width: 100%;
            max-width: 100%;
          }

          .client-section {
            padding: 52px 20px 96px;
          }

          .client-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .section-title {
            font-size: 2.55rem;
            white-space: normal;
          }

          .client-proof-actions {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (min-width: 769px) and (max-width: 1100px) {
          .title {
            font-size: 7rem;
          }

          .section-title {
            font-size: 2.75rem;
          }
        }

        @media (max-width: 380px) {
          .title {
            font-size: 3.25rem;
          }
        }
      `}</style>

      <section className="hero">
        <h1 className="title">
          INDONESIA<br/>
          TOBACCO.
        </h1>
        
        <p className="lead">
          Your gateway to premium Indonesian tobacco manufacturers, filter rod suppliers, and export-ready production partners.
        </p>

        {/* Email Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form">
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Request Access'}
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        ) : (
          <div className="success-box" style={{ marginTop: '2rem' }}>
            <div className="success-inner">
              <p className="success-text">✓ Thank you. We'll be in touch.</p>
            </div>
          </div>
        )}

      </section>

      <section className="client-section">
        <div className="client-grid">
          <div>
            <p className="eyebrow">Customer Profile</p>
            <h2 className="section-title">
              We serve companies.
            </h2>
            <p className="section-copy">
              Indonesia Tobacco is built for tobacco manufacturers, filter rod producers, exporters, and factory-side suppliers that need qualified B2B access.
            </p>
          </div>

          <aside
            className="client-proof"
            aria-label="About Indonesia Tobacco"
            role="link"
            tabIndex={0}
            onClick={() => {
              window.location.href = '/about-us.html';
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                window.location.href = '/about-us.html';
              }
            }}
          >
            <p className="client-proof-label">Company Profile</p>
            <h3 className="client-proof-title">About Indonesia Tobacco</h3>
            <p className="client-proof-copy">
              Learn how Indonesia Tobacco presents Indonesian tobacco manufacturers, filter rod suppliers, and export-ready production partners for qualified buyer discovery.
            </p>
            <div className="client-proof-actions">
              <a
                className="client-proof-link"
                href="/about-us.html"
                onClick={(event) => event.stopPropagation()}
              >
                About Us
              </a>
              <a
                className="client-proof-secondary"
                href="https://www.itsfilterrod.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                Visit partner example site
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
