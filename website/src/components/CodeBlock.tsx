'use client';

import React, { useState } from 'react';
import ButtonControl from './ButtonControl';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const extractTextFromChildren = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return node.toString();
    }
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      if (element.props?.children) {
        return extractTextFromChildren(element.props.children);
      }
    }
    if (Array.isArray(node)) {
      return node.map(extractTextFromChildren).join('');
    }
    return node?.toString() || '';
  };

  const handleCopy = async () => {
    try {
      const text = extractTextFromChildren(children);
      
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