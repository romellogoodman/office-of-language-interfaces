"use client";

import { useState } from "react";
import ButtonControl from "@/components/ButtonControl";
import { fetchClaude } from "@/lib/claude";

interface GenerationControlsProps {
  initialText: string;
  generatePrompt: (currentText: string, generations: string[]) => string;
  model?: string;
}

export default function GenerationControls({
  initialText,
  generatePrompt,
  model = "claude-3-5-haiku-20241022",
}: GenerationControlsProps) {
  const [generations, setGenerations] = useState<string[]>([initialText]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dotCount, setDotCount] = useState(3);

  const currentText = generations[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < generations.length - 1;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDotCount(Math.floor(Math.random() * 4) + 3); // Random between 3-6
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

  return {
    currentText,
    controls: (
      <div className="generation-controls">
        <ButtonControl
          onClick={handlePrevious}
          className={!canGoPrevious ? "disabled" : ""}
        >
          previous
        </ButtonControl>
        <ButtonControl
          onClick={handleNext}
          className={!canGoNext ? "disabled" : ""}
        >
          next
        </ButtonControl>
        <ButtonControl
          onClick={handleGenerate}
          className={isGenerating ? "generating" : ""}
        >
          {isGenerating ? (
            <>
              generating
              <span className="dots">
                {Array.from({ length: dotCount }, (_, i) => (
                  <span key={i}>.</span>
                ))}
              </span>
            </>
          ) : (
            "generate"
          )}
        </ButtonControl>
      </div>
    ),
  };
}
