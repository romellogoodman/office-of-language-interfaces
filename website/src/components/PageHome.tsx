"use client";

import Link from "next/link";
import { formatDate } from "@/utils/date";
import GenerationControls from "@/components/GenerationControls";
import { EXPAND_RESEARCH_DESCRIPTION_PROMPT } from "@/prompts/expand-research-description";

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  draft: boolean;
}

interface PageHomeProps {
  posts: Post[];
}

export default function PageHome({ posts }: PageHomeProps) {
  const initialText =
    "An open research lab designing software that responds to language.";

  const generatePrompt = () => EXPAND_RESEARCH_DESCRIPTION_PROMPT;

  const { currentText, controls } = GenerationControls({
    initialText,
    generatePrompt,
  });

  return (
    <div className="main-content">
      <div className="homepage-intro">
        <p>{currentText}</p>
        {controls}
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
