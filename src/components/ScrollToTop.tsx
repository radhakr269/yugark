import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If navigating with an anchor hash (e.g. /#pricing, /#services, /#contact)
      const elementId = hash.replace('#', '');
      let attempts = 0;
      let timerId: ReturnType<typeof setTimeout>;

      const checkAndScroll = () => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 12) {
          attempts += 1;
          timerId = setTimeout(checkAndScroll, 50);
        }
      };

      timerId = setTimeout(checkAndScroll, 30);
      return () => clearTimeout(timerId);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [pathname, hash]);

  return null;
};
