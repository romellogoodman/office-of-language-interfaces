import { parseResearchPost } from "./parseResearch";

export interface ResearchPost {
  slug: string;
  title: string;
  subhead?: string;
  publishedAt: string;
  draft?: boolean;
}

export function getResearchPosts(): ResearchPost[] {
  const posts = [
    "research-lab-as-container",
    "poetic-404",
    "collections-of-meaningless-words",
    "prompt-prefilling",
    "prototypes-and-projects",
    "a-pause-to-think",
  ];

  return posts
    .map(slug => {
      const post = parseResearchPost(slug);
      if (!post) return null;

      return {
        slug,
        title: post.frontmatter.title,
        subhead: post.frontmatter.subhead,
        publishedAt: post.frontmatter.publishedAt,
        draft: post.frontmatter.draft,
      };
    })
    .filter((post): post is ResearchPost => post !== null)
    .filter(post => !post.draft) // Filter out drafts in production
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
