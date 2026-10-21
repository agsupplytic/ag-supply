"use client";

import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = ui(lang).notFound;
  return (
    <Container className="py-20 md:py-28">
      <p className="label text-brand-red-dark">{t.code}</p>
      <h1 className="mt-3 max-w-2xl">{t.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-body">{t.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={href(lang, { name: "products" })}>{t.search}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={href(lang, { name: "home" })}>{t.home}</Link>
        </Button>
      </div>
    </Container>
  );
}

export function ErrorView({ lang, reset }: { lang: Lang; reset: () => void }) {
  const t = ui(lang).error;
  return (
    <Container className="py-20 md:py-28">
      <p className="label text-brand-red-dark">{t.code}</p>
      <h1 className="mt-3 max-w-2xl">{t.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-body">{t.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>{t.retry}</Button>
        <Button asChild variant="outline" size="lg">
          <Link href={href(lang, { name: "contact" })}>{t.contact}</Link>
        </Button>
      </div>
    </Container>
  );
}
