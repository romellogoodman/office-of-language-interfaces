import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  const baseUrl = "https://oli.software";
  const postsDirectory = path.join(process.cwd(), "research");
  let posts: Array<{
    title: string;
    slug: string;
    publishedAt: string;
    summary: string;
    content: string;
    draft: boolean;
  }> = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    posts = filenames
      .filter(name => name.endsWith(".mdx"))
      .map(name => {
        const filePath = path.join(postsDirectory, name);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          title: data.title,
          slug: data.slug || name.replace(/\.mdx$/, ""),
          publishedAt: data.publishedAt,
          summary: data.summary || "",
          content: content.slice(0, 300) + "...", // Truncate content for RSS
          draft: data.draft || false,
        };
      })
      .filter(post => !post.draft)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Office of Language Interfaces</title>
  <description>An open research lab designing software that responds to language</description>
  <link>${baseUrl}</link>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${posts
    .map(post => {
      return `
  <item>
    <title>${post.title}</title>
    <description>${post.summary || post.content}</description>
    <link>${baseUrl}/research/${post.slug}</link>
    <guid>${baseUrl}/research/${post.slug}</guid>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  </item>`;
    })
    .join("")}
</channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
