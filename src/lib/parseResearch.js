import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function parseResearchPost(slug) {
  try {
    const contentPath = path.join(
      process.cwd(),
      "src/app/research",
      slug,
      "content.md"
    );
    const fileContents = fs.readFileSync(contentPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: {
        title: data.title || "",
        subhead: data.subhead,
        publishedAt: data.publishedAt || "",
        furtherReading: data.furtherReading,
        draft: data.draft || false,
      },
      content,
    };
  } catch (error) {
    console.error(`Error parsing research post ${slug}:`, error);
    return null;
  }
}
