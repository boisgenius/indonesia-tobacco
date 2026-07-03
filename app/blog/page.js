'use client';

import { useState } from 'react';
import { useThemeTransition, themeTransitionCSS } from '../components/theme-toggle';

const posts = [
  {
    slug: 'geo-case-study-filter-rod',
    title: 'Case Study: How a Niche Indonesian Manufacturer Got Cited by AI Using llms.txt',
    description: 'How we used Generative Engine Optimization (GEO) and the llms.txt standard to get a B2B filter rod manufacturer discovered by ChatGPT, Claude, and Perplexity.',
    tags: ['GEO', 'Case Study'],
    date: '2026-03-15',
    readingTime: '8 min read',
  },
];

export default function BlogPage() {
  const [dark, setDark] = useState(false);
  const { toggleRef, toggle } = useThemeTransition(dark, setDark);

  const bg = dark ? '#000' : '#FFFFFF';
  const fg = dark ? '#FFF' : '#111';
  const muted = dark ? '#9ca3af' : '#6b7280';
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const codeBg = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardHover = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
  const tagBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tagColor = dark ? '#d1d5db' : '#374151';
  const descColor = dark ? '#9ca3af' : '#6b7280';
  const backHover = dark ? '#FFF' : '#000';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: fg, transition: 'background 0.3s, color 0.3s' }}>
      <style>{`
        ${themeTransitionCSS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${bg}; transition: background 0.3s; }

        :root {
          --nav-bg: ${bg} !important;
          --nav-fg: ${fg} !important;
          --nav-line: ${border} !important;
        }

        .blog-listing {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-block;
          font-size: 0.9rem;
          color: ${muted};
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: ${backHover}; }

        .theme-toggle {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          border: 1px solid ${border};
          background: ${codeBg};
          color: ${muted};
          cursor: pointer;
          transition: all 0.2s;
        }
        .theme-toggle:hover {
          color: ${fg};
          border-color: ${muted};
        }

        .blog-listing-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .blog-listing-header h1 {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          line-height: 1;
          color: ${fg};
        }

        .blog-listing-header p {
          font-size: 1.15rem;
          color: ${muted};
          margin-top: 1rem;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .post-card {
          background: ${cardBg};
          border: 1px solid ${cardBorder};
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .post-card:hover {
          border-color: ${cardHover};
          transform: translateY(-2px);
        }

        .post-card-image {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #0a1628 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-bottom: 1px solid ${cardBorder};
        }

        .post-card-image-title {
          font-size: 1rem;
          font-weight: 700;
          color: #FFF;
          letter-spacing: 0.05em;
        }

        .post-card-image-sub {
          font-size: 0.75rem;
          color: #60a5fa;
        }

        .post-card-body {
          padding: 24px;
        }

        .post-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .post-tag {
          font-size: 0.75rem;
          padding: 4px 10px;
          background: ${tagBg};
          border-radius: 4px;
          color: ${tagColor};
        }

        .post-card-body h2 {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 8px;
          color: ${fg};
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-card-body .desc {
          font-size: 0.875rem;
          color: ${descColor};
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          font-size: 0.8rem;
          color: ${muted};
        }

        @media (max-width: 600px) {
          .blog-listing { padding: 40px 16px 80px; }
          .posts-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="blog-listing">
        <div className="top-bar">
          <a href="/" className="back-link">&larr; Back to Home</a>
          <button ref={toggleRef} className="theme-toggle" onClick={toggle}>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="blog-listing-header">
          <h1>Blog</h1>
          <p>Industry insights, case studies, and expert articles</p>
        </div>

        <div className="posts-grid">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="post-card">
              <div className="post-card-image">
                <span className="post-card-image-title">INDONESIA TOBACCO</span>
                <span className="post-card-image-sub">Industry Insights &amp; News</span>
              </div>
              <div className="post-card-body">
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>
                <h2>{post.title}</h2>
                <p className="desc">{post.description}</p>
                <div className="post-meta">
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
