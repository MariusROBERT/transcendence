import { useState, useEffect } from 'react';
import { delay } from './UtilityFunctions';

export function useIsWindowFocused(): boolean {
  const [windowIsActive, setWindowIsActive] = useState(true);
  let inFetch = false;

  useEffect(() => {
    async function resetFetch(){
      await delay(100);
      inFetch = false;
    }

    function handleActivity(e: { type: string }) {
      if (inFetch) return;
      inFetch = true;
      resetFetch();
      if (e?.type === 'focus') {
        return setWindowIsActive(true);
      }
      if (e?.type === 'blur') {
        return setWindowIsActive(false);
      }
      if (e?.type === 'visibilitychange') {
        if (document.hidden) {
          return setWindowIsActive(false);
        }
        return setWindowIsActive(true);
      }
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
  }, [inFetch]);

  return windowIsActive;
}