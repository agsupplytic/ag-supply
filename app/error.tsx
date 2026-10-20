"use client";

import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-20 md:py-28">
      <p className="label text-brand-red-dark">Error</p>
      <h1 className="mt-3 max-w-2xl">No pudimos cargar esta página</h1>
      <p className="mt-4 max-w-xl text-lg text-body">
        Inténtelo de nuevo. Si el problema continúa, escríbanos y lo revisamos.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>Reintentar</Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contacto">Contacto</Link>
        </Button>
      </div>
    </Container>
  );
}
