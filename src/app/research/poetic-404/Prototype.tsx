"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import { GENERATE_ERROR_POEM_PROMPT } from "@/prompts/generate-error-poem";
import "../../prototypes.scss";

const initialPoems = [
  `In the vast digital wilderness you've found yourself wandering,
Where broken links scatter like fallen leaves,
And the page you sought has vanished into the ether,
Like a whisper carried away by cyber winds.

But fear not, fellow traveler of the web,
For every path that leads nowhere
Still teaches us something about the journey,
And getting lost often leads to discoveries.

The compass spins in this pixelated forest,
Where 404s bloom like strange flowers,
Each one a small reminder that
Even the internet has its mysteries.

So take a moment here in this digital clearing,
Let this unexpected stop become a brief respite,
Before you navigate back to familiar ground,
With new stories to tell of the paths less traveled.`,
];

export default function Prototype() {
  // ButtonGenerate hook for poem generation
  const { currentText: generatedPoem, controls: generateControls } =
    ButtonGenerate({
      initialText: initialPoems[0],
      initialGenerations: initialPoems,
      prompt: GENERATE_ERROR_POEM_PROMPT,
      model: "claude-3-5-haiku-20241022",
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
