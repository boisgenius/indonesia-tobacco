'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about-us.html' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        :root {
          --nav-bg: #000;
          --nav-fg: #FFF;
          --nav-line: #333;
        }

        .bottom-nav-line {
          position: fixed;
          bottom: 52px;
          left: 40px;
          right: 40px;
          height: 1px;
          background: var(--nav-line);
          z-index: 100;
          transition: background 0.3s;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 52px;
          background: var(--nav-bg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          z-index: 100;
          transition: background 0.3s;
        }

        .bottom-nav-brand {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--nav-fg);
          transition: color 0.3s;
        }

        .bottom-nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .bottom-nav-link,
        .bottom-nav-contact {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--nav-fg);
          text-decoration: none;
          opacity: 0.6;
          transition: opacity 0.2s, color 0.3s;
        }

        .bottom-nav-link:hover,
        .bottom-nav-contact:hover {
          opacity: 1;
        }

        .bottom-nav-link.active {
          opacity: 1;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            padding: 0 28px 0 20px;
          }
          .bottom-nav-line {
            left: 20px;
            right: 20px;
          }
          .bottom-nav-brand,
          .bottom-nav-link,
          .bottom-nav-contact {
            font-size: 0.72rem;
          }
          .bottom-nav-links {
            gap: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .bottom-nav-link:not(.active),
          .bottom-nav-contact {
            display: none;
          }
        }
      `}</style>

      <div className="bottom-nav-line" />
      <nav className="bottom-nav">
        <span className="bottom-nav-brand">Indonesia Tobacco</span>
        <div className="bottom-nav-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`bottom-nav-link${pathname === item.href ? ' active' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <a href="mailto:marketing@indonesiatobacco.com" className="bottom-nav-contact">
            Contact
          </a>
        </div>
      </nav>
    </>
  );
}
