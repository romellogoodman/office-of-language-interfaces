import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
}

function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'content/research');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const filePath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: data.slug || name.replace(/\.mdx$/, ''),
        title: data.title,
        publishedAt: data.publishedAt,
        summary: data.summary,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
  return posts;
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <p>Open Language Interface (Oli) is a research project from <a href="https://www.romellogoodman.com/" target="_blank" rel="noopener noreferrer">Romello Goodman</a>.</p>
      
      <p>It is a set of open-source tools for talking to your computer. Each tool is free and available to the public to read, copy and maintain.</p>
      
      <p>Open interfaces, open knowledge.</p>
      
      <section>
        <h2>Tools</h2>
        <ul>
          <li>
            <h3>Chat</h3>
            <p>Web interface for LLM conversations</p>
          </li>
          <li>
            <h3>Website</h3>
            <p>Marketing and documentation site</p>
          </li>
        </ul>
      </section>
      
      <section>
        <h2>Research</h2>
        {posts.length > 0 ? (
          <ul>
            {posts.map(post => (
              <li key={post.slug}>
                <Link href={`/research/${post.slug}`}>
                  <h3>{post.title}</h3>
                </Link>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span>•</span>
                  <span>{post.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No research posts available.</p>
        )}
      </section>
    </div>
  );
}
