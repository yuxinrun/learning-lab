import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader, type MenuLink } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAllArticles } from "@/lib/content";
import { getAllSearchItems } from "@/lib/search";
import { siteConfig, toolsList } from "@/lib/site";
import { resources } from "@/content/data/resources";
import { methods } from "@/content/data/methods";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["学习科学", "记忆", "认知科学", "学习方法", "主动回忆", "间隔重复", "知识管理", "lifelong learning"],
  authors: [{ name: "Learning Lab Editorial" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchItems = getAllSearchItems();
  const menuLinks: Record<string, MenuLink[]> = {};

  for (const a of getAllArticles()) {
    const key = a.category;
    menuLinks[key] ??= [];
    if (menuLinks[key].length < 5) {
      menuLinks[key].push({ label: a.title, href: `/${a.category}/${a.slug}` });
    }
  }
  if (menuLinks["learning-methods"]) {
    menuLinks["learning-methods"] = [
      ...methods.slice(0, 4).map((m) => ({ label: `${m.chineseName} · ${m.name}`, href: `/learning-methods/${m.slug}` })),
      ...menuLinks["learning-methods"].slice(0, 2),
    ];
  }
  menuLinks.resources = resources.slice(0, 5).map((r) => ({ label: r.name, href: `/resources/${r.slug}` }));
  menuLinks.tools = toolsList.map((t) => ({ label: t.label, href: t.href }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.chineseName,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout loads the site font globally */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              跳转到主要内容
            </a>
            <SiteHeader items={searchItems} menuLinks={menuLinks} />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
