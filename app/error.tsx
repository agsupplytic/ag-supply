"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-sm font-semibold text-brand-blue-dark">Algo salió mal</p>
      <h1 className="mt-3">No pudimos cargar esta página</h1>
      <p className="mt-4 max-w-md text-body">
        Inténtalo de nuevo. Si el problema persiste, escríbenos y lo revisamos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Button asChild variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </Container>
  );
}
