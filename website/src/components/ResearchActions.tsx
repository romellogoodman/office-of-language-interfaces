'use client';

import { useState } from 'react';
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
  const [copied, setCopied] = useState(false);
  const currentUrl = `https://oli.software/research/${slug}`;
  const claudePrompt = DISCUSS_RESEARCH_PROMPT(currentUrl);
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(claudePrompt)}`;

  const copyMarkdown = async () => {
    let markdownContent = `# ${title}\n\n`;
    
    if (subhead) {
      markdownContent += `${subhead}\n\n`;
    }
    
    markdownContent += content;
    
    await navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {copied ? 'copied' : 'copy'}
      </ButtonControl>
    </div>
  );
}