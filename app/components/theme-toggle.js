'use client';

import { useRef, useCallback } from 'react';

export function useThemeTransition(dark, setDark) {
  const toggleRef = useRef(null);

  const toggle = useCallback((e) => {
    const btn = toggleRef.current;
    if (!btn) {
      setDark((d) => !d);
      return;
    }

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setDark((d) => !d);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the max radius needed to cover the entire page
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setDark((d) => !d);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [setDark]);

  return { toggleRef, toggle };
}

export const themeTransitionCSS = `
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }

  ::view-transition-old(root) {
    z-index: 1;
  }

  ::view-transition-new(root) {
    z-index: 9999;
  }
`;
