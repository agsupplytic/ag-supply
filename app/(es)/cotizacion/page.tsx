import { QuotePage, quoteMetadata } from "@/components/pages/quote";

export const metadata = quoteMetadata("es");

export default function Page() {
  return <QuotePage lang="es" />;
}
