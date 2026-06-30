import { useEffect, useRef, useState } from 'react';

// Lightweight count-up that re-animates only on the first mount,
// then snaps to live values afterward (so streaming KPIs don't jitter).
export default function CountUp({ to, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) {
      setVal(to);
      return;
    }
    animated.current = true;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{val.toLocaleString()}</>;
}
