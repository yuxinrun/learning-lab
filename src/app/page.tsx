import { Hero } from "@/components/home/hero";
import { FeaturedArticles, FeaturedTopics, MethodsPreview, StartHere } from "@/components/home/home-content";
import { BooksPreview, ResourcesPreview, ToolsPreview, VisualizationsPreview } from "@/components/home/home-more";
import { Newsletter } from "@/components/home/newsletter";
import { getFeaturedArticles } from "@/lib/content";

export default function HomePage() {
  const articles = getFeaturedArticles(6);

  return (
    <>
      <Hero />
      <FeaturedTopics />
      <StartHere />
      <FeaturedArticles articles={articles} />
      <MethodsPreview />
      <VisualizationsPreview />
      <BooksPreview />
      <ResourcesPreview />
      <ToolsPreview />
      <Newsletter />
    </>
  );
}
