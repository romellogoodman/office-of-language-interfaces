"use client";

import ButtonControl from "@/components/ButtonControl";
import ButtonCopy from "@/components/ButtonCopy";
import IconClaude from "@/components/Icons/IconClaude";
import { DISCUSS_RESEARCH_PROMPT } from "@/prompts/discuss-research";

interface ResearchActionsProps {
  slug: string;
  title: string;
  subhead?: string;
  content: string;
}

export default function ResearchActions({
  slug,
  title,
  subhead,
  content,
}: ResearchActionsProps) {
  const currentUrl = `https://oli.software/research/${slug}`;
  const claudePrompt = DISCUSS_RESEARCH_PROMPT(currentUrl);
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(claudePrompt)}`;

  const getMarkdownContent = () => {
    let markdownContent = `# ${title}\n\n`;

    if (subhead) {
      markdownContent += `${subhead}\n\n`;
    }

    markdownContent += content;
    return markdownContent;
  };

  const openDiscussion = () => {
    window.open(claudeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="button-control-group"
      style={{ marginTop: "var(--space-stack-s)" }}
    >
      <ButtonControl onClick={openDiscussion} icon={<IconClaude size={14} />}>
        discuss
      </ButtonControl>
      <ButtonCopy text={getMarkdownContent()} />
    </div>
  );
}
