import { PlantPage, plantMetadata } from "@/components/pages/plant";

export const metadata = plantMetadata("en");

export default function Page() {
  return <PlantPage lang="en" />;
}
