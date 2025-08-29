import React from 'react';
import CodeBlock from './CodeBlock';
import InlineCode from './InlineCode';

interface ResponseProps {
  text: string;
}

interface MarkdownElement {
  type: 'text' | 'code' | 'inline-code';
  content: string;
  language?: string;
}

// Simple markdown parser for basic formatting
class MarkdownParser {
  parse(text: string): MarkdownElement[] {
    const elements: MarkdownElement[] = [];
    let remaining = text;
    
    // Handle code blocks first (```language\ncode\n```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;
    
    while ((match = codeBlockRegex.exec(remaining)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = remaining.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          elements.push(...this.parseInlineElements(textBefore));
        }
      }
      
      // Add code block
      elements.push({
        type: 'code',
        content: match[2].trim(),
        language: match[1] || 'text'
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < remaining.length) {
      const remainingText = remaining.slice(lastIndex);
      if (remainingText.trim()) {
        elements.push(...this.parseInlineElements(remainingText));
      }
    }
    
    return elements;
  }
  
  private parseInlineElements(text: string): MarkdownElement[] {
    const elements: MarkdownElement[] = [];
    const inlineCodeRegex = /`([^`]+)`/g;
    let match;
    let lastIndex = 0;
    
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          elements.push({
            type: 'text',
            content: textBefore
          });
        }
      }
      
      // Add inline code
      elements.push({
        type: 'inline-code',
        content: match[1]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        elements.push({
          type: 'text',
          content: remainingText
        });
      }
    }
    
    return elements;
  }
}

export default function Response({ text }: ResponseProps) {
  const parser = new MarkdownParser();
  const elements = parser.parse(text);

  return (
    <div className="markdown-content">
      {elements.map((element, index) => {
        switch (element.type) {
          case 'code':
            return (
              <CodeBlock
                key={index}
                code={element.content}
                language={element.language || 'text'}
              />
            );
          case 'inline-code':
            return <InlineCode key={index} code={element.content} />;
          case 'text':
            return (
              <span key={index}>
                {element.content.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < element.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}