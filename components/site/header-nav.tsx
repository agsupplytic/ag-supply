"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { CategoryIcon } from "./category-icon";
import { QuoteButton } from "./quote-button";
import { WhatsAppButton } from "./whatsapp-button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Cat = {
  slug: string;
  name: string;
  icon: string;
  count: number;
  short: string;
  placeholder: string | null;
};

type Labels = {
  home: string;
  about: string;
  products: string;
  contact: string;
  fullCatalog: string;
  whatsapp: string;
};

export function HeaderNav({
  categories,
  labels,
}: {
  categories: Cat[];
  labels: Labels;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV = [
    { href: "/", label: labels.home },
    { href: "/nosotros", label: labels.about },
    { href: "/productos", label: labels.products, mega: true },
    { href: "/faq", label: "FAQ" },
    { href: "/contacto", label: labels.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-border shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="AG Supply — Inicio">
          <Logo priority height={30} />
        </Link>

        {/* desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.mega ? (
              <div
                key={item.href}
                className="static"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 font-heading text-sm font-semibold transition-colors",
                    isActive(item.href)
                      ? "text-brand-blue"
                      : "text-ink hover:text-brand-blue",
                  )}
                  aria-expanded={megaOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      megaOpen && "rotate-180",
                    )}
                  />
                </Link>

                {megaOpen && (
                  <div className="absolute inset-x-0 top-full">
                    <div className="mx-auto max-w-6xl px-6 pt-3 lg:px-8">
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-2xl">
                        <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                          {/* categories */}
                          <div>
                            <p className="mb-3 font-heading text-sm font-semibold text-muted">
                              {labels.products}
                            </p>
                            <div className="grid grid-cols-2 gap-1">
                              {categories.map((c) => (
                                <Link
                                  key={c.slug}
                                  href={`/productos/${c.slug}`}
                                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-brand-blue-50"
                                >
                                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                                    <CategoryIcon
                                      name={c.icon}
                                      className="size-5"
                                    />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block font-heading text-sm font-semibold text-ink">
                                      {c.name}
                                    </span>
                                    <span className="block truncate text-xs text-muted">
                                      {c.count}{" "}
                                      {c.count === 1 ? "producto" : "productos"}
                                    </span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* brands + CTA */}
                          <div className="flex flex-col gap-3 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                            <p className="font-heading text-sm font-semibold text-muted">
                              Marcas propias
                            </p>
                            {[
                              {
                                name: "Ocean Breeze",
                                tag: "Premium · HORECA",
                                href: "/ocean-breeze",
                                img: "/images/placeholders/brand-ocean-breeze.webp",
                              },
                              {
                                name: "Bonche",
                                tag: "Económica · Masivo",
                                href: "/bonche",
                                img: "/images/placeholders/brand-bonche.webp",
                              },
                            ].map((b) => (
                              <Link
                                key={b.href}
                                href={b.href}
                                className="group flex items-center gap-3 rounded-xl border border-border p-2.5 transition-colors hover:bg-brand-blue-50"
                              >
                                <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                                  <Image
                                    src={b.img}
                                    alt=""
                                    width={64}
                                    height={40}
                                    className="max-h-9 w-auto object-contain p-0.5"
                                  />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-heading text-sm font-bold text-ink">
                                    {b.name}
                                  </span>
                                  <span className="block text-[0.7rem] text-muted">
                                    {b.tag}
                                  </span>
                                </span>
                              </Link>
                            ))}
                            <Link
                              href="/productos"
                              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
                            >
                              {labels.fullCatalog}
                              <ArrowRight className="size-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 font-heading text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "text-brand-blue"
                    : "text-ink hover:text-brand-blue",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <QuoteButton />
          <span className="hidden lg:block">
            <WhatsAppButton size="sm">{labels.whatsapp}</WhatsAppButton>
          </span>

          {/* mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-surface lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex h-16 items-center border-b border-border px-5">
                <Logo height={26} />
              </div>
              <nav className="flex flex-col gap-1 overflow-y-auto p-4">
                {NAV.filter((n) => !n.mega).map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-3 font-heading font-semibold text-ink hover:bg-brand-blue-50"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <p className="px-3 pb-1 pt-4 font-heading text-sm font-semibold text-muted">
                  {labels.products}
                </p>
                {categories.map((c) => (
                  <SheetClose asChild key={c.slug}>
                    <Link
                      href={`/productos/${c.slug}`}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-body hover:bg-brand-blue-50"
                    >
                      <CategoryIcon
                        name={c.icon}
                        className="size-4 text-brand-blue"
                      />
                      {c.name}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/productos"
                    className="mt-1 rounded-md bg-surface px-3 py-2.5 text-center font-heading text-sm font-semibold text-brand-blue-dark"
                  >
                    {labels.fullCatalog}
                  </Link>
                </SheetClose>
                <div className="mt-4">
                  <WhatsAppButton className="w-full" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
