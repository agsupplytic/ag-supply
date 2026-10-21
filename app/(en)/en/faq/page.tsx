import { FaqPage, faqMetadata } from "@/components/pages/faq";

export const metadata = faqMetadata("en");

export default function Page() {
  return <FaqPage lang="en" />;
}
