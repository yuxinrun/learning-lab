import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose-article">
      <MDXRemote source={content} components={mdxComponents} />
    </div>
  );
}
