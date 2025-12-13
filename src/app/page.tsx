import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import PageHome from "@/components/PageHome";
import { isDev } from "@/utils/env";
import { getLatestCommitHash } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Office of Language Interfaces",
};

interface FurtherReading {
  title: string;
  author: string;
  url: string;
}

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    subhead?: string;
    publishedAt: string;
    furtherReading?: FurtherReading[];
  };
  content: string;
}

function getAllPosts(): Post[] {
  const researchDirectory = path.join(process.cwd(), "src/app/research");

  if (!fs.existsSync(researchDirectory)) {
    return [];
  }

  // Manual post order - rearrange these slugs to change the order on the homepage
  const postOrder = [
    "research-lab-as-container",
    "pausing-to-think",
    "collections-of-meaningless-words",
    "poetic-404",
    "reading-the-manual",
    "prompt-prefilling",
  ];

  const posts = postOrder
    .map(slug => {
      const contentPath = path.join(researchDirectory, slug, "content.md");

      if (!fs.existsSync(contentPath)) {
        return null;
      }

      const fileContents = fs.readFileSync(contentPath, "utf8");
      const { data, content } = matter(fileContents);

      // Filter out drafts in production
      if (!isDev && data.draft) {
        return null;
      }

      const post: Post = {
        slug,
        frontmatter: {
          title: data.title || "",
          subhead: data.subhead,
          publishedAt: data.publishedAt || "",
          furtherReading: data.furtherReading,
        },
        content,
      };

      return post;
    })
    .filter((post): post is Post => Boolean(post));

  return posts;
}

export default async function Home() {
  const posts = getAllPosts();
  const commitHash = await getLatestCommitHash();

  return <PageHome posts={posts} commitHash={commitHash} />;
}
