"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock, Mail, Menu, Phone } from "lucide-react";
import { Logo } from "./logo";
import { QuoteButton } from "./quote-button";
import { WhatsAppButton } from "./whatsapp-button";
import { LanguageSwitch } from "./language-switch";
import { CategoryIcon } from "./category-icon";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

type Cat = { slug: string; name: string; icon: string; count: number };
type MenuId = "productos" | "marcas";

export function HeaderNav({ categories, lang }: { categories: Cat[]; lang: Lang }) {
  const t = ui(lang);
  const pathname = usePathname() ?? "/";
  // El menú abierto se asocia a la ruta: al navegar deja de contar como abierto.
  const [openState, setOpenState] = useState<{ id: MenuId | null; path: string }>({ id: null, path: pathname });
  const open = openState.path === pathname ? openState.id : null;
  const setOpen = (id: MenuId | null) => setOpenState({ id, path: pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const BRANDS = [
    { name: "Ocean Breeze", href: href(lang, { name: "oceanBreeze" }), tag: t.nav.brandOcean },
    { name: "Bonche", href: href(lang, { name: "bonche" }), tag: t.nav.brandBonche },
  ];
  const PLAIN = [
    { href: href(lang, { name: "about" }), label: t.nav.about, exact: true },
    { href: href(lang, { name: "plant" }), label: t.nav.plant },
    { href: href(lang, { name: "faq" }), label: t.nav.faqShort },
    { href: href(lang, { name: "contact" }), label: t.nav.contact },
  ];
  const productsHref = href(lang, { name: "products" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState({ id: null, path: pathname });
    };
    const onClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenState({ id: null, path: pathname });
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, pathname]);

  const isActive = (h: string, exact?: boolean) => (exact ? pathname === h : pathname.startsWith(h));
  const brandsActive = BRANDS.some((b) => pathname.startsWith(b.href));

  const linkCls = (active: boolean) =>
    cn(
      "relative inline-flex h-16 items-center whitespace-nowrap px-3 font-heading text-[0.95rem] font-bold transition-colors",
      "after:absolute after:inset-x-3 after:bottom-0 after:h-1 after:rounded-t-sm after:bg-brand-red after:opacity-0",
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

  const tt = textFor(lang);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* barra de datos */}
      <div className="hidden bg-brand-blue-50 text-sm text-body md:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-brand-blue" aria-hidden />
            {tt.hours}
          </p>
          <p className="flex items-center gap-5">
            {siteConfig.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex items-center gap-1.5 hover:text-brand-blue-dark">
                <Phone className="size-3.5 text-brand-blue" aria-hidden />
                {p.value}
                <span className="sr-only"> {p.label}</span>
              </a>
            ))}
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-brand-blue-dark">
              <Mail className="size-3.5 text-brand-blue" aria-hidden />
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>

      <div ref={barRef} className="relative border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-5 sm:px-6 lg:px-8">
          <Link href={href(lang, { name: "home" })} className="shrink-0" aria-label={`AG Supply — ${t.home}`}>
            <Logo priority height={38} />
          </Link>

          <nav aria-label={t.nav.main} className="ml-4 hidden items-center lg:flex">
            {toggle("productos", t.nav.products, pathname.startsWith(productsHref))}
            {toggle("marcas", t.nav.brands, brandsActive)}
            {PLAIN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkCls(isActive(item.href, item.exact))}
                aria-current={isActive(item.href, item.exact) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitch lang={lang} />
            <QuoteButton lang={lang} />
            <span className="hidden xl:block">
              <WhatsAppButton size="sm" lang={lang}>{t.whatsapp}</WhatsAppButton>
            </span>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="inline-flex size-10 items-center justify-center rounded-md border border-control-border text-ink hover:bg-surface lg:hidden"
                aria-label={t.nav.menu}
              >
                <Menu className="size-5" aria-hidden />
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetTitle className="sr-only">{t.nav.menuTitle}</SheetTitle>
                <div className="flex h-16 items-center border-b border-border px-5">
                  <Logo height={32} />
                </div>
                <nav aria-label={t.nav.mobile} className="flex flex-col overflow-y-auto p-3">
                  <p className="label px-3 pb-1 pt-3 text-muted">{t.nav.products}</p>
                  {categories.map((c) => (
                    <SheetClose asChild key={c.slug}>
                      <Link href={href(lang, { name: "category", cat: c.slug })} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-ink hover:bg-brand-blue-50">
                        <CategoryIcon name={c.icon} className="size-5 text-brand-blue" />
                        <span className="flex-1">{c.name}</span>
                        <span className="text-sm text-muted">{c.count}</span>
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link href={productsHref} className="rounded-md px-3 py-2.5 font-bold text-brand-blue-dark hover:bg-brand-blue-50">
                      {t.nav.fullCatalog}
                    </Link>
                  </SheetClose>
                  <p className="label px-3 pb-1 pt-5 text-muted">{t.nav.brands}</p>
                  {BRANDS.map((b) => (
                    <SheetClose asChild key={b.href}>
                      <Link href={b.href} className="rounded-md px-3 py-2.5 text-ink hover:bg-brand-blue-50">{b.name}</Link>
                    </SheetClose>
                  ))}
                  <p className="label px-3 pb-1 pt-5 text-muted">{t.nav.company}</p>
                  {PLAIN.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} className="rounded-md px-3 py-2.5 text-ink hover:bg-brand-blue-50">{item.label}</Link>
                    </SheetClose>
                  ))}
                  <div className="mt-5 px-3">
                    <WhatsAppButton className="w-full" lang={lang} />
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
                    <Link href={href(lang, { name: "category", cat: c.slug })} className="flex items-center gap-3 py-3 hover:text-brand-blue-dark">
                      <CategoryIcon name={c.icon} className="size-5 text-brand-blue" />
                      <span className="flex-1 font-heading font-bold text-ink">{c.name}</span>
                      <span className="text-sm text-muted">{t.count.product(c.count)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex w-60 flex-col justify-between border-l border-border pl-8">
                <p className="text-sm text-body">{t.nav.catalogHint}</p>
                <Link href={productsHref} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-brand-blue px-4 py-2 text-center font-heading font-bold text-white hover:bg-brand-blue-dark">
                  {t.nav.viewCatalog}
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
                    <span className="block font-heading text-lg font-bold text-ink">{b.name}</span>
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
