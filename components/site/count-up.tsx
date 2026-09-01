"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `to` once, when it first scrolls into view. Keeps a static
 * prefix/suffix around it (e.g. "400" + " t", "168" + "+"). Fails safe to the
 * final value if IntersectionObserver is missing; shows the final value
 * immediately under prefers-reduced-motion.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  durationMs = 1100,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!el || reduce || typeof IntersectionObserver === "undefined") {
      setN(to);
      return;
    }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / durationMs);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const failsafe = setTimeout(run, 1500);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toLocaleString("es-DO")}
      {suffix}
    </span>
  );
}
