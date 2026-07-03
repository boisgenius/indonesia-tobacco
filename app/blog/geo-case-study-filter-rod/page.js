'use client';

import { useState } from 'react';
import { useThemeTransition, themeTransitionCSS } from '../../components/theme-toggle';

export default function GeoCaseStudy() {
  const [dark, setDark] = useState(false);
  const { toggleRef, toggle } = useThemeTransition(dark, setDark);

  const bg = dark ? '#000' : '#FFFFFF';
  const fg = dark ? '#FFF' : '#111';
  const muted = dark ? '#9ca3af' : '#6b7280';
  const body = dark ? '#d1d5db' : '#374151';
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const codeBg = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const thBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const contactBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
  const linkColor = dark ? '#60a5fa' : '#2563eb';
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

        .blog-article {
          max-width: 780px;
          margin: 0 auto;
          padding: 40px 24px 100px;
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

        .blog-header {
          margin-bottom: 2rem;
        }

        .blog-header h1 {
          font-size: clamp(1.875rem, 5vw, 2.75rem);
          font-weight: 700;
          color: ${fg};
          line-height: 1.3;
          margin-bottom: 1rem;
        }

        .blog-header .description {
          font-size: 1.25rem;
          color: ${muted};
          margin-bottom: 1rem;
        }

        .blog-header .meta {
          font-size: 0.875rem;
          color: ${muted};
        }

        .blog-content {
          line-height: 1.8;
          color: ${body};
        }

        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${fg};
          border-bottom: 1px solid ${border};
          padding-bottom: 0.5rem;
        }

        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: ${fg};
        }

        .blog-content p {
          margin-bottom: 1.25rem;
          color: ${body};
        }

        .blog-content strong {
          font-weight: 700;
          color: ${fg};
        }

        .blog-content ul, .blog-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .blog-content ul { list-style-type: disc; }
        .blog-content ol { list-style-type: decimal; }

        .blog-content li {
          margin-bottom: 0.5rem;
          color: ${body};
        }

        .blog-content a {
          color: ${linkColor};
          text-decoration: none;
        }
        .blog-content a:hover { text-decoration: underline; }

        .blog-content em {
          font-style: italic;
          color: ${muted};
        }

        .blog-content code {
          background-color: ${codeBg};
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: monospace;
        }

        .blog-content hr {
          border: none;
          border-top: 1px solid ${border};
          margin: 2rem 0;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }

        .blog-content th,
        .blog-content td {
          border: 1px solid ${border};
          padding: 0.75rem;
          text-align: left;
        }

        .blog-content th {
          background-color: ${thBg};
          font-weight: 600;
          color: ${fg};
        }

        .blog-content td {
          color: ${body};
        }

        .blog-content blockquote {
          border-left: 4px solid ${border};
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: ${muted};
          font-style: italic;
        }

        .contact-box {
          margin-top: 1rem;
          padding: 1.5rem;
          background-color: ${contactBg};
          border: 1px solid ${border};
          border-radius: 0.5rem;
        }

        .blog-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid ${border};
        }

        @media (max-width: 600px) {
          .blog-article { padding: 24px 16px 80px; }
          .blog-content table { font-size: 0.8rem; }
          .blog-content th, .blog-content td { padding: 0.5rem 0.6rem; }
        }
      `}</style>

      <div className="blog-article">
        <div className="top-bar">
          <a href="/" className="back-link">&larr; Back to Home</a>
          <button ref={toggleRef} className="theme-toggle" onClick={toggle}>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <header className="blog-header">
          <h1>Case Study: How a Niche Indonesian Manufacturer Got Cited by AI Using llms.txt</h1>
          <p className="description">Generative Engine Optimization (GEO) for B2B &mdash; ITS Filter Rod</p>
          <div className="meta">
            <span>Indonesia Tobacco</span>
            <span> &bull; </span>
            <span>March 2026</span>
            <span> &bull; </span>
            <span>8 min read</span>
          </div>
        </header>

        <div className="blog-content">
          <hr />

          <h2>The Challenge</h2>
          <p>
            PT. Indonesian Tobacco Special Filter Rod (ITSFR) is a cigarette filter rod manufacturer based in Batam, Indonesia, serving B2B clients across Asia-Pacific. Despite offering competitive pricing, fast delivery, and a wide product range, the company had zero visibility in AI-powered search tools like ChatGPT, Claude, Perplexity, and Google AI Overviews.
          </p>
          <p>
            When potential buyers asked AI assistants questions like &ldquo;where to buy capsule filter rods in bulk&rdquo; or &ldquo;best filter rod manufacturer in Southeast Asia,&rdquo; ITSFR never appeared in the responses &mdash; even though they were a strong match for exactly those queries.
          </p>
          <p>
            <strong>Core problem:</strong> Traditional SEO targets Google&rsquo;s search crawler. But a growing share of B2B research now happens through AI assistants, which have different content discovery mechanisms that most manufacturers aren&rsquo;t optimizing for.
          </p>

          <hr />

          <h2>The Strategy</h2>

          <h3>What is GEO?</h3>
          <p>
            Generative Engine Optimization (GEO) is the practice of optimizing content so that AI language models &mdash; not just traditional search engines &mdash; can discover, understand, and cite your business when answering user queries.
          </p>

          <h3>Implementation: llms.txt Standard</h3>
          <p>
            We adopted the emerging <strong>llms.txt standard</strong> &mdash; a lightweight Markdown file hosted at the website root that serves as a machine-readable index of the business, purpose-built for AI agent consumption. Think of it as <code>robots.txt</code> for LLMs.
          </p>

          <h3>What We Built</h3>

          <p><strong>1. llms.txt &mdash; AI Index File</strong></p>
          <p>A concise summary with structured links to key pages. Designed for AI agents to quickly determine relevance during inference.</p>
          <ul>
            <li>Company identity and core value proposition in the first 100 tokens</li>
            <li>Product catalog with direct URLs and one-line descriptions</li>
            <li>Revenue-driving products (Mono Acetate, Capsule) prioritized as &ldquo;Core Products&rdquo;</li>
            <li>Secondary products retained for keyword coverage but deprioritized</li>
          </ul>

          <p><strong>2. llms-full.txt &mdash; Complete AI Context File</strong></p>
          <p>Full product details, specifications, competitive positioning, and FAQ &mdash; all in a single Markdown file optimized for LLM token efficiency.</p>
          <p>Key optimization techniques:</p>
          <ul>
            <li><strong>Front-loading</strong> &mdash; Most important business info (who, what, where, contact) in the first 500 tokens</li>
            <li><strong>Semantic anchor questions</strong> &mdash; FAQ section written in the exact phrasing users ask AI</li>
            <li><strong>Noise removal</strong> &mdash; Company culture, internal processes, raw material supplier details removed to maximize signal-to-noise ratio</li>
            <li><strong>Usage guidelines</strong> &mdash; Instructions telling AI agents how to attribute and cite ITSFR</li>
            <li><strong>Revenue-weighted structure</strong> &mdash; Profitable product lines given 3x the content depth of secondary products</li>
          </ul>

          <p><strong>3. robots.txt Update</strong></p>
          <p>Added Sitemap pointer to llms.txt to improve discoverability by AI crawlers.</p>

          <hr />

          <h2>Technical Details</h2>
          <table>
            <thead>
              <tr><th>Component</th><th>Detail</th></tr>
            </thead>
            <tbody>
              <tr><td>Website stack</td><td>Next.js on Vercel</td></tr>
              <tr><td>Files deployed</td><td>public/llms.txt, public/llms-full.txt, public/robots.txt</td></tr>
              <tr><td>Deployment method</td><td>Git push &rarr; Vercel auto-deploy</td></tr>
              <tr><td>File format</td><td>Markdown (text/plain, UTF-8)</td></tr>
              <tr><td>Time to implement</td><td>Under 2 hours</td></tr>
              <tr><td>Cost</td><td>$0</td></tr>
              <tr><td>Maintenance</td><td>Update files when products or pricing change</td></tr>
            </tbody>
          </table>

          <hr />

          <h2>Results</h2>
          <p>Data collection in progress &mdash; Results will be updated as AI citation data becomes available.</p>

          <h3>Test Queries to Monitor</h3>
          <p>Ask these questions periodically in ChatGPT, Claude, and Perplexity to track citation progress:</p>
          <ol>
            <li>&ldquo;Where to buy cigarette filter rods in bulk?&rdquo;</li>
            <li>&ldquo;Best capsule filter rod manufacturer in Southeast Asia&rdquo;</li>
            <li>&ldquo;Cigarette filter rod supplier Indonesia&rdquo;</li>
            <li>&ldquo;Who manufactures capsule filter rods with custom flavors?&rdquo;</li>
            <li>&ldquo;Filter rod manufacturer Batam Indonesia&rdquo;</li>
            <li>&ldquo;Compare capsule filter rod suppliers in Asia&rdquo;</li>
            <li>&ldquo;Cheapest filter rod manufacturer with fast delivery&rdquo;</li>
          </ol>

          <hr />

          <h2>Key Takeaways</h2>

          <h3>Why This Works for Niche B2B</h3>
          <ol>
            <li><strong>Low competition</strong> &mdash; Most B2B manufacturers in traditional industries have no AI optimization strategy. Being first in a niche gives outsized visibility.</li>
            <li><strong>High buyer intent</strong> &mdash; B2B buyers asking AI specific procurement questions are deep in the purchase funnel. A single AI citation can drive a container order.</li>
            <li><strong>Zero cost, high leverage</strong> &mdash; Two Markdown files and a git push. No ad spend, no content marketing team, no backlink building.</li>
            <li><strong>Compounding advantage</strong> &mdash; As AI agents index and begin citing ITSFR, the company builds authority that reinforces future citations.</li>
            <li><strong>Language leverage</strong> &mdash; llms-full.txt in English gets picked up by AI agents worldwide, while the website itself serves 8 languages for regional buyers.</li>
          </ol>

          <h3>What Makes llms.txt Different from Traditional SEO</h3>
          <table>
            <thead>
              <tr><th>Traditional SEO</th><th>GEO via llms.txt</th></tr>
            </thead>
            <tbody>
              <tr><td>Optimizes for Google&rsquo;s crawler</td><td>Optimizes for LLM inference</td></tr>
              <tr><td>Keyword density, backlinks, meta tags</td><td>Semantic relevance, token efficiency, structured Markdown</td></tr>
              <tr><td>Results appear in search rankings</td><td>Results appear in AI-generated answers</td></tr>
              <tr><td>Competing with millions of pages</td><td>Competing with far fewer AI-optimized sources</td></tr>
              <tr><td>Months to see results</td><td>Potentially faster &mdash; AI agents re-index frequently</td></tr>
            </tbody>
          </table>

          <hr />

          <h2>How to Replicate This</h2>
          <p>For any B2B business looking to implement GEO:</p>
          <ol>
            <li>Create <code>llms.txt</code> at your website root &mdash; concise company summary + product/service links with descriptions</li>
            <li>Create <code>llms-full.txt</code> &mdash; complete business details in a single Markdown file, front-loaded with the most important information</li>
            <li>Write FAQ in user-query format &mdash; phrase questions exactly how buyers ask AI assistants</li>
            <li>Prioritize revenue drivers &mdash; give your most profitable products/services more content depth</li>
            <li>Remove noise &mdash; cut anything an AI agent doesn&rsquo;t need</li>
            <li>Add usage guidelines &mdash; tell AI agents how to cite your business</li>
            <li>Update <code>robots.txt</code> &mdash; point to your llms.txt</li>
            <li>Deploy and monitor &mdash; track AI citations across major platforms</li>
          </ol>

          <hr />

          <h2>About</h2>
          <p>
            This case study was produced by Indonesia Tobacco &mdash; connecting Indonesian tobacco manufacturers with global buyers, powered by AI-driven market intelligence.
          </p>

          <div className="contact-box">
            <p style={{ marginBottom: '0.5rem' }}><strong>Contact:</strong> <a href="mailto:connect@indonesiatobacco.com">connect@indonesiatobacco.com</a></p>
            <p style={{ marginBottom: 0 }}><strong>Website:</strong> <a href="https://indonesiatobacco.com">indonesiatobacco.com</a></p>
          </div>

          <div className="blog-footer">
            <p><em>First published: March 2026.</em></p>
            <a href="/" className="back-link" style={{ marginTop: '1rem' }}>&larr; Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
