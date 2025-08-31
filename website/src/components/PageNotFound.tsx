"use client";

import GenerationControls from "@/components/GenerationControls";

const defaultPoem = `The page you seek has wandered off,
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
  const generatePrompt = (currentText: string, generations: string[]) => {
    const previousGenerations = generations.slice(0, -2).map((gen, i) => 
      `Generation ${i + 1}:\n${gen}`
    ).join('\n\n');
    
    const contextPrompt = previousGenerations ? 
      `Here are the previous poems for context:\n\n${previousGenerations}\n\n` : '';

    return `${contextPrompt}Write a short poem (3-4 stanzas, 12-16 lines) for a website's 404 error page. 

IMPORTANT: Return ONLY the poem text, no other words, explanations, or preamble. Do not include any links or call-to-action lines in the poem itself.

The poem should:

Tone & Style:
- Be lighthearted and friendly, not frustrating or negative
- Use accessible language that any web user would understand
- Have a conversational, welcoming feel

Content Requirements:
- Acknowledge that the user is lost or the page is missing
- Use web/digital metaphors (broken links, digital paths, cyber wilderness, etc.)
- Maintain an optimistic or playful tone about being lost
- Avoid technical jargon or blame toward the user

Structure:
- 3-4 stanzas with consistent rhythm
- End on a hopeful or whimsical note about the journey

Optional themes to consider:
- Journey/adventure metaphors
- Getting lost in nature vs. digital space
- Exploration and discovery
- Safe harbor/home as destination
- Maps, compasses, and navigation

The final poem should feel like a gentle, helpful guide rather than an error message, turning the 404 experience into something memorable and brand-friendly.

${previousGenerations ? 'Create a variation that explores different metaphors or themes while maintaining the same welcoming tone.' : ''}`;
  };

  const { currentText: poem, controls } = GenerationControls({
    initialText: defaultPoem,
    generatePrompt,
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

        <div className="button-group">
          {controls}
        </div>
      </div>
    </div>
  );
}