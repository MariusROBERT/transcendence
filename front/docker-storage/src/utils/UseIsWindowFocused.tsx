import { useState, useEffect } from 'react';

export function useIsWindowFocused(): boolean {
  const [windowIsActive, setWindowIsActive] = useState(true);
  const _ = require('lodash.debounce');

  useEffect(() => {
    function handleActivity() {
      _(
        (e: { type: string }) => {
          if (e?.type === 'focus') {
            return setWindowIsActive(true);
          }
          if (e?.type === 'blur') {
            return setWindowIsActive(false);
          }
          if (e?.type === 'visibilitychange') {
            if (document.hidden) {
              return setWindowIsActive(false);
            } else {
              return setWindowIsActive(true);
            }
          }
        },
        100,
        { leading: false },
      );
    }

    document.addEventListener('visibilitychange', handleActivity);
    document.addEventListener('blur', handleActivity);
    window.addEventListener('blur', handleActivity);
    window.addEventListener('focus', handleActivity);
    document.addEventListener('focus', handleActivity);

    return () => {
      window.removeEventListener('blur', handleActivity);
      document.removeEventListener('blur', handleActivity);
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('focus', handleActivity);
      document.removeEventListener('visibilitychange', handleActivity);
    };
  }, [_]);

  return windowIsActive;
}