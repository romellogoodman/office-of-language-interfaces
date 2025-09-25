import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import PageHome from "@/components/PageHome";
import { isDev } from "@/utils/env";
import { getLatestCommitHash } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Office of Language Interfaces | Oli",
};

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  draft: boolean;
}

function getAllPosts(): Post[] {
  const researchDirectory = path.join(process.cwd(), "src/app/research");

  if (!fs.existsSync(researchDirectory)) {
    return [];
  }

  const postSlugs = fs
    .readdirSync(researchDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const posts = postSlugs
    .map(slug => {
      const contentPath = path.join(researchDirectory, slug, "content.md");

      if (!fs.existsSync(contentPath)) {
        return null;
      }

      const fileContents = fs.readFileSync(contentPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        publishedAt: data.publishedAt,
        draft: data.draft || false,
      };
    })
    .filter((post): post is Post => post !== null)
    .filter(post => (isDev ? true : !post.draft))
    .sort((a, b) => a.title.localeCompare(b.title));

  return posts;
}

export default async function Home() {
  const posts = getAllPosts();
  const commitHash = await getLatestCommitHash();

  return <PageHome posts={posts} commitHash={commitHash} />;
}
