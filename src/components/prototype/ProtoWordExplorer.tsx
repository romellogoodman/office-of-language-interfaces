"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import ButtonControl from "../ButtonControl";
import { fetchClaude } from "@/lib/claude";
import "./prototypes.scss";

interface ProtoWordExplorerProps {
  text?: string;
}

const initialData = {
  pangram: "The quick brown fox jumps over the lazy dog",
  words: [
    {
      word: "The",
      partOfSpeech: "article",
      definition: "Used to specify a particular noun as known or understood",
      analysis:
        "The definite article establishes the fox as a specific character rather than any fox, creating narrative focus and immediacy.",
    },
    {
      word: "quick",
      partOfSpeech: "adjective",
      definition: "Moving fast or doing something in a short time",
      analysis:
        "This descriptor emphasizes agility and swiftness, contrasting sharply with the laziness that follows later in the sentence.",
    },
    {
      word: "brown",
      partOfSpeech: "adjective",
      definition: "Of a color produced by mixing red, yellow, and blue",
      analysis:
        "The earthy color grounds the fox in natural realism while providing visual specificity that makes the scene more vivid.",
    },
    {
      word: "fox",
      partOfSpeech: "noun",
      definition: "A carnivorous mammal with a pointed muzzle and bushy tail",
      analysis:
        "The fox serves as the active protagonist, embodying cunning and energy in folklore traditions across cultures.",
    },
    {
      word: "jumps",
      partOfSpeech: "verb",
      definition: "Pushes oneself off a surface using the legs and feet",
      analysis:
        "This dynamic action word creates the central movement of the sentence, suggesting both playfulness and athletic prowess.",
    },
    {
      word: "over",
      partOfSpeech: "preposition",
      definition: "Extending directly upward from; above",
      analysis:
        "This spatial relationship word creates the dramatic arc of the action, suggesting triumph and superiority over the obstacle below.",
    },
    {
      word: "the",
      partOfSpeech: "article",
      definition: "Used to specify a particular noun as known or understood",
      analysis:
        "The second definite article introduces the target of the fox's leap, creating narrative symmetry with the opening.",
    },
    {
      word: "lazy",
      partOfSpeech: "adjective",
      definition: "Unwilling to work or use energy; showing a lack of effort",
      analysis:
        "This character trait creates a moral and energetic contrast, positioning the dog as passive while the fox remains active.",
    },
    {
      word: "dog",
      partOfSpeech: "noun",
      definition: "A domesticated carnivorous mammal typically kept as a pet",
      analysis:
        "The dog represents domesticity and rest, serving as both physical obstacle and symbolic counterpoint to the fox's wild energy.",
    },
  ],
};

const PANGRAM_PROMPT = `Generate a creative pangram (a sentence that uses every letter of the alphabet at least once) along with analysis for each word.

Return only valid JSON in this exact format:

{
  "pangram": "your pangram sentence here",
  "words": [
    {
      "word": "word1",
      "partOfSpeech": "noun/verb/adjective/etc",
      "definition": "dictionary definition",
      "analysis": "1-2 sentence contextual analysis"
    },
    {
      "word": "word2",
      "partOfSpeech": "noun/verb/adjective/etc", 
      "definition": "dictionary definition",
      "analysis": "1-2 sentence contextual analysis"
    }
  ]
}

Requirements:
- Make the pangram interesting, poetic, or meaningful
- Provide concise dictionary definitions
- Include insightful contextual analysis for each word
- Return ONLY the JSON, no other text`;

interface WordData {
  word: string;
  partOfSpeech: string;
  definition: string;
  analysis: string;
}

export default function ProtoWordExplorer({
  text: initialText,
}: ProtoWordExplorerProps) {
  // Initialize with provided data
  const initializeWordData = () => {
    const wordDataMap: { [key: string]: WordData } = {};
    initialData.words.forEach((wordInfo: WordData) => {
      const cleanWord = wordInfo.word.toLowerCase().replace(/[^\w]/g, "");
      wordDataMap[cleanWord] = wordInfo;
    });
    return wordDataMap;
  };

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<{ [key: string]: WordData }>(
    initializeWordData()
  );

  const [currentText, setCurrentText] = useState(
    initialText || initialData.pangram
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const words = currentText.split(/\s+/).filter(word => word.length > 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSelectedWord(null);
    setWordData({});

    try {
      const response = await fetchClaude({
        prompt: PANGRAM_PROMPT,
        model: "claude-3-5-haiku-20241022",
      });

      const parsedResponse = JSON.parse(response);
      const { pangram, words: wordList } = parsedResponse;

      console.log("response", JSON.stringify(parsedResponse));

      setCurrentText(pangram);

      // Store word data in a lookup object
      const wordDataMap: { [key: string]: WordData } = {};
      wordList.forEach((wordInfo: WordData) => {
        const cleanWord = wordInfo.word.toLowerCase().replace(/[^\w]/g, "");
        wordDataMap[cleanWord] = wordInfo;
      });
      setWordData(wordDataMap);
    } catch (error) {
      console.error("Error generating pangram:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run first generation on mount
  // useEffect(() => {
  //   if (!initialText) {
  //     handleGenerate();
  //   }
  // }, []);

  // Auto-select the first word when text changes
  useEffect(() => {
    if (currentText && words.length > 0) {
      const firstWord = words[0];
      handleWordClick(firstWord);
    }
  }, [currentText]);

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

        <div className="button-control-group">
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
            generate
          </ButtonControl>
        </div>

        {selectedWordData && (
          <div className="proto-analysis">
            <div className="proto-analysis-header">
              <h4>{selectedWord}</h4>
            </div>
            <p className="proto-analysis-text">
              ({selectedWordData.partOfSpeech}) {selectedWordData.definition}
            </p>
            <p className="proto-analysis-text">{selectedWordData.analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
}
