"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { fetchClaude } from "@/lib/claude";

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
  const [dotCount, setDotCount] = useState(3);
  const [animationType, setAnimationType] = useState<"fade" | "bounce">("fade");

  const currentText = generations[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < generations.length - 1;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDotCount(Math.floor(Math.random() * 4) + 3); // Random between 3-6
    setAnimationType(Math.random() < 0.5 ? "fade" : "bounce"); // Random animation

    const USE_MOCK = false; // Set to false to use real API

    try {
      if (USE_MOCK) {
        // Mock delay for testing animations
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse =
          "This is a mock response for testing the animations.";
        const newGenerations = [...generations, mockResponse];
        setGenerations(newGenerations);
        setCurrentIndex(newGenerations.length - 1);
      } else {
        const prompt = generatePrompt(currentText, generations);

        const response = await fetchClaude({
          prompt,
          model,
        });

        const newGenerations = [...generations, response];
        setGenerations(newGenerations);
        setCurrentIndex(newGenerations.length - 1);
      }
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
        <button className="generation-button">
          <span className="generation-text">
            {isGenerating ? (
              <>
                generating
                <span className={`dots ${animationType}-animation`}>
                  {Array.from({ length: dotCount }, (_, i) => (
                    <span key={i}>.</span>
                  ))}
                </span>
              </>
            ) : (
              "generate"
            )}
          </span>
          <div className="generation-icons">
            <ArrowLeft
              size={14}
              onClick={handlePrevious}
              style={{
                opacity: !canGoPrevious ? 0.3 : 1,
                cursor: !canGoPrevious ? "default" : "pointer",
              }}
            />
            <ArrowRight
              size={14}
              onClick={handleNext}
              style={{
                opacity: !canGoNext ? 0.3 : 1,
                cursor: !canGoNext ? "default" : "pointer",
              }}
            />
            <RefreshCw
              size={14}
              onClick={handleGenerate}
              style={{
                cursor: isGenerating ? "default" : "pointer",
                transform: isGenerating ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
        </button>
      </div>
    ),
  };
}
