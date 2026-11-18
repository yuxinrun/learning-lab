import { getAllArticles } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const escape = (s: string) => s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c] ?? c));

export function GET() {
  const base = siteConfig.url.replace(/\/$/, "");
  const items = getAllArticles().slice(0, 20).map((a) => `
    <item>
      <title>${escape(a.title)}</title>
      <link>${base}/${a.category}/${a.slug}</link>
      <guid isPermaLink="true">${base}/${a.category}/${a.slug}</guid>
      <description>${escape(a.description)}</description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <category>${escape(a.category)}</category>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${escape(siteConfig.name)}</title>
  <link>${base}</link>
  <description>${escape(siteConfig.description)}</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
