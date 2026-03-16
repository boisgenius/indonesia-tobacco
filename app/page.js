'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
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
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background: #000;
        }
        
        .title {
          font-size: clamp(3.5rem, 12vw, 10rem);
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: -0.03em;
          line-height: 0.95;
          text-transform: uppercase;
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
          width: 280px;
          padding: 0.9rem 1.2rem;
          font-size: 0.85rem;
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
          font-size: 0.85rem;
          font-weight: 500;
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
        
        .footer-line {
          position: absolute;
          bottom: 60px;
          left: 40px;
          right: 40px;
          height: 1px;
          background: #333;
        }
        
        .footer {
          position: absolute;
          bottom: 20px;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-text {
          font-size: 0.8rem;
          font-weight: 400;
          color: #FFF;
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-link {
          font-size: 0.8rem;
          font-weight: 400;
          color: #FFF;
          text-decoration: underline;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .footer {
            left: 20px;
            right: 20px;
          }
          .footer-line {
            left: 20px;
            right: 20px;
          }
        }
      `}</style>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px',
        paddingBottom: '120px',
      }}>
        <h1 className="title">
          INDONESIA<br/>
          TOBACCO.
        </h1>
        
        <p style={{
          fontSize: '1rem',
          fontWeight: 400,
          color: '#666',
          marginTop: '2rem',
          maxWidth: '400px',
        }}>
          Your gateway to premium Indonesian tobacco network. Direct access to the finest manufacturers.
        </p>

        {/* Email Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
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
      </div>

      {/* Footer Line */}
      <div className="footer-line" />
      
      {/* Footer */}
      <div className="footer">
        <span className="footer-text">Indonesia Tobacco</span>
        <div className="footer-links">
          <span className="footer-link">Home</span>
          <a href="/blog/geo-case-study-filter-rod" className="footer-link" style={{ textDecoration: 'underline' }}>Blog</a>
          <span
            className="footer-link"
            onClick={() => setShowContact(!showContact)}
          >
            {showContact ? 'marketing@indonesiatobacco.com' : 'Contact'}
          </span>
        </div>
      </div>
    </div>
  );
}
