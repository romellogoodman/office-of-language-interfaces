import { MDXRemote } from "next-mdx-remote/rsc";
import { formatDate } from "@/utils/date";
import ResearchActions from "@/components/ResearchActions";
import CodeBlock from "@/components/CodeBlock";
import ProtoPromptBuilder from "@/components/prototype/ProtoPromptBuilder";
import ProtoWordExplorer from "@/components/prototype/ProtoWordExplorer";

interface FurtherReading {
  title: string;
  author: string;
  url: string;
}

interface Post {
  frontmatter: {
    title: string;
    subhead?: string;
    publishedAt: string;
    furtherReading?: FurtherReading[];
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
                ProtoPromptBuilder: ProtoPromptBuilder,
                ProtoWordExplorer: ProtoWordExplorer,
              }}
            />
          </div>
        </main>
      </article>
      {post.frontmatter.furtherReading &&
        post.frontmatter.furtherReading.length > 0 && (
          <aside className="further-reading-sidebar">
            <h2>Further reading</h2>
            <ul className="further-reading-list">
              {post.frontmatter.furtherReading.map((item, index) => (
                <li key={index} className="further-reading-item">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <span className="further-reading-author">
                    by {item.author}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        )}
    </div>
  );
}
