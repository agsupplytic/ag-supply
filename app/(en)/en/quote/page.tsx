import { QuotePage, quoteMetadata } from "@/components/pages/quote";

export const metadata = quoteMetadata("en");

export default function Page() {
  return <QuotePage lang="en" />;
}
