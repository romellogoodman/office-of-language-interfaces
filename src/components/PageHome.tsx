"use client";

import Link from "next/link";
import { formatDate } from "@/utils/date";
import ButtonGenerate from "@/components/ButtonGenerate";
import { GENERATE_RESEARCH_TAGLINE_PROMPT } from "@/prompts/generate-research-tagline";
import Footer from "@/components/Footer";

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  draft: boolean;
}

interface PageHomeProps {
  posts: Post[];
  commitHash?: string;
}

const initialGenerations = [
  "A research lab designing software that responds to language.",
  "A research lab exploring conversational interfaces that reimagine how humans and machines create meaning together.",
  "A research lab designing conversational interfaces that reimagine human-computer meaning-making.",
];

const initialText = initialGenerations[0];

export default function PageHome({ posts, commitHash }: PageHomeProps) {
  const { currentText, controls } = ButtonGenerate({
    initialText,
    initialGenerations,
    prompt: GENERATE_RESEARCH_TAGLINE_PROMPT,
  });

  return (
    <>
      <div className="main-content">
        <div className="homepage-intro">
          <p>{currentText}</p>
          {controls}
        </div>

        <div className="research-section">
          {posts.length > 0 ? (
            <ul className="research-list">
              {posts.map(post => (
                <li key={post.slug} className="research-item">
                  <Link
                    href={`/research/${post.slug}`}
                    className="research-link"
                  >
                    <span className="research-title">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <Footer commitHash={commitHash} />
    </>
  );
}
