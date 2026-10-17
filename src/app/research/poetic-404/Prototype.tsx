"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import poems from "@/data/error-poems.json";
import "../../prototypes.scss";

// Start on the poem this research post was written around.
const pool = [...poems.slice(2), ...poems.slice(0, 2)];

export default function Prototype() {
  // ButtonGenerate hook for poem generation
  const { currentText: generatedPoem, controls: generateControls } =
    ButtonGenerate({
      pool,
    });

  return (
    <div className="proto-poem-generator">
      <div className="proto-form">
        <div className="proto-poem-display">
          {generatedPoem.split("\n").map((line, index) => (
            <p key={index} className="proto-poem-line">
              {line || "\u00A0"} {/* Non-breaking space for empty lines */}
            </p>
          ))}
        </div>

        {generateControls}
      </div>
    </div>
  );
}
