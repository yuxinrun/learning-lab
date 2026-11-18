import Link from "next/link";
import { AlertTriangle, BookOpenCheck, FlaskConical, Lightbulb } from "lucide-react";
import { ScienceDiagram } from "@/components/diagrams/science-diagrams";
import { cn, slugify } from "@/lib/utils";

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

function Anchored({
  as: Tag,
  children,
}: {
  as: "h2" | "h3";
  children?: React.ReactNode;
}) {
  const id = slugify(textOf(children));
  return (
    <Tag id={id}>
      {children}
      <a href={`#${id}`} aria-label="链接到此标题" className="ml-2 text-primary/40 no-underline opacity-0 transition-opacity hover:opacity-100">
        #
      </a>
    </Tag>
  );
}

const calloutStyles = {
  research: {
    icon: FlaskConical,
    label: "研究依据",
    className: "border-primary/30 bg-primary-soft/50",
  },
  note: {
    icon: Lightbulb,
    label: "要点",
    className: "border-olive bg-surface",
  },
  caution: {
    icon: AlertTriangle,
    label: "证据边界",
    className: "border-sand bg-surface",
  },
  practice: {
    icon: BookOpenCheck,
    label: "实践建议",
    className: "border-mist bg-surface",
  },
} as const;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: React.ReactNode;
}) {
  const style = calloutStyles[type];
  const Icon = style.icon;
  return (
    <aside className={cn("my-8 rounded-md border-l-2 px-5 py-4", style.className)}>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">
        <Icon className="h-4 w-4 text-primary" />
        {title ?? style.label}
      </p>
      <div className="text-[15px] leading-[1.8] text-foreground/80 [&>p]:m-0 [&>p+p]:mt-2">{children}</div>
    </aside>
  );
}

export function KeyPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-md border border-primary/25 bg-primary-soft/30 p-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">关键结论</p>
      <div className="font-serif text-[18px] leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Anchored as="h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Anchored as="h3" {...props} />,
  Callout,
  KeyPoint,
  Diagram: ({ name, caption }: { name: string; caption?: string }) => (
    <figure className="my-9 rounded-lg border border-border bg-card p-4 md:p-6">
      <ScienceDiagram name={name} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
  a: ({ href = "", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href.startsWith("/")) {
      return <Link href={href} {...props}>{children}</Link>;
    }
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};
