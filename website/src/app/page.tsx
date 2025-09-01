import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import PageHome from "@/components/PageHome";

export const metadata: Metadata = {
  title: "Oli",
};

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  draft: boolean;
}

function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "content/research");

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const filePath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || name.replace(/\.mdx$/, ""),
        title: data.title,
        publishedAt: data.publishedAt,
        summary: data.summary,
        draft: data.draft || false,
      };
    })
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return posts;
}

export default function Home() {
  const posts = getAllPosts();
  
  return <PageHome posts={posts} />;
}