"use client";

import { useState, useEffect } from "react";
import ButtonGenerate from "@/components/ButtonGenerate";
import pangrams from "@/data/pangrams.json";
import "../../prototypes.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PrototypeProps {}

// Pangrams are written ahead of time in src/data/pangrams.json.
const pool = pangrams.map(pangram => JSON.stringify(pangram));

interface WordData {
  word: string;
  partOfSpeech: string;
  definition: string;
  analysis: string;
}

export default function Prototype({}: PrototypeProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<{ [key: string]: WordData }>({});
  const initialData = pangrams[0];
  const [currentText, setCurrentText] = useState(initialData.pangram);

  const { currentText: generatedText, controls: generateControls } =
    ButtonGenerate({
      pool,
      initialCount: 2,
    });

  // Parse generatedText (JSON string) when it changes
  useEffect(() => {
    if (generatedText) {
      console.log("Generated JSON:", generatedText);

      try {
        const parsedData = JSON.parse(generatedText);
        const { pangram, words: wordList } = parsedData;

        // Update the current text display
        setCurrentText(pangram);

        // Store word data in a lookup object
        const wordDataMap: { [key: string]: WordData } = {};
        wordList.forEach((wordInfo: WordData) => {
          const cleanWord = wordInfo.word.toLowerCase().replace(/[^\w]/g, "");
          wordDataMap[cleanWord] = wordInfo;
        });
        setWordData(wordDataMap);
        setSelectedWord(null);
      } catch (error) {
        console.error("Error parsing generated JSON:", error);
      }
    }
  }, [generatedText]);

  // Initialize with initial data on mount
  useEffect(() => {
    const wordDataMap: { [key: string]: WordData } = {};
    initialData.words.forEach((wordInfo: WordData) => {
      const cleanWord = wordInfo.word.toLowerCase().replace(/[^\w]/g, "");
      wordDataMap[cleanWord] = wordInfo;
    });
    setWordData(wordDataMap);
  }, [initialData.words]);

  const words = currentText.split(/\s+/).filter(word => word.length > 0);

  // Auto-select the first word only on initial load
  useEffect(() => {
    if (currentText && words.length > 0 && selectedWord === null) {
      const firstWord = words[0];
      handleWordClick(firstWord);
    }
  }, [currentText, selectedWord]);

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
    setSelectedWord(cleanWord);
  };

  const selectedWordData = selectedWord ? wordData[selectedWord] : null;

  return (
    <div className="proto-word-explorer">
      <div className="proto-form">
        <div className="proto-word-grid">
          {words.map((word, index) => {
            const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
            return (
              <button
                key={index}
                className={`proto-word ${
                  selectedWord === cleanWord ? "selected" : ""
                }`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* <div className="button-control-group">
          <ButtonControl
            onClick={handleGenerate}
            icon={
              <RefreshCw
                size={14}
                style={{
                  transform: isGenerating ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s ease",
                }}
              />
            }
            className={isGenerating ? "generating" : ""}
          >
            generate pangram
          </ButtonControl>
        </div> */}

        {selectedWordData && (
          <div className="proto-analysis">
            <div className="proto-analysis-header">
              <h4>{selectedWord}</h4>
              <p className="proto-analysis-definition">
                ({selectedWordData.partOfSpeech}) {selectedWordData.definition}
              </p>
            </div>
            <p className="proto-analysis-text">{selectedWordData.analysis}</p>
          </div>
        )}

        {generateControls}
      </div>
    </div>
  );
}
