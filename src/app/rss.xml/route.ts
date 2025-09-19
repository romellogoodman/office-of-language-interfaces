import { NextResponse } from "next/server";
import { getResearchPosts } from "@/lib/getResearchPosts";
import { parseResearchPost } from "@/lib/parseResearch";

export async function GET() {
  const baseUrl = "https://oli.software";
  const researchPosts = getResearchPosts();

  const posts = researchPosts.map(post => {
    const fullPost = parseResearchPost(post.slug);
    return {
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      content: fullPost?.content.slice(0, 300) + "..." || "",
      subhead: post.subhead || "",
    };
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Office of Language Interfaces</title>
  <description>A research lab designing software that responds to language</description>
  <link>${baseUrl}</link>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${posts
    .map(post => {
      return `
  <item>
    <title>${post.title}</title>
    <description>${post.subhead || post.content}</description>
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
