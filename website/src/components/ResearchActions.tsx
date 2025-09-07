'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import ButtonControl from '@/components/ButtonControl';
import IconClaude from '@/components/Icons/IconClaude';
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

  const openDiscussion = () => {
    window.open(claudeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="research-actions">
      <ButtonControl 
        onClick={openDiscussion}
        icon={<IconClaude size={14} />}
      >
        discuss
      </ButtonControl>
      <ButtonControl 
        onClick={copyMarkdown}
        icon={<Copy size={14} />}
      >
        {copied ? 'copied' : 'copy'}
      </ButtonControl>
    </div>
  );
}