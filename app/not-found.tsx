import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-20 md:py-28">
      <p className="label text-brand-red-dark">Error 404</p>
      <h1 className="mt-3 max-w-2xl">Esta página no existe</h1>
      <p className="mt-4 max-w-xl text-lg text-body">
        El enlace puede estar roto o el producto ya no figura en el catálogo. Pruebe el buscador del
        catálogo o vuelva al inicio.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/productos">Buscar en el catálogo</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </Container>
  );
}
