import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop: Automatically scrolls the window to top (0, 0)
 * whenever the React Router pathname changes (e.g. from / to /shop or /product/:id).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Instant scroll on navigation so user never lands halfway
    });
  }, [pathname]);

  return null;
};
