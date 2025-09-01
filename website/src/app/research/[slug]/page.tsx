import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { formatDate } from '@/utils/date';

interface Params {
  slug: string;
}

interface Props {
  params: Promise<Params>;
}

function getPostBySlug(slug: string) {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/research');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Don't return draft posts
    if (data.draft) {
      return null;
    }
    
    return {
      frontmatter: data,
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

  return (
    <div className="research-content">
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          {post.frontmatter.subhead && (
            <p className="research-subhead">{post.frontmatter.subhead}</p>
          )}
          <time dateTime={post.frontmatter.publishedAt}>
            {formatDate(post.frontmatter.publishedAt)}
          </time>
        </header>
        <main>
          <div className="body-section">
            <MDXRemote source={post.content} />
          </div>
        </main>
      </article>
    </div>
  );
}