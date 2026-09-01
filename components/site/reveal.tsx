"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade / slide-in on scroll. Fails safe: if IntersectionObserver is missing, the
 * element is already near the viewport on mount, or the observer never fires
 * within 1.2s, the content is shown anyway (never a permanently blank section).
 * prefers-reduced-motion is handled in globals.css.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Already in view on mount (e.g. above-the-fold, or restored scroll).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.1) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    const failsafe = setTimeout(() => setVisible(true), 1200);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={cn(visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
