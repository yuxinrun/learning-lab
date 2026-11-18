import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  eyebrow,
  title,
  englishTitle,
  description,
  crumbs,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  englishTitle?: string;
  description?: string;
  crumbs?: Crumb[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-border bg-surface/40", className)}>
      <div className="container py-12 md:py-16">
        {crumbs && (
          <nav aria-label="面包屑" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {c.href ? <Link href={c.href} className="hover:text-primary">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-serif text-[38px] font-semibold leading-tight tracking-tight md:text-[50px]">{title}</h1>
        {englishTitle && <p className="mt-2 font-serif text-lg italic text-muted-foreground">{englishTitle}</p>}
        {description && <p className="mt-5 max-w-2xl text-[16px] leading-[1.85] text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
}
