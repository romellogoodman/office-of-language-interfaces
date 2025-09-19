import { MetadataRoute } from "next";
import { getResearchPosts } from "@/lib/getResearchPosts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://oli.software";

  // Research posts
  const posts = getResearchPosts();

  // Get most recent post date for homepage
  const mostRecentPostDate =
    posts.length > 0 ? new Date(posts[0].publishedAt) : new Date();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: mostRecentPostDate,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Add research posts
  posts.forEach(post => {
    routes.push({
      url: `${baseUrl}/research/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  return routes;
}
