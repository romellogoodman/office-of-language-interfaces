# Diagram Page

An interactive 2x2 diagram for mapping a concept across two axes. All content is pre-written in `src/data/diagrams.json`; the page makes no API calls.

## Features

- **Pick a concept**: The input has a `<datalist>` of concept names. Submitting matches the typed value by name (trimmed, case-insensitive). A match resets both axes to their defaults and places the concept's first 5 items. No match shows a short line in the fineprint area, e.g. `No map for “x” yet. Try snacks, movies, music or programming languages.`
- **Cycle axes**: Clicking the top/bottom label cycles to the next vertical axis option; left/right cycles horizontal. Placed items stay and move to their positions under the new axes. Axis buttons are disabled until a concept is chosen.
- **Click to add**: Clicking empty grid space adds the not-yet-placed item nearest the click, at the item's own coordinates (not the click point). Does nothing once all items are placed.
- **Items**: Click to bring to front (z-index), remove with ×, and show their position as `(x, y)` percentages.

## Data (`src/data/diagrams.json`)

An array of concepts:

```json
{
  "name": "snacks",
  "vertical": [{ "top": "ABSTRACT", "bottom": "CONCRETE" }, "...3 total"],
  "horizontal": [{ "left": "SIMPLE", "right": "COMPLEX" }, "...3 total"],
  "items": [
    { "title": "Potato chips", "body": "...", "y": [-0.7, -0.8, -0.6], "x": [-0.8, -0.9, -0.7] }
  ]
}
```

- `y[i]` is the item's position (-1 bottom to 1 top) under `vertical[i]`.
- `x[j]` is the item's position (-1 left to 1 right) under `horizontal[j]`.
- Index 0 of each axis list is the site default: ABSTRACT/CONCRETE and SIMPLE/COMPLEX.
- To add a concept, append an entry with 3 vertical options, 3 horizontal options and items whose `x`/`y` arrays have one value per option. Add it to the placeholder text in `PageDiagram.tsx` too.

## File Structure

- `page.tsx` - Server component route handler
- `PageDiagram.tsx` - Client component with state management
- `PageDiagram.scss` - Component-specific styles
- `CLAUDE.md` - This file

## State

- `concept`: The selected concept (or `null`)
- `verticalIndex` / `horizontalIndex`: Current axis option for each axis
- `items`: Placed items as `{ index, zIndex }`, where `index` points into `concept.items`; coordinates are derived from the current axis indices
- `maxZIndex`: Stacking order counter
- `message`: Fineprint line shown when a concept has no map

## Styling

- Uses CSS tokens from `globals.scss`
- Full-screen absolute positioning (`100vh/100vw`)
- Items have fixed width (200px); only their `left`/`top`/`zIndex` are set inline because they are computed
