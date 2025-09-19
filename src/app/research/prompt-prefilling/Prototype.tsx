"use client";

import { useState } from "react";
import ButtonControl from "@/components/ButtonControl";
import IconClaude from "@/components/Icons/IconClaude";
import IconOpenAI from "@/components/Icons/IconOpenAI";
import IconMistral from "@/components/Icons/IconMistral";
import { MessageSquare } from "lucide-react";
import "../../prototypes.scss";

const CHAT_PLATFORMS = {
  claude: "https://claude.ai/new",
  openai: "https://chat.openai.com/",
  mistral: "https://chat.mistral.ai/chat/",
  t3: "https://t3.chat/new",
};

interface PrototypeProps {
  prompt?: string;
}

export default function Prototype({ prompt: initialPrompt }: PrototypeProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");

  const buildUrl = (platform: keyof typeof CHAT_PLATFORMS) => {
    const baseUrl = CHAT_PLATFORMS[platform];
    const encodedPrompt = encodeURIComponent(prompt);
    return `${baseUrl}?q=${encodedPrompt}`;
  };

  const openInPlatform = (platform: keyof typeof CHAT_PLATFORMS) => {
    window.open(buildUrl(platform), "_blank");
  };

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
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={3}
          />
        </div>

        <div className="button-control-group">
          <ButtonControl
            onClick={() => openInPlatform("claude")}
            icon={<IconClaude size={14} />}
          >
            Claude
          </ButtonControl>
          <ButtonControl
            onClick={() => openInPlatform("openai")}
            icon={<IconOpenAI size={14} />}
          >
            ChatGPT
          </ButtonControl>
          <ButtonControl
            onClick={() => openInPlatform("mistral")}
            icon={<IconMistral size={14} />}
          >
            Mistral
          </ButtonControl>
          <ButtonControl
            onClick={() => openInPlatform("t3")}
            icon={<MessageSquare size={14} />}
          >
            T3 Chat
          </ButtonControl>
        </div>
      </div>
    </div>
  );
}
