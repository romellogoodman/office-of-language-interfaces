import { Metadata } from "next";

interface Frontmatter {
  title: string;
  subhead?: string;
  publishedAt: string;
  furtherReading?: unknown;
}

export function getPageMetadata(frontmatter: Frontmatter): Metadata {
  return {
    title: `${frontmatter.title} | Office of Language Interfaces`,
    description: frontmatter.subhead,
  };
}
