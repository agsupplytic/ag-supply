import {
  Disc3,
  Layers,
  Square,
  Rows3,
  Wind,
  SprayCan,
  Utensils,
  Boxes,
  Trash2,
  Package,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Disc3,
  Layers,
  Square,
  Rows3,
  Wind,
  SprayCan,
  Utensils,
  Boxes,
  Trash2,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = MAP[name] ?? Package;
  return <Icon className={className} aria-hidden />;
}
