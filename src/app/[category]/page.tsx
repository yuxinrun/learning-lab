import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/pages/category-page";
import { categories, categoryMap } from "@/lib/site";
import type { CategorySlug } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryMap[category as CategorySlug];
  if (!cat) return {};
  return {
    title: `${cat.title} · ${cat.englishTitle}`,
    description: cat.description,
    alternates: { canonical: `/${cat.slug}` },
    openGraph: { title: `${cat.title} · Learning Lab`, description: cat.description, url: `/${cat.slug}` },
  };
}

export default async function CategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categoryMap[category as CategorySlug]) notFound();
  return <CategoryPage slug={category as CategorySlug} />;
}
