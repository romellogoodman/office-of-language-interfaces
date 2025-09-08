"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { fetchClaude } from "@/lib/claude";
import ButtonControl from "./ButtonControl";

interface ButtonGenerateProps {
  initialText: string;
  generatePrompt: (currentText: string, generations: string[]) => string;
  model?: string;
}

export default function ButtonGenerate({
  initialText,
  generatePrompt,
  model = "claude-3-5-haiku-20241022",
}: ButtonGenerateProps) {
  const [generations, setGenerations] = useState<string[]>([initialText]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentText = generations[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < generations.length - 1;

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const prompt = generatePrompt(currentText, generations);

      const response = await fetchClaude({
        prompt,
        model,
      });

      const newGenerations = [...generations, response];
      setGenerations(newGenerations);
      setCurrentIndex(newGenerations.length - 1);
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const refreshIconStyle = {
    transform: isGenerating ? "rotate(180deg)" : "none",
    transition: "transform 0.3s ease",
  };

  return {
    currentText,
    controls: (
      <div className="button-control-group">
        <ButtonControl
          onClick={handleGenerate}
          icon={<RefreshCw size={14} style={refreshIconStyle} />}
          className={isGenerating ? "generating" : ""}
        >
          generate
        </ButtonControl>
        <ButtonControl
          onClick={handlePrevious}
          icon={<ArrowLeft size={14} />}
          className={!canGoPrevious ? "disabled" : ""}
        >
          previous
        </ButtonControl>
        <ButtonControl
          onClick={handleNext}
          icon={<ArrowRight size={14} />}
          className={!canGoNext ? "disabled" : ""}
        >
          next
        </ButtonControl>
      </div>
    ),
  };
}
