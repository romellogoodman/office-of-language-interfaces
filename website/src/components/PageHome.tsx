"use client";

import Link from "next/link";
import { formatDate } from "@/utils/date";
import ChangelogSidebar from "@/components/ChangelogSidebar";
import GenerationControls from "@/components/GenerationControls";

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
  const initialText = "An open research lab designing software that responds to language.";
  
  const generatePrompt = (currentText: string, generations: string[]) => {
    const targetWordCount = Math.max(15, 15 + generations.length * 10);
    
    const previousGenerations = generations.slice(0, -2).map((gen, i) => 
      `Generation ${i + 1}: ${gen}`
    ).join('\n\n');
    
    const contextPrompt = previousGenerations ? 
      `Here are the previous generations for context:\n\n${previousGenerations}\n\n` : '';

    return `${contextPrompt}Please rewrite this text: "${currentText}"

Requirements:
- Keep the core meaning about being an open-source research lab designing software that responds to language (this means tools for interfacing with llms)
- Make it approximately ${targetWordCount} words long
- Make it more detailed and expansive than the original
- Keep it engaging and descriptive
- Build upon the evolution shown in previous generations but don't repeat exact phrases
- Only return the rewritten text, nothing else`;
  };

  const { currentText, controls } = GenerationControls({
    initialText,
    generatePrompt,
  });

  return (
    <div className="homepage-container">
      <div className="main-content">
        <div className="homepage-intro">
          <p>{currentText}</p>
          {controls}
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

      <ChangelogSidebar />
    </div>
  );
}
