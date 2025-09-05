import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isDev } from '@/utils/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://oli.software'

  // Research posts
  const postsDirectory = path.join(process.cwd(), 'research')
  let posts: any[] = []

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory)
    posts = filenames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const filePath = path.join(postsDirectory, name)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(fileContents)

        return {
          slug: data.slug || name.replace(/\.mdx$/, ''),
          publishedAt: data.publishedAt,
          draft: data.draft || false,
        }
      })
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  // Get most recent post date for homepage
  const mostRecentPostDate = posts.length > 0 ? new Date(posts[0].publishedAt) : new Date()

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: mostRecentPostDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Add research posts
  posts.forEach((post) => {
    routes.push({
      url: `${baseUrl}/research/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  return routes
}