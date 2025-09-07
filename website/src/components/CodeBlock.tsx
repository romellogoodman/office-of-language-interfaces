'use client';

import React, { useState } from 'react';
import ButtonControl from './ButtonControl';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Extract text content from React children
      let text = '';
      if (typeof children === 'string') {
        text = children;
      } else if (React.isValidElement(children) && (children.props as any)?.children) {
        text = typeof (children.props as any).children === 'string' 
          ? (children.props as any).children 
          : (children.props as any).children?.toString() || '';
      } else {
        text = children?.toString() || '';
      }
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`code-block-container ${className}`}>
      <pre>
        <code>{children}</code>
      </pre>
      <ButtonControl onClick={handleCopy}>
        {copied ? 'copied' : 'copy'}
      </ButtonControl>
    </div>
  );
}