# Diagram Page

An interactive 2x2 diagram mapping tool for visualizing concepts across two axes.

## Overview

The Diagram page allows users to map ideas, concepts, or items across a customizable 2x2 grid system. It uses AI to generate contextually relevant items based on user input and their position on the diagram.

## Features

- **Custom Axes**: Default axes are ABSTRACT/CONCRETE (vertical) and SIMPLE/COMPLEX (horizontal)
- **AI-Powered Generation**: Generate items using Claude API based on concept input
- **Click-to-Create**: Click anywhere on the page to generate a single item at that location
- **Bulk Generation**: Submit form to generate 5 items automatically plotted across axes
- **Interactive Items**:
  - Click items to bring them to the front (z-index management)
  - Remove items with × button
  - View coordinate position as percentages
- **Loading States**: Visual indicator shows "Loading item..." at click coordinates during generation

## Technical Architecture

### File Structure

- `page.tsx` - Server component route handler
- `PageDiagram.tsx` - Main client component with state management
- `PageDiagram.scss` - Component-specific styles
- `claude.md` - This documentation file

### Coordinate System

- Uses normalized coordinates: `-1 to 1` range
- X-axis: `-1` (left/SIMPLE) to `1` (right/COMPLEX)
- Y-axis: `-1` (bottom/CONCRETE) to `1` (top/ABSTRACT)
- Converts to CSS percentages for positioning

### State Management

- `inputValue`: Current concept being mapped
- `items`: Array of diagram items with coordinates and z-index
- `isLoading`: Loading state for API calls
- `loadingCoords`: Tracks click position during generation
- `maxZIndex`: Manages item stacking order

### AI Integration

- Uses `/api/claude` endpoint via `fetchClaude()`
- Generates JSON responses with item structure:
  ```json
  {
    "title": "Item Title",
    "body": "Brief description",
    "x": 0.5,
    "y": -0.3
  }
  ```

## Usage

1. Enter a concept in the input field (e.g., "snacks", "programming languages")
2. Either:
   - Click "Submit" to generate 5 items automatically
   - Click anywhere on the page to create a single item at that location
3. Click items to bring them to front
4. Remove items using the × button

## Styling

- Follows prototype design patterns from `prototypes.scss`
- Uses CSS tokens from `globals.scss`
- Full-screen absolute positioning (`100vh/100vw`)
- Items have fixed width (200px) with responsive positioning
- Pointer cursor indicates clickable areas
