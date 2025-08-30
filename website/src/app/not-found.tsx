"use client";

import { useState } from "react";

const model = "claude-3-5-haiku-20241022";
const prompt = `
Write a short poem (3-4 stanzas, 12-16 lines) for a website's 404 error page. 

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

The final poem should feel like a gentle, helpful guide rather than an error message, turning the 404 experience into something memorable and brand-friendly.`;

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

export default function NotFound() {
  const [poem, setPoem] = useState(defaultPoem);
  const [loading, setLoading] = useState(false);

  const generatePoem = async () => {
    setPoem(""); // Clear current poem
    setLoading(true);
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poem");
      }

      const data = await response.json();

      setPoem(data.response);
    } catch (error) {
      console.error("Error generating poem:", error);
      setPoem(
        "Sorry, couldn't generate a poem right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <button
            onClick={generatePoem}
            disabled={loading}
            className="generate-poem-btn"
          >
            {loading
              ? "Generating..."
              : poem
              ? "Regenerate"
              : "Generate a poem"}
          </button>
          <a href="/" className="home-btn">
            Return home
          </a>
        </div>
      </div>
    </div>
  );
}
