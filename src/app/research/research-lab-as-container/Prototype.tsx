"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import { GENERATE_RESEARCH_TAGLINE_PROMPT } from "@/prompts/generate-research-tagline";
// import "@/app/prototypes.scss";
import "../../prototypes.scss";

const initialGenerations = [
  "a research lab designing software that responds to language.",
  "a research lab exploring conversational interfaces that reimagine how humans and machines create meaning together.",
  "a research lab designing conversational interfaces that reimagine human-computer meaning-making.",
];

const initialText = initialGenerations[0];

export default function Prototype() {
  const { currentText, controls } = ButtonGenerate({
    initialText,
    initialGenerations,
    prompt: GENERATE_RESEARCH_TAGLINE_PROMPT,
  });

  return (
    <div className="proto-tagline">
      <div className="proto-tagline-text">
        <p>Office of Language Interfaces is {currentText}</p>
      </div>
      <div className="proto-tagline-controls">{controls}</div>
    </div>
  );
}
