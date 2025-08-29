import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";

// Import core language support
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

// Dynamically load additional languages
const loadLanguage = async (language: string) => {
  const languageMap: Record<string, string> = {
    typescript: "typescript",
    python: "python", 
    java: "java",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    sql: "sql",
    json: "json",
    yaml: "yaml",
    bash: "bash",
    powershell: "powershell",
    scss: "scss",
    sass: "sass",
    jsx: "jsx",
    tsx: "tsx",
    markdown: "markdown"
  };

  const prismLang = languageMap[language];
  if (prismLang && !Prism.languages[prismLang]) {
    try {
      await import(`prismjs/components/prism-${prismLang}`);
    } catch (error) {
      console.warn(`Failed to load language: ${prismLang}`, error);
    }
  }
};

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const highlightCode = async () => {
      if (codeRef.current && language) {
        await loadLanguage(language.toLowerCase());
        Prism.highlightElement(codeRef.current);
      }
    };
    
    highlightCode();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Map common language aliases to Prism language names
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    cs: 'csharp',
    'c++': 'cpp',
    'c#': 'csharp',
    yml: 'yaml',
    md: 'markdown',
    ps1: 'powershell',
  };

  const prismLanguage = languageMap[language.toLowerCase()] || language.toLowerCase() || 'text';

  return (
    <div className="code-block-container">
      <pre className={`code-block language-${prismLanguage}`}>
        <code 
          ref={codeRef} 
          className={`language-${prismLanguage}`}
        >
          {code}
        </code>
      </pre>
      <button
        className={`button--copy ${copied ? 'button--copied' : ''}`}
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}