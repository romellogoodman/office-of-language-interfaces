import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { isDev } from '@/utils/env';
import PageResearch from '@/components/PageResearch';

interface Params {
  slug: string;
}

interface Props {
  params: Promise<Params>;
}

function getPostBySlug(slug: string) {
  try {
    const postsDirectory = path.join(process.cwd(), 'research');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Don't return draft posts in production
    if (data.draft && !isDev) {
      return null;
    }
    
    return {
      frontmatter: {
        title: data.title || '',
        subhead: data.subhead,
        publishedAt: data.publishedAt || '',
      },
      content,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Oli",
    };
  }

  return {
    title: `${post.frontmatter.title} | Oli`,
  };
}

export default async function ResearchPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PageResearch post={post} slug={slug} />;
}