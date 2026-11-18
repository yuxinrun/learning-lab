import { FileSearch } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
      <FileSearch className="mb-4 h-7 w-7 text-muted-foreground" />
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}
