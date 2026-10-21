import { ContactPage, contactMetadata } from "@/components/pages/contact";

export const metadata = contactMetadata("en");

export default function Page() {
  return <ContactPage lang="en" />;
}
