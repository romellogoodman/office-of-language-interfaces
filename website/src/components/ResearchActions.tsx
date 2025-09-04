'use client';

import ButtonLink from '@/components/ButtonLink';
import ButtonControl from '@/components/ButtonControl';
import { DISCUSS_RESEARCH_PROMPT } from '@/prompts/discuss-research';

interface ResearchActionsProps {
  slug: string;
  title: string;
  subhead?: string;
  content: string;
}

export default function ResearchActions({ slug, title, subhead, content }: ResearchActionsProps) {
  const currentUrl = `https://oli.software/research/${slug}`;
  const claudePrompt = DISCUSS_RESEARCH_PROMPT(currentUrl);
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(claudePrompt)}`;

  const copyMarkdown = () => {
    let markdownContent = `# ${title}\n\n`;
    
    if (subhead) {
      markdownContent += `${subhead}\n\n`;
    }
    
    markdownContent += content;
    
    navigator.clipboard.writeText(markdownContent);
  };

  return (
    <div className="research-actions">
      <ButtonLink 
        href={claudeUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        discuss
      </ButtonLink>
      <ButtonControl onClick={copyMarkdown}>
        copy as markdown
      </ButtonControl>
    </div>
  );
}