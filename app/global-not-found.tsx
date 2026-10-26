import { RootShell } from "@/components/site/root-shell";
import { NotFoundView } from "@/components/pages/status";
import { rootMetadata } from "@/lib/seo";

// 404 global (rutas que no existen en ningún idioma): se genera como 404.html.
export const metadata = {
  ...rootMetadata("es"),
  title: { absolute: "Página no encontrada — AG Supply" },
  description: "La página que busca no existe o cambió de dirección. Vuelva al inicio o consulte el catálogo de AG Supply en Santiago, República Dominicana.",
};

export default function GlobalNotFound() {
  return (
    <RootShell lang="es">
      <NotFoundView lang="es" />
    </RootShell>
  );
}
