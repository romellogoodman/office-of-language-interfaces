import { MDXRemote } from 'next-mdx-remote/rsc';
import { formatDate } from '@/utils/date';
import ResearchActions from '@/components/ResearchActions';
import CodeBlock from '@/components/CodeBlock';
import ProtoPromptBuilder from '@/components/prototype/ProtoPromptBuilder';

interface Post {
  frontmatter: {
    title: string;
    subhead?: string;
    publishedAt: string;
  };
  content: string;
}

interface PageResearchProps {
  post: Post;
  slug: string;
}

export default function PageResearch({ post, slug }: PageResearchProps) {
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
          <ResearchActions 
            slug={slug}
            title={post.frontmatter.title}
            subhead={post.frontmatter.subhead}
            content={post.content}
          />
        </header>
        <main>
          <div className="body-section">
            <MDXRemote 
              source={post.content} 
              components={{
                pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                ProtoPromptBuilder: ProtoPromptBuilder
              }}
            />
          </div>
        </main>
      </article>
    </div>
  );
}