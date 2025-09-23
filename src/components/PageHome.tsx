"use client";

import Link from "next/link";
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
  "a research lab designing software that responds to language.",
  "a research lab exploring conversational interfaces that reimagine how humans and machines create meaning together.",
  "a research lab designing conversational interfaces that reimagine human-computer meaning-making.",
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
          <p>Office of Language Interfaces is {currentText}</p>
          {controls}
        </div>

        <div className="research-section">
          {posts.length > 0 ? (
            <p className="research-paragraph">
              Our work includes:{" "}
              {posts.map((post, index) => (
                <span key={post.slug}>
                  <Link
                    href={`/research/${post.slug}`}
                    className="research-link"
                  >
                    {post.title.charAt(0).toLowerCase() + post.title.slice(1)}
                  </Link>
                  {index === posts.length - 1
                    ? "."
                    : index === posts.length - 2
                      ? ", and "
                      : ", "}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
      {/* <Footer commitHash={commitHash} /> */}
    </>
  );
}
