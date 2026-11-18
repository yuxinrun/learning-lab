"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, ChevronDown, Library, Menu, Sparkles, X } from "lucide-react";
import { categories, footerNav, mainNav, siteConfig, toolsList } from "@/lib/site";
import type { SearchItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

export interface MenuLink {
  label: string;
  href: string;
}

const drawerToolLabels: Record<string, string> = {
  "/tools": "学习仪表盘",
  "/tools/study-tracker": "学习记录器",
  "/tools/spaced-repetition": "间隔重复",
  "/tools/active-recall": "主动回忆",
  "/tools/reading-tracker": "阅读记录",
  "/tools/learning-goals": "目标规划",
  "/tools/knowledge-cards": "知识卡片",
  "/tools/focus-timer": "专注计时",
  "/tools/weekly-review": "每周复盘",
};

interface SiteHeaderProps {
  items: SearchItem[];
  menuLinks: Record<string, MenuLink[]>;
}

export function SiteHeader({ items, menuLinks }: SiteHeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpenMenu(null);
    setDrawer(false);
  }, [pathname]);

  const navWithMenus = mainNav.slice(1).map((item) => {
    const key = item.href.slice(1);
    return { ...item, menu: menuLinks[key] ?? [] };
  });

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Learning Lab 首页">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
            <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[17px] font-semibold tracking-tight">{siteConfig.name}</span>
            <span className="mt-0.5 hidden text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="主导航">
          <Link
            href="/"
            className={cn(
              "whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-foreground/80",
            )}
          >
            {mainNav[0].label}
          </Link>
          {navWithMenus.map((item) => {
            const hrefKey = item.href.slice(1);
            const active = pathname.startsWith(item.href);
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.menu.length && setOpenMenu(hrefKey)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-foreground/80",
                  )}
                >
                  {item.label}
                  {item.menu.length > 0 && <ChevronDown className="h-3 w-3 opacity-60" />}
                </Link>
                {item.menu.length > 0 && openMenu === hrefKey && (
                  <div className="absolute left-0 top-full w-[300px] pt-2">
                    <div className="rounded-lg border border-border bg-card p-3 shadow-lift">
                      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.description ?? "探索"}
                      </p>
                      {item.menu.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface"
                        >
                          <span className="truncate">{link.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        className="mt-2 flex items-center gap-1 border-t border-border px-2 pt-3 text-xs font-medium text-primary"
                      >
                        查看全部 <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <SearchDialog items={items} />
          <ThemeToggle />
          <Link
            href="/tools"
            className="ml-1 hidden h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            我的学习
          </Link>
          <button
            onClick={() => setDrawer(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground focus-ring xl:hidden"
            aria-label="打开导航菜单"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    {drawer && (
      <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[min(360px,88vw)] overflow-y-auto border-l border-border bg-card p-6 shadow-lift">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-lg font-semibold">导航</span>
              <button onClick={() => setDrawer(false)} aria-label="关闭菜单" className="rounded-md p-1.5 hover:bg-surface">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Link href="/" className="mb-2 block rounded-md px-3 py-2 font-medium hover:bg-surface">
              {mainNav[0].label}
            </Link>
            <p className="section-label mb-2 mt-6">知识分类</p>
            <div className="space-y-0.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-surface"
                >
                  <span>
                    <span className="font-medium">{c.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.englishTitle}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <p className="section-label mb-2 mt-6">更多</p>
            <div className="space-y-0.5">
              <Link href="/books" className="block rounded-md px-3 py-2 text-sm hover:bg-surface">精选书籍</Link>
              <Link href="/resources" className="block rounded-md px-3 py-2 text-sm hover:bg-surface">专业资源</Link>
              <Link href="/learning-paths" className="block rounded-md px-3 py-2 text-sm hover:bg-surface">学习路径</Link>
              <Link href="/search" className="block rounded-md px-3 py-2 text-sm hover:bg-surface">全站搜索</Link>
            </div>
            <p className="section-label mb-2 mt-6">学习工具</p>
            <div className="space-y-0.5">
              {toolsList.map((t) => (
                <Link key={t.href} href={t.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface">
                  <Library className="h-3.5 w-3.5 text-primary" />
                  {drawerToolLabels[t.href] ?? t.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 border-t border-border pt-6">
              {footerNav[1].items.map((item) => (
                <Link key={item.href} href={item.href} className="mr-4 inline-block py-1 text-xs text-muted-foreground hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
