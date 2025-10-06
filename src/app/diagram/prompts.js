// Shared prompt fragments
const DIAGRAM_CONTEXT = ({
  inputValue,
  axisBottom,
  axisTop,
  axisLeft,
  axisRight,
}) =>
  `Given the concept "${inputValue}" and a 2x2 diagram with these axes:
- Vertical axis: ${axisBottom} (bottom) to ${axisTop} (top)
- Horizontal axis: ${axisLeft} (left) to ${axisRight} (right)`;

const COORDINATE_SYSTEM = ({ axisBottom, axisTop, axisLeft, axisRight }) =>
  `3. An x coordinate from -1 to 1 (where -1 is ${axisLeft} and 1 is ${axisRight})
4. A y coordinate from -1 to 1 (where -1 is ${axisBottom} and 1 is ${axisTop})`;

const ITEM_FORMAT_ARRAY = `Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Item Title",
    "body": "Brief description.",
    "x": 0.5,
    "y": -0.3
  }
]`;

const ITEM_FORMAT_OBJECT = `Return ONLY a valid JSON object with this exact structure:
{
  "title": "Item Title",
  "body": "Brief description."
}`;

// Main prompt functions
export const GENERATE_ITEMS_PROMPT = ({
  inputValue,
  axisBottom,
  axisTop,
  axisLeft,
  axisRight,
}) => `${DIAGRAM_CONTEXT({ inputValue, axisBottom, axisTop, axisLeft, axisRight })}

Generate exactly 5 items related to "${inputValue}" that can be plotted on this diagram. For each item, provide:
1. A short title (2-5 words)
2. A brief description (1-2 sentences)
${COORDINATE_SYSTEM({ axisBottom, axisTop, axisLeft, axisRight })}

${ITEM_FORMAT_ARRAY}`;

export const REGENERATE_AXIS_PROMPT = ({
  inputValue,
  axis,
  axisTop,
  axisBottom,
  axisLeft,
  axisRight,
}) => {
  const axisType =
    axis === "vertical" ? "vertical (top/bottom)" : "horizontal (left/right)";
  const currentLabels =
    axis === "vertical"
      ? `${axisTop} (top) and ${axisBottom} (bottom)`
      : `${axisLeft} (left) and ${axisRight} (right)`;

  return `Generate two opposite single-word labels for a ${axisType} axis on a 2x2 diagram for mapping the concept "${inputValue}".

Current labels: ${currentLabels}

Generate new, different labels that represent opposing concepts specifically relevant to "${inputValue}". The labels should help categorize and map different aspects or examples of "${inputValue}".

IMPORTANT: Each label must be a SINGLE WORD only (no hyphens, no multiple words).

For example:
- For "snacks": Healthy/Unhealthy, Sweet/Savory, Crunchy/Soft
- For "programming languages": Simple/Complex, Old/New, Fast/Slow
- For "movies": Popular/Obscure, Action/Drama, Happy/Sad

Return ONLY a valid JSON object with this exact structure:
{
  "${axis === "vertical" ? "top" : "left"}": "FirstLabel",
  "${axis === "vertical" ? "bottom" : "right"}": "SecondLabel"
}`;
};

export const GENERATE_SINGLE_ITEM_PROMPT = ({
  inputValue,
  axisBottom,
  axisTop,
  axisLeft,
  axisRight,
  x,
  y,
}) => `${DIAGRAM_CONTEXT({ inputValue, axisBottom, axisTop, axisLeft, axisRight })}

Generate exactly 1 item related to "${inputValue}" that should be placed at coordinates x=${x.toFixed(2)}, y=${y.toFixed(2)} on this diagram.

For this item, provide:
1. A short title (2-5 words)
2. A brief description (1-2 sentences)

${ITEM_FORMAT_OBJECT}`;
