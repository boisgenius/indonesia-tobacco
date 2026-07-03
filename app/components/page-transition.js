'use client';

import { useEffect, useCallback, useRef } from 'react';

export function PageTransition() {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const handleClick = useCallback((e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('#')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Phase 1: Black overlay fades in
    overlay.style.display = 'block';
    overlay.style.transition = 'none';
    overlay.style.opacity = '0';
    overlay.offsetHeight;
    overlay.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    overlay.style.opacity = '1';

    // Phase 2: Navigate after black screen covers
    setTimeout(() => {
      window.location.href = href;
    }, 450);
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // On page load: reveal new page with expanding rounded rect clip-path (like Yuga)
    content.style.transition = 'none';
    content.style.clipPath = 'inset(8% 8% 8% 8% round 40px)';
    content.style.opacity = '1';
    content.offsetHeight;

    // Expand to full screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.transition = 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1)';
        content.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
      });
    });

    // Hide the black background after reveal completes
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.display = 'block';
      overlay.style.opacity = '1';
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }, 1100);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <>
      <style>{`
        .page-transition-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          z-index: 9998;
          pointer-events: none;
          display: none;
        }

        .page-transition-content {
          position: relative;
          z-index: 9999;
          will-change: clip-path;
        }
      `}</style>

      <div ref={overlayRef} className="page-transition-bg" />
    </>
  );
}

// Wrapper to apply clip-path reveal to page content
export function PageReveal({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start clipped
    el.style.clipPath = 'inset(6% 6% 6% 6% round 30px)';

    el.offsetHeight;

    // Animate to full
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
        el.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
      });
    });
  }, []);

  return (
    <div ref={ref} style={{ willChange: 'clip-path' }}>
      {children}
    </div>
  );
}
