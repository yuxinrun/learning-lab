"use client";

import { Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";

export function ToolHeader({ title, description, onAdd, addLabel = "新增", exportFilename, exportRows }: {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  exportFilename?: string;
  exportRows?: readonly object[];
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {exportFilename && (
          <Button variant="outline" size="sm" disabled={!exportRows?.length} onClick={() => exportRows && downloadFile(exportFilename, JSON.stringify(exportRows, null, 2), "application/json")}>
            <Download className="h-3.5 w-3.5" />导出 JSON
          </Button>
        )}
        {onAdd && (
          <Button size="sm" onClick={onAdd}><Plus className="h-3.5 w-3.5" />{addLabel}</Button>
        )}
      </div>
    </div>
  );
}

export function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label={label} className="text-muted-foreground hover:text-destructive">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function ToolEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/40 px-6 py-16 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
