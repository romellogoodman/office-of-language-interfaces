"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import { GENERATE_ERROR_POEM_PROMPT } from "@/prompts/generate-error-poem";

const poem1 = `The page you seek has wandered off,
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

const poem2 = `Wandering lost in digital space,
Where broken links leave not a trace,
This page, a wilderness unknown,
A pathway briefly overgrown.

The map has shifted 'neath your feet,
Where web and wonder sometimes meet,
A gentle detour from your quest,
An unexpected moment's rest.

But fear not, traveler of the screen,
This path will lead you back, I glean,
Just click the compass rose above,
And find your way with gentle love.`;

const initialGenerations = [poem1, poem2];

export default function PageNotFound() {
  const { currentText: poem, controls } = ButtonGenerate({
    initialText: poem1,
    initialGenerations,
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
