import { useCallback, useEffect, useState } from 'react';

const KEY = 'isPaid';

// Simulated auth/entitlement state. The real source of truth is the
// backend + Stripe webhook; for now we mirror it in localStorage so the
// gate behaves correctly across reloads. On return from a successful
// Stripe checkout (?paid=1 or /success) we flip the flag.
export function usePaid() {
  const [isPaid, setIsPaid] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Honor a post-checkout success redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === '1' || window.location.pathname === '/success') {
      try {
        localStorage.setItem(KEY, 'true');
      } catch (err) {
        void err;
      }
      setIsPaid(true);
    }
  }, []);

  const unlock = useCallback(() => {
    try {
      localStorage.setItem(KEY, 'true');
    } catch (err) {
      void err;
    }
    setIsPaid(true);
  }, []);

  const lock = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch (err) {
      void err;
    }
    setIsPaid(false);
  }, []);

  return { isPaid, unlock, lock };
}
