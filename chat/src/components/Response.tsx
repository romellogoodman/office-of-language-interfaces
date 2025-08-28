import React from "react";
import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";

interface ResponseProps {
  content: string;
}

interface MarkdownParser {
  parseContent: (content: string) => React.ReactNode[];
  parseLists: (text: string) => React.ReactNode[];
  parseHeadings: (text: string) => React.ReactNode;
  parseLinks: (text: string) => React.ReactNode[];
  parseBoldItalic: (text: string) => React.ReactNode[];
  parseInlineCode: (text: string) => React.ReactNode[];
}

const markdownParser: MarkdownParser = {
  parseContent(content: string): React.ReactNode[] {
    // Stage 1: Extract fenced code blocks
    const codeBlockRegex = /```([\w]*)\n?([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index);
        parts.push(...this.parseLists(textContent));
      }

      // Add code block
      const language = match[1] || '';
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={match.index} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      parts.push(...this.parseLists(remainingText));
    }

    return parts;
  },

  parseLists(text: string): React.ReactNode[] {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
    let elementKey = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        // Close current list on empty line
        if (currentList) {
          elements.push(
            React.createElement(
              currentList.type,
              { key: elementKey++ },
              currentList.items.map((item, index) => 
                React.createElement('li', { key: index }, item)
              )
            )
          );
          currentList = null;
        }
        continue;
      }

      // Check for unordered list
      const unorderedMatch = /^(\s*)([-*+])\s+(.+)$/.exec(trimmedLine);
      if (unorderedMatch) {
        const content = this.parseLinks(unorderedMatch[3]);
        
        if (!currentList || currentList.type !== 'ul') {
          if (currentList) {
            elements.push(
              React.createElement(
                currentList.type,
                { key: elementKey++ },
                currentList.items.map((item, index) => 
                  React.createElement('li', { key: index }, item)
                )
              )
            );
          }
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(content);
        continue;
      }

      // Check for ordered list
      const orderedMatch = /^(\s*)(\d+\.)\s+(.+)$/.exec(trimmedLine);
      if (orderedMatch) {
        const content = this.parseLinks(orderedMatch[3]);
        
        if (!currentList || currentList.type !== 'ol') {
          if (currentList) {
            elements.push(
              React.createElement(
                currentList.type,
                { key: elementKey++ },
                currentList.items.map((item, index) => 
                  React.createElement('li', { key: index }, item)
                )
              )
            );
          }
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(content);
        continue;
      }

      // Close current list for non-list items
      if (currentList) {
        elements.push(
          React.createElement(
            currentList.type,
            { key: elementKey++ },
            currentList.items.map((item, index) => 
              React.createElement('li', { key: index }, item)
            )
          )
        );
        currentList = null;
      }

      // Check for headings or create paragraph
      const heading = this.parseHeadings(trimmedLine);
      if (React.isValidElement(heading)) {
        elements.push(React.cloneElement(heading, { key: elementKey++ }));
      } else {
        const paragraphContent = this.parseLinks(trimmedLine);
        elements.push(<p key={elementKey++}>{paragraphContent}</p>);
      }
    }

    // Close final list if exists
    if (currentList) {
      elements.push(
        React.createElement(
          currentList.type,
          { key: elementKey++ },
          currentList.items.map((item, index) => 
            React.createElement('li', { key: index }, item)
          )
        )
      );
    }

    return elements;
  },

  parseHeadings(text: string): React.ReactNode {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(text);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = this.parseLinks(headingMatch[2]);
      return React.createElement(`h${level}`, {}, content);
    }
    return text;
  },

  parseLinks(text: string): React.ReactNode[] {
    const linkRegex = /(\[.+?\]\(.+?\))/g;
    return this.splitAndParse(text, linkRegex, (match) => {
      const linkMatch = /\[(.+?)\]\((.+?)\)/.exec(match);
      if (linkMatch) {
        return <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
      }
      return match;
    }, this.parseBoldItalic.bind(this));
  },

  parseBoldItalic(text: string): React.ReactNode[] {
    const boldRegex = /(\*\*[^*]+\*\*|__[^_]+__)/g;
    return this.splitAndParse(text, boldRegex, (match) => {
      if (match.startsWith('**') && match.endsWith('**')) {
        return <strong>{match.slice(2, -2)}</strong>;
      }
      if (match.startsWith('__') && match.endsWith('__')) {
        return <strong>{match.slice(2, -2)}</strong>;
      }
      return match;
    }, (remaining) => {
      const italicRegex = /(\*[^*]+\*|_[^_]+_)/g;
      return this.splitAndParse(remaining, italicRegex, (match) => {
        if (match.startsWith('*') && match.endsWith('*')) {
          return <em>{match.slice(1, -1)}</em>;
        }
        if (match.startsWith('_') && match.endsWith('_')) {
          return <em>{match.slice(1, -1)}</em>;
        }
        return match;
      }, this.parseInlineCode.bind(this));
    });
  },

  parseInlineCode(text: string): React.ReactNode[] {
    const codeRegex = /(`[^`]+`)/g;
    return this.splitAndParse(text, codeRegex, (match) => {
      if (match.startsWith('`') && match.endsWith('`')) {
        return <InlineCode code={match.slice(1, -1)} />;
      }
      return match;
    });
  },

  splitAndParse(
    text: string,
    regex: RegExp,
    matchHandler: (match: string) => React.ReactNode,
    continueHandler?: (text: string) => React.ReactNode[]
  ): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (continueHandler) {
          parts.push(...continueHandler(beforeText));
        } else {
          parts.push(beforeText);
        }
      }

      // Add processed match
      parts.push(matchHandler(match[1]));
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remaining = text.slice(lastIndex);
      if (continueHandler) {
        parts.push(...continueHandler(remaining));
      } else {
        parts.push(remaining);
      }
    }

    return parts;
  }
};

export default function Response({ content }: ResponseProps) {
  const parsedContent = markdownParser.parseContent(content);

  return (
    <div className="markdown-content">
      {parsedContent.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </div>
  );
}