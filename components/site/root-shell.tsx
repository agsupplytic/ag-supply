import "@/app/globals.css";
import { fontClassNames } from "@/lib/fonts";
import { HTML_LANG, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { WhatsAppFab } from "./whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd, WebSiteJsonLd } from "./json-ld";

/** Raíz de cada idioma: <html lang>, tipografías, cabecera, pie y avisos. */
export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG[lang]} className={fontClassNames}>
      <body>
        <OrganizationJsonLd lang={lang} />
        <WebSiteJsonLd lang={lang} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
        >
          {ui(lang).skip}
        </a>
        <SiteHeader lang={lang} />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter lang={lang} />
        <WhatsAppFab lang={lang} />
        <Toaster />
      </body>
    </html>
  );
}
