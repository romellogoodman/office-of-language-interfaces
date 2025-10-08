"use client";

import { useState, useEffect } from "react";
import ButtonGenerate from "@/components/ButtonGenerate";
import "../../prototypes.scss";

interface PrototypeProps {
  text?: string;
}

const initialPangrams = [
  {
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
  },
  {
    pangram: "Jackdaws love my big sphinx of quartz, revealing deep patterns.",
    words: [
      {
        word: "Jackdaws",
        partOfSpeech: "noun",
        definition:
          "Intelligent black and gray European corvid birds known for their problem-solving abilities",
        analysis:
          "Jackdaws represent adaptive intelligence in nature, symbolizing cognitive flexibility and community-oriented behavior. They're chosen here as an unexpected subject to introduce complexity.",
      },
      {
        word: "love",
        partOfSpeech: "verb",
        definition:
          "To feel deep affection, care, or strong emotional attachment",
        analysis:
          "A universal emotional connector that transcends linguistic boundaries, 'love' represents human and natural interconnectedness. Its placement suggests an emotional undercurrent to scientific observation.",
      },
      {
        word: "my",
        partOfSpeech: "pronoun",
        definition:
          "Possessive form indicating personal ownership or relationship",
        analysis:
          "Introduces a subjective perspective, implying personal agency and individual perception. Creates intimacy between the observer and the observed phenomenon.",
      },
      {
        word: "big",
        partOfSpeech: "adjective",
        definition: "Of considerable size, extent, or magnitude",
        analysis:
          "Suggests scale and grandeur, hinting at the expansive nature of scientific or philosophical inquiry. Contrasts with the specific precision of 'sphinx' and 'quartz'.",
      },
      {
        word: "sphinx",
        partOfSpeech: "noun",
        definition:
          "Mythical creature with a lion's body and human head, symbolizing mystery and wisdom",
        analysis:
          "Represents enigmatic knowledge and the human quest for understanding. Bridges mythological symbolism with scientific curiosity.",
      },
      {
        word: "of",
        partOfSpeech: "preposition",
        definition: "Indicating connection, belonging, or composition",
        analysis:
          "A subtle linguistic connector that establishes relationships between concepts. Creates grammatical coherence and conceptual flow.",
      },
      {
        word: "quartz",
        partOfSpeech: "noun",
        definition:
          "Common rock-forming mineral composed of silicon and oxygen",
        analysis:
          "Represents scientific precision and natural complexity. Symbolizes the fundamental building blocks of geological and material understanding.",
      },
      {
        word: "revealing",
        partOfSpeech: "verb",
        definition: "Making known something previously hidden or unknown",
        analysis:
          "Emphasizes the transformative power of observation and understanding. Suggests that careful perception can uncover deeper patterns and meanings.",
      },
      {
        word: "deep",
        partOfSpeech: "adjective",
        definition: "Extending far down from the surface; profound or intense",
        analysis:
          "Implies layers of complexity beyond immediate perception. Suggests intellectual and existential exploration beyond surface-level understanding.",
      },
      {
        word: "patterns",
        partOfSpeech: "noun",
        definition:
          "Repeated decorative or natural designs; systematic arrangements",
        analysis:
          "Represents the human drive to find order and meaning in complexity. Suggests that understanding emerges from recognizing interconnected structures.",
      },
    ],
  },
  {
    pangram: "Jovial whizz foxes pack my big quest with zeal.",
    words: [
      {
        word: "Jovial",
        partOfSpeech: "adjective",
        definition: "cheerful and friendly",
        analysis:
          "Reflects a positive emotional state of lightheartedness. Sets an upbeat tone for the entire sentence.",
      },
      {
        word: "whizz",
        partOfSpeech: "verb",
        definition: "move quickly with a sharp or sudden movement",
        analysis:
          "Implies rapid, dynamic motion that adds kinetic energy to the sentence. Creates a sense of swift, purposeful action.",
      },
      {
        word: "foxes",
        partOfSpeech: "noun",
        definition: "omnivorous mammals of the dog family",
        analysis:
          "Introduces a specific animal subject with connotations of cunning and intelligence. Provides a vivid image of agile creatures.",
      },
      {
        word: "pack",
        partOfSpeech: "verb",
        definition: "fill a container or space with items",
        analysis:
          "Suggests organization and preparation. Implies deliberate gathering or arrangement of resources.",
      },
      {
        word: "my",
        partOfSpeech: "pronoun",
        definition: "possessive form of 'I'",
        analysis:
          "Establishes personal ownership and narrative perspective. Creates intimacy in the sentence.",
      },
      {
        word: "big",
        partOfSpeech: "adjective",
        definition: "of considerable size or extent",
        analysis:
          "Emphasizes scale and significance. Suggests expansiveness beyond ordinary dimensions.",
      },
      {
        word: "quest",
        partOfSpeech: "noun",
        definition: "a long or arduous search for something",
        analysis:
          "Introduces a narrative of exploration and purpose. Elevates the sentence from mere description to a heroic journey.",
      },
      {
        word: "with",
        partOfSpeech: "preposition",
        definition: "accompanied by; having",
        analysis:
          "Connects different elements of the sentence. Indicates companionship or instrumental association.",
      },
      {
        word: "zeal",
        partOfSpeech: "noun",
        definition: "great energy or enthusiasm",
        analysis:
          "Concludes the sentence with passionate intensity. Suggests complete commitment to the described action.",
      },
    ],
  },
];

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

export default function Prototype({}: PrototypeProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<{ [key: string]: WordData }>({});
  const initialData = initialPangrams[0];
  const [currentText, setCurrentText] = useState(initialData.pangram);

  // ButtonGenerate with existing pangram prompt and additional initial generations
  const { currentText: generatedText, controls: generateControls } =
    ButtonGenerate({
      initialText: JSON.stringify(initialData),
      initialGenerations: initialPangrams.map(pangram =>
        JSON.stringify(pangram)
      ),
      generatePrompt: () => PANGRAM_PROMPT,
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
