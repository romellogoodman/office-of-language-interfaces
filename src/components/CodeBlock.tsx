"use client";

import React from "react";
import ButtonCopy from "./ButtonCopy";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({
  children,
  className = "",
}: CodeBlockProps) {
  const extractTextFromChildren = (node: React.ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return node.toString();
    }
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      if (element.props?.children) {
        return extractTextFromChildren(element.props.children);
      }
    }
    if (Array.isArray(node)) {
      return node.map(extractTextFromChildren).join("");
    }
    return node?.toString() || "";
  };

  const textContent = extractTextFromChildren(children);

  return (
    <div className={`code-block-container ${className}`}>
      <pre>
        <code>{children}</code>
      </pre>
      <ButtonCopy text={textContent} />
    </div>
  );
}
