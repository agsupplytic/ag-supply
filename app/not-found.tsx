import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-sm font-semibold text-brand-blue-dark">Error 404</p>
      <h1 className="mt-3">Esta página no existe</h1>
      <p className="mt-4 max-w-md text-body">
        El enlace puede estar roto o el producto ya no está en catálogo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/productos">Ver catálogo</Link>
        </Button>
      </div>
    </Container>
  );
}
