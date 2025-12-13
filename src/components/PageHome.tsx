import { MDXRemote } from "next-mdx-remote/rsc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import PrototypeResearchLabAsContainer from "@/app/research/research-lab-as-container/Prototype";
import PrototypePausingToThink from "@/app/research/pausing-to-think/Prototype";
import PrototypeCollectionsOfMeaninglessWords from "@/app/research/collections-of-meaningless-words/Prototype";
import PrototypePoetic404 from "@/app/research/poetic-404/Prototype";
import PrototypePromptPrefilling from "@/app/research/prompt-prefilling/Prototype";

interface FurtherReading {
  title: string;
  author: string;
  url: string;
}

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    subhead?: string;
    publishedAt: string;
    furtherReading?: FurtherReading[];
  };
  content: string;
}

interface PageHomeProps {
  posts: Post[];
  commitHash?: string;
}

// Map slugs to their prototype components
const prototypeMap: Record<string, React.ComponentType> = {
  "research-lab-as-container": PrototypeResearchLabAsContainer,
  "pausing-to-think": PrototypePausingToThink,
  "collections-of-meaningless-words": PrototypeCollectionsOfMeaninglessWords,
  "poetic-404": PrototypePoetic404,
  "prompt-prefilling": PrototypePromptPrefilling,
};

export default function PageHome({ posts, commitHash }: PageHomeProps) {
  return (
    <>
      <Header />

      <div className="homepage-research-stack">
        {posts.map(post => {
          const PrototypeComponent = prototypeMap[post.slug];

          return (
            <div key={post.slug} className="homepage-research-item">
              <div className="research-page-grid">
                <div className="research-content">
                  <article>
                    <header>
                      <h1>{post.frontmatter.title}</h1>
                      {post.frontmatter.subhead && (
                        <p className="research-subhead">
                          {post.frontmatter.subhead}
                        </p>
                      )}
                    </header>
                    <main>
                      <div className="body-section">
                        <MDXRemote
                          source={post.content}
                          components={{
                            pre: ({ children }) => (
                              <CodeBlock>{children}</CodeBlock>
                            ),
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
                          {post.frontmatter.furtherReading.map(
                            (item, index) => (
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
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
                {PrototypeComponent && (
                  <div className="prototype-section">
                    <div className="prototype-item">
                      <PrototypeComponent />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Footer commitHash={commitHash} />
    </>
  );
}
