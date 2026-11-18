import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { Badge } from "@/components/ui/badge";
import { resources, getResource } from "@/content/data/resources";

export const dynamicParams = false;

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: `${resource.name} — 专业资源`,
    description: resource.description,
    alternates: { canonical: `/resources/${slug}` },
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <>
      <PageHeader
        eyebrow={resource.type}
        title={resource.name}
        description={resource.description}
        crumbs={[{ label: "资源导航", href: "/resources" }, { label: resource.name }]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge>{resource.type}</Badge>
          {resource.region && <Badge variant="outline">{resource.region}</Badge>}
          {resource.fields.map((f) => <Badge key={f} variant="muted">{f}</Badge>)}
        </div>
      </PageHeader>

      <div className="container grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-20">
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl font-semibold">资源介绍</h2>
            <p className="mt-4 text-[17px] leading-[1.9] text-foreground/85">{resource.description}</p>
          </section>
          <section className="rounded-lg border-l-2 border-primary bg-primary-soft/40 p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold"><Lightbulb className="h-5 w-5 text-primary" />推荐理由</h2>
            <p className="mt-3 text-[15px] leading-[1.85] text-foreground/80">{resource.why}</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">研究与学习领域</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.fields.map((f) => <Badge key={f} variant="soft">{f}</Badge>)}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-md text-sm font-semibold text-white" style={{ backgroundColor: resource.accent }}>{resource.initials}</span>
            <p className="section-label mt-6 mb-2">官方网站</p>
            <p className="break-all text-xs text-muted-foreground">{resource.url}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              访问官网 <ExternalLink className="h-4 w-4" />
            </a>
            <Link href="/resources" className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              <ArrowUpRight className="h-3 w-3" /> 返回资源导航
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
