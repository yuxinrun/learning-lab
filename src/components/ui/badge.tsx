import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft" | "outline" | "muted";
};

export function Badge({ className, variant = "soft", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "soft" && "bg-primary-soft text-foreground",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "muted" && "bg-surface text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
