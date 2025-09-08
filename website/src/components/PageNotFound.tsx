"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import { GENERATE_ERROR_POEM_PROMPT } from "@/prompts/generate-error-poem";

const initialText = `The page you seek has wandered off,
Lost in the vast digital void,
Where broken links and missing files
Dance in the space between deployed.

No breadcrumbs mark the path you took,
No signposts point the way ahead,
Just empty space where content lived,
And error messages instead.

But every journey finds its end,
And every wanderer finds their way—
Return home where stories start,
And begin again today.`;

export default function PageNotFound() {
  const { currentText: poem, controls } = ButtonGenerate({
    initialText: initialText,
    prompt: GENERATE_ERROR_POEM_PROMPT,
  });

  return (
    <div className="main-content">
      <div className="not-found">
        <h1>404 Not Found</h1>

        {poem && (
          <div className="poem-result">
            <div className="poem-content">{poem}</div>
          </div>
        )}

        <div className="button-group">{controls}</div>
      </div>
    </div>
  );
}
