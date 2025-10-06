import { MDXRemote } from "next-mdx-remote/rsc";
import Header from "@/components/Header";
import CodeBlock from "@/components/CodeBlock";
import Footer from "@/components/Footer";

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
  prototype?: React.ReactNode;
  commitHash?: string;
}

export default function PageResearch({
  post,
  prototype,
  commitHash,
}: PageResearchProps) {
  return (
    <>
      <Header />
      <div className="research-page-grid">
        <div className="research-content">
          <article>
            <header>
              <h1>{post.frontmatter.title}</h1>
              {post.frontmatter.subhead && (
                <p className="research-subhead">{post.frontmatter.subhead}</p>
              )}
              {/* <time dateTime={post.frontmatter.publishedAt}>
                {formatDate(post.frontmatter.publishedAt)}
              </time> */}
            </header>
            <main>
              <div className="body-section">
                <MDXRemote
                  source={post.content}
                  components={{
                    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                  }}
                />
              </div>
            </main>
          </article>
          {post.frontmatter.furtherReading &&
            post.frontmatter.furtherReading.length > 0 && (
              <div className="further-reading">
                <p className="further-reading-title">Further reading</p>
                <div className="further-reading-list">
                  {post.frontmatter.furtherReading.map((item, index) => (
                    <div key={index} className="further-reading-item">
                      <div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      </div>
                      <div className="further-reading-author">
                        by {item.author}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
        {prototype && (
          <div className="prototype-section">
            <div className="prototype-item">{prototype}</div>
          </div>
        )}
      </div>
      <Footer
        commitHash={commitHash}
        title={post.frontmatter.title}
        subhead={post.frontmatter.subhead}
        content={post.content}
      />
    </>
  );
}
