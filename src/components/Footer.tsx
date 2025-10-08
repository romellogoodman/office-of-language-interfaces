"use client";

import ButtonLink from "@/components/ButtonLink";
import ButtonControl from "@/components/ButtonControl";
import ButtonCopy from "@/components/ButtonCopy";
import IconClaude from "@/components/Icons/IconClaude";
import { Code } from "lucide-react";
import { DISCUSS_RESEARCH_PROMPT } from "@/prompts/discuss-research";

interface FooterProps {
  commitHash?: string;
  // Research actions props
  title?: string;
  subhead?: string;
  content?: string;
}

export default function Footer({
  commitHash,
  title,
  subhead,
  content,
}: FooterProps) {
  const getMarkdownContent = () => {
    if (!title) return "";
    let markdownContent = `# ${title}\n\n`;

    if (subhead) {
      markdownContent += `${subhead}\n\n`;
    }

    if (content) {
      markdownContent += content;
    }
    return markdownContent;
  };

  const openDiscussion = () => {
    const currentUrl = window.location.href;
    const claudePrompt = DISCUSS_RESEARCH_PROMPT(currentUrl);
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(claudePrompt)}`;
    window.open(claudeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-inner">
          <div className="footer-left">
            <p>
              <a href="/" className="footer-oli-link">
                Office of Language Interfaces
              </a>
              <br />
              Led by{" "}
              <a
                href="https://romellogoodman.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Romello Goodman
              </a>{" "}
              in Baltimore, MD
            </p>
          </div>
          <div className="footer-right">
            {title && (
              <div className="button-control-group">
                <ButtonControl
                  onClick={openDiscussion}
                  icon={<IconClaude size={14} />}
                >
                  discuss
                </ButtonControl>
                <ButtonCopy text={getMarkdownContent()} />
              </div>
            )}
            {commitHash && (
              <ButtonLink
                href={`https://github.com/romellogoodman/office-of-language-interfaces/commit/${commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<Code size={14} />}
              >
                {commitHash}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
