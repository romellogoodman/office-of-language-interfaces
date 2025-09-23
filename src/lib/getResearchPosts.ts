import fs from "fs";
import path from "path";
import { parseResearchPost } from "./parseResearch";

export interface ResearchPost {
  slug: string;
  title: string;
  subhead?: string;
  publishedAt: string;
  draft?: boolean;
}

export function getResearchPosts(): ResearchPost[] {
  const researchDir = path.join(process.cwd(), "src/app/research");

  if (!fs.existsSync(researchDir)) {
    return [];
  }

  const folders = fs
    .readdirSync(researchDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return folders
    .flatMap(slug => {
      const post = parseResearchPost(slug);
      if (!post) return [];

      return [
        {
          slug,
          title: post.frontmatter.title,
          subhead: post.frontmatter.subhead,
          publishedAt: post.frontmatter.publishedAt,
          draft: post.frontmatter.draft,
        },
      ];
    })
    .filter(post => !post.draft) // Filter out drafts in production
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
