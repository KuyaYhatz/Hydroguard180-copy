import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Handles two behaviors:
 * 1. Scroll to top on route change (new page)
 * 2. Smooth scroll to anchor targets on same-page hash links
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  // Scroll to top when the pathname changes (new page navigation)
  useEffect(() => {
    if (!hash) {
      // Temporarily disable smooth scroll so page transitions snap to top
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0 });
      // Re-enable smooth scroll after the snap
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = '';
      });
    }
  }, [pathname]);

  // Smooth scroll to hash target
  useEffect(() => {
    if (hash) {
      // Small delay to let the page render first
      const timeout = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [hash, pathname]);

  return null;
}