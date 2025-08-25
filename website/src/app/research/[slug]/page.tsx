import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';

interface Params {
  slug: string;
}

interface Props {
  params: Params;
}

function getPostBySlug(slug: string) {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/research');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content,
    };
  } catch {
    return null;
  }
}

export default function ResearchPost({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <header>
        <h1>{post.frontmatter.title}</h1>
        <time dateTime={post.frontmatter.publishedAt}>
          {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
      </header>
      <main>
        <MDXRemote source={post.content} />
      </main>
    </article>
  );
}