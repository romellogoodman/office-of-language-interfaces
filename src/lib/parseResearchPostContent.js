import matter from "gray-matter";

export function parseResearchPostContent(content) {
  const { data, content: body } = matter(content);

  return {
    frontmatter: {
      title: data.title || "",
      subhead: data.subhead,
      publishedAt: data.publishedAt || "",
      furtherReading: data.furtherReading,
    },
    content: body,
  };
}
