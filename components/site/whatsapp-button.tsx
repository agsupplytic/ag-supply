"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./icons";
import { siteConfig, waLink } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  message = siteConfig.whatsapp.genericMessage,
  children = "Cotizar por WhatsApp",
  size = "md",
  className,
}: {
  message?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Button asChild variant="whatsapp" size={size} className={className}>
      <a href={waLink(message)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="size-[1.1em]" />
        {children}
      </a>
    </Button>
  );
}

/**
 * Floating action button, mobile-first (hidden on lg where the header CTA shows).
 * Stays hidden while the page hero is in view — most heroes carry their own
 * "Cotizar por WhatsApp" button, so the FAB would just duplicate it and overlap
 * the hero copy on small screens. It fades in once the hero scrolls away.
 */
export function WhatsAppFab() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // First <section> in <main> is the page hero on every route (the JSON-LD
    // components that sometimes sit first render a <script>, not an element box).
    const hero = document.querySelector("main section");
    if (!hero || typeof IntersectionObserver === "undefined") {
      // No hero / no observer support: just show the FAB (next frame, so we
      // never setState synchronously inside the effect body).
      const raf = requestAnimationFrame(() => setPastHero(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-45% 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <aside aria-label="Atención por WhatsApp" className="lg:hidden">
      <a
        href={waLink(siteConfig.whatsapp.genericMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbanos por WhatsApp"
        aria-hidden={!pastHero}
        tabIndex={pastHero ? undefined : -1}
        className={cn(
          "fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-md bg-whatsapp text-[color:var(--color-whatsapp-ink)] transition-opacity duration-200 hover:bg-whatsapp-hover",
          pastHero ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </aside>
  );
}
