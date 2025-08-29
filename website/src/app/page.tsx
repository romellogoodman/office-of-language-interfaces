import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Metadata } from "next";
import { formatDate } from "@/utils/date";

export const metadata: Metadata = {
  title: "Oli",
};

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  draft: boolean;
}

function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "content/research");

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const filePath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || name.replace(/\.mdx$/, ""),
        title: data.title,
        publishedAt: data.publishedAt,
        summary: data.summary,
        draft: data.draft || false,
      };
    })
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return posts;
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="main-content">
      <div className="homepage-intro">
        <p>
          An{" "}
          <a
            href="https://github.com/romellogoodman/oli"
            target="_blank"
            rel="noopener noreferrer"
          >
            open
          </a>{" "}
          research lab designing software that responds to language.
        </p>
        {/* <p>
          Oli is a research project exploring how to design software that
          responds to language. All of our research is{" "}
          <a
            href="https://github.com/romellogoodman/oli"
            target="_blank"
            rel="noopener noreferrer"
          >
            open-source
          </a>{" "}
          and freely available.
        </p> */}
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div key={post.slug} className="post-item">
                <Link href={`/research/${post.slug}`} className="post-link">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-meta">
                    <time dateTime={post.publishedAt} className="post-date">
                      {formatDate(post.publishedAt)}
                    </time>
                    {post.summary}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No research posts available.</p>
        )}
      </div>
    </div>
  );
}
