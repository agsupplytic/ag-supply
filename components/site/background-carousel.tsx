"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRealImage } from "@/lib/real-images";

/**
 * Cross-fading image background for a section (hero, CTA bands). Sits behind the
 * content with a brand gradient overlay for text contrast. While placeholders
 * are in use it shows a small "IMÁGENES DE PRUEBA" badge.
 */
export function BackgroundCarousel({
  images,
  intervalMs = 5000,
  className,
  overlay = "brand",
  note = "Imágenes de prueba",
  isReal = false,
}: {
  images: { src: string; alt: string }[];
  intervalMs?: number;
  className?: string;
  overlay?: "brand" | "dark" | "none";
  note?: string;
  isReal?: boolean;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const allReal = isReal || images.every((im) => isRealImage(im.src));

  useEffect(() => {
    if (images.length < 2 || reduce) return;
    const t = setInterval(
      () => setI((v) => (v + 1) % images.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [images.length, intervalMs, reduce]);

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1 }, scale: { duration: 6, ease: "linear" } }}
          className="absolute inset-0"
        >
          <Image
            src={images[i].src}
            alt={images[i].alt}
            fill
            priority={i === 0}
            draggable={false}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {overlay === "brand" && <div className="absolute inset-0 overlay-brand" />}
      {overlay === "dark" && (
        <div className="absolute inset-0 bg-brand-blue-700/80" />
      )}

      {images.length > 1 && !reduce && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full bg-white transition-all",
                idx === i ? "w-6 opacity-90" : "w-1.5 opacity-40",
              )}
            />
          ))}
        </div>
      )}

      {!allReal && (
        <span className="figure-note">
          <ImageIcon className="size-3" aria-hidden />
          {note}
        </span>
      )}
    </div>
  );
}
