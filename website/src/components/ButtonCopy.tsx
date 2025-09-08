'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import ButtonControl from './ButtonControl';

interface ButtonCopyProps {
  text: string;
  className?: string;
}

export default function ButtonCopy({ text, className = "" }: ButtonCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <ButtonControl 
      onClick={handleCopy}
      icon={<Copy size={14} />}
      className={className}
    >
      {copied ? 'copied' : 'copy'}
    </ButtonControl>
  );
}