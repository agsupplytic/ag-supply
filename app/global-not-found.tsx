import { RootShell } from "@/components/site/root-shell";
import { NotFoundView } from "@/components/pages/status";
import { rootMetadata } from "@/lib/seo";

// 404 global (rutas que no existen en ningún idioma): se genera como 404.html.
export const metadata = rootMetadata("es");

export default function GlobalNotFound() {
  return (
    <RootShell lang="es">
      <NotFoundView lang="es" />
    </RootShell>
  );
}
