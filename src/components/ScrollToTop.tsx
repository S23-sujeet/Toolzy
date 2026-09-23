import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** React Router doesn't reset scroll position on navigation - without this, clicking a
 * link (e.g. from the footer) opens the new page still scrolled to wherever the previous
 * page was. Hash links (e.g. `/#tools`) are left alone so anchor scrolling still works. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
