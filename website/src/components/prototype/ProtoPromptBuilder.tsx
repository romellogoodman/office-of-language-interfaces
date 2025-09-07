"use client";

import { useState } from "react";
import ButtonIconRow from "../ButtonIconRow";
import IconClaude from "../Icons/IconClaude";
import IconOpenAI from "../Icons/IconOpenAI";
import IconMistral from "../Icons/IconMistral";
import "./prototypes.scss";

const CHAT_PLATFORMS = {
  claude: "https://claude.ai/new",
  openai: "https://chat.openai.com/",
  mistral: "https://chat.mistral.ai/chat/",
};

interface ProtoPromptBuilderProps {
  prompt?: string;
}

export default function ProtoPromptBuilder({
  prompt: initialPrompt,
}: ProtoPromptBuilderProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");

  const buildUrl = (platform: keyof typeof CHAT_PLATFORMS) => {
    const baseUrl = CHAT_PLATFORMS[platform];
    const encodedPrompt = encodeURIComponent(prompt);
    return `${baseUrl}?q=${encodedPrompt}`;
  };

  const openInPlatform = (platform: keyof typeof CHAT_PLATFORMS) => {
    window.open(buildUrl(platform), "_blank");
  };

  const icons = [
    {
      icon: <IconClaude size={14} />,
      onClick: () => openInPlatform("claude"),
    },
    {
      icon: <IconOpenAI size={14} />,
      onClick: () => openInPlatform("openai"),
    },
    {
      icon: <IconMistral size={14} />,
      onClick: () => openInPlatform("mistral"),
    },
  ];

  return (
    <div className="proto-prompt-builder">
      {/* <h3 className="proto-title">Proto: Try it yourself</h3> */}

      <div className="proto-form">
        <div className="proto-input-group">
          {/* <label className="proto-label" htmlFor="prompt-textarea">
            Write your prompt:
          </label> */}
          <textarea
            id="prompt-textarea"
            className="proto-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={3}
          />
        </div>

        <div className="proto-buttons">
          <ButtonIconRow text="open in" icons={icons} />
        </div>
      </div>
    </div>
  );
}
