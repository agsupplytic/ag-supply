"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./icons";
import { waLink } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import type { Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  lang,
  message,
  children,
  size = "md",
  className,
}: {
  lang: Lang;
  message?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Button asChild variant="whatsapp" size={size} className={className}>
      <a href={waLink(message ?? textFor(lang).whatsapp.genericMessage)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="size-[1.1em]" />
        {children ?? ui(lang).quoteWhatsapp}
      </a>
    </Button>
  );
}

/**
 * Botón flotante, solo móvil (en escritorio ya está el de la cabecera). Se oculta mientras
 * se ve la primera sección, que casi siempre trae su propio botón de WhatsApp.
 */
export function WhatsAppFab({ lang }: { lang: Lang }) {
  const [pastHero, setPastHero] = useState(false);
  const t = ui(lang);

  useEffect(() => {
    const hero = document.querySelector("main section");
    if (!hero || typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setPastHero(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "-45% 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <aside aria-label={t.whatsappFab} className="lg:hidden">
      <a
        href={waLink(textFor(lang).whatsapp.genericMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsappFabLabel}
        aria-hidden={!pastHero}
        tabIndex={pastHero ? undefined : -1}
        className={cn(
          "fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-xl bg-whatsapp text-[color:var(--color-whatsapp-ink)] shadow-md transition-opacity duration-200 hover:bg-whatsapp-hover",
          pastHero ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </aside>
  );
}
