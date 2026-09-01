"use client";

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

/** Floating action button, mobile-first (hidden on lg where the header CTA shows). */
export function WhatsAppFab() {
  return (
    <a
      href={waLink(siteConfig.whatsapp.genericMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-[color:var(--color-whatsapp-ink)] shadow-lg ring-4 ring-whatsapp/30 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:bg-whatsapp-hover lg:hidden",
      )}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
