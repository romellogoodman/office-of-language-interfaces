"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import ButtonControl from "./ButtonControl";

// Generations are written ahead of time and live in src/data/. "generate"
// draws one the reader hasn't seen yet; once the pool runs out it starts
// drawing from the whole pool again (never repeating the one on screen).
const REVEAL_MS = 300;

interface ButtonGenerateProps {
  pool: string[];
  initialCount?: number;
}

export default function ButtonGenerate({
  pool,
  initialCount = 1,
}: ButtonGenerateProps) {
  const [generations, setGenerations] = useState<string[]>(
    pool.slice(0, initialCount)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentText = generations[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < generations.length - 1;

  const handleGenerate = () => {
    if (isGenerating) return;

    const unseen = pool.filter(text => !generations.includes(text));
    const choices = unseen.length
      ? unseen
      : pool.filter(text => text !== currentText);
    const next = choices[Math.floor(Math.random() * choices.length)];
    if (next === undefined) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newGenerations = [...generations, next];
      setGenerations(newGenerations);
      setCurrentIndex(newGenerations.length - 1);
      setIsGenerating(false);
    }, REVEAL_MS);
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
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
