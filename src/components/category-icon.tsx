import {
  BookOpen,
  Brain,
  Compass,
  FlaskConical,
  Layers,
  Network,
  Sprout,
  Target,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  brain: Brain,
  layers: Layers,
  target: Target,
  flask: FlaskConical,
  book: BookOpen,
  compass: Compass,
  network: Network,
  sprout: Sprout,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Brain;
  return <Icon className={className} strokeWidth={1.7} />;
}
