import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { categories, footerNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
              {siteConfig.name}
            </Link>
            <p className="mt-2 font-serif text-sm italic text-muted-foreground">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              一个基于证据的学习科学知识平台。帮助你理解人类如何学习，并用更可靠的方法构建自己的知识体系。
            </p>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
              {categories.slice(0, 4).map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="text-xs text-muted-foreground hover:text-primary">
                  {c.englishTitle}
                </Link>
              ))}
            </div>
          </div>
          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="section-label mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                      {item.href.endsWith(".xml") && <Rss className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Learning Lab. 内容采用 CC BY-NC-SA 4.0 许可（另有说明除外）。</p>
          <p className="flex items-center gap-1.5">
            Learn Smarter. Grow Further.
            <ArrowUpRight className="h-3 w-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
