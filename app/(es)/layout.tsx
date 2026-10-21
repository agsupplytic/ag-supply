import { RootShell } from "@/components/site/root-shell";
import { rootMetadata } from "@/lib/seo";

export const metadata = rootMetadata("es");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
