"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { Logo } from "./logo";
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
import { siteConfig } from "@/lib/site-config";

type Cat = { slug: string; name: string; count: number; short: string };
type MenuId = "productos" | "marcas";

const BRANDS = [
  { name: "Ocean Breeze", href: "/ocean-breeze", tag: "Línea para hoteles, restaurantes y cadenas" },
  { name: "Bonche", href: "/bonche", tag: "Línea para consumo masivo y uso cotidiano" },
];

const PLAIN = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/nosotros/planta", label: "Planta" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export function HeaderNav({ categories }: { categories: Cat[] }) {
  const pathname = usePathname();
  // El menú abierto se asocia a la ruta: al navegar deja de contar como abierto.
  const [openState, setOpenState] = useState<{ id: MenuId | null; path: string }>({ id: null, path: pathname });
  const open = openState.path === pathname ? openState.id : null;
  const setOpen = (id: MenuId | null) => setOpenState({ id, path: pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState({ id: null, path: pathname });
    };
    const onClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenState({ id: null, path: pathname });
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, pathname]);

  const isActive = (href: string) =>
    href === "/nosotros"
      ? pathname === "/nosotros" || pathname === "/nosotros/"
      : pathname.startsWith(href);

  const linkCls = (active: boolean) =>
    cn(
      "relative inline-flex h-16 items-center px-3 font-heading text-[0.95rem] font-semibold transition-colors",
      "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-brand-red after:opacity-0",
      active ? "text-brand-blue-dark after:opacity-100" : "text-ink hover:text-brand-blue-dark",
    );

  const toggle = (id: MenuId, label: string, active: boolean) => (
    <button
      type="button"
      className={cn(linkCls(active), "gap-1")}
      aria-expanded={open === id}
      aria-controls={`menu-${id}`}
      onClick={() => setOpen(open === id ? null : id)}
    >
      {label}
      <ChevronDown className={cn("size-4 transition-transform", open === id && "rotate-180")} aria-hidden />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* barra de datos */}
      <div className="hidden bg-navy text-sm text-navy-300 md:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <p>{siteConfig.hours.label}</p>
          <p className="flex items-center gap-5">
            {siteConfig.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5" aria-hidden />
                {p.value}
                <span className="sr-only"> {p.label}</span>
              </a>
            ))}
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a>
          </p>
        </div>
      </div>

      <div ref={barRef} className="relative border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-5 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0" aria-label="AG Supply — Inicio">
            <Logo priority height={36} />
          </Link>

          <nav aria-label="Principal" className="ml-4 hidden items-center lg:flex">
            {toggle("productos", "Productos", pathname.startsWith("/productos"))}
            {toggle("marcas", "Marcas", pathname.startsWith("/ocean-breeze") || pathname.startsWith("/bonche"))}
            {PLAIN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkCls(isActive(item.href))}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <QuoteButton />
            <span className="hidden xl:block">
              <WhatsAppButton size="sm">WhatsApp</WhatsAppButton>
            </span>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="inline-flex size-10 items-center justify-center border border-control-border text-ink hover:bg-surface lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" aria-hidden />
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex h-16 items-center border-b border-border px-5">
                  <Logo height={30} />
                </div>
                <nav aria-label="Móvil" className="flex flex-col overflow-y-auto p-3">
                  <p className="label px-3 pb-1 pt-3 text-muted">Productos</p>
                  {categories.map((c) => (
                    <SheetClose asChild key={c.slug}>
                      <Link href={`/productos/${c.slug}`} className="flex items-baseline justify-between px-3 py-2.5 text-ink hover:bg-surface">
                        {c.name}
                        <span className="text-sm text-muted">{c.count}</span>
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link href="/productos" className="px-3 py-2.5 font-semibold text-brand-blue-dark hover:bg-surface">
                      Catálogo completo
                    </Link>
                  </SheetClose>
                  <p className="label px-3 pb-1 pt-5 text-muted">Marcas</p>
                  {BRANDS.map((b) => (
                    <SheetClose asChild key={b.href}>
                      <Link href={b.href} className="px-3 py-2.5 text-ink hover:bg-surface">{b.name}</Link>
                    </SheetClose>
                  ))}
                  <p className="label px-3 pb-1 pt-5 text-muted">Empresa</p>
                  {PLAIN.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} className="px-3 py-2.5 text-ink hover:bg-surface">{item.label}</Link>
                    </SheetClose>
                  ))}
                  <div className="mt-5 px-3">
                    <WhatsAppButton className="w-full" />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* paneles de menú (escritorio) */}
        {open === "productos" && (
          <div id="menu-productos" className="absolute inset-x-0 top-full hidden border-b border-border bg-white shadow-menu lg:block">
            <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto] gap-10 px-8 py-6">
              <ul className="grid grid-cols-2 gap-x-8">
                {categories.map((c) => (
                  <li key={c.slug} className="border-b border-border">
                    <Link href={`/productos/${c.slug}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-brand-blue-dark">
                      <span className="font-heading font-semibold text-ink">{c.name}</span>
                      <span className="text-sm text-muted">{c.count} {c.count === 1 ? "producto" : "productos"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex w-60 flex-col justify-between border-l border-border pl-8">
                <p className="text-sm text-body">Filtre por categoría, marca o presentación y arme su lista de cotización.</p>
                <Link href="/productos" className="mt-4 inline-flex min-h-10 items-center justify-center bg-brand-blue px-4 py-2 text-center font-heading font-semibold text-white hover:bg-brand-blue-dark">
                  Ver catálogo completo
                </Link>
              </div>
            </div>
          </div>
        )}
        {open === "marcas" && (
          <div id="menu-marcas" className="absolute inset-x-0 top-full hidden border-b border-border bg-white shadow-menu lg:block">
            <ul className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-8 px-8 py-6">
              {BRANDS.map((b) => (
                <li key={b.href} className="border-b border-border">
                  <Link href={b.href} className="block py-3 hover:text-brand-blue-dark">
                    <span className="block font-heading text-lg font-semibold text-ink">{b.name}</span>
                    <span className="block text-sm text-muted">{b.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
