"use client";

import { useState, useEffect, useRef } from "react";

import { fetchClaude } from "@/lib/claude";
import ButtonControl from "@/components/ButtonControl";

import "./PageDiagram.scss";

interface DiagramItem {
  id: string;
  title: string;
  body: string;
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  zIndex: number;
}

export default function PageDiagram() {
  const [inputValue, setInputValue] = useState("");
  const [axisTop, setAxisTop] = useState("ABSTRACT");
  const [axisBottom, setAxisBottom] = useState("CONCRETE");
  const [axisLeft, setAxisLeft] = useState("SIMPLE");
  const [axisRight, setAxisRight] = useState("COMPLEX");
  const [items, setItems] = useState<DiagramItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(0);
  const [loadingCoords, setLoadingCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const prompt = `Given the concept "${inputValue}" and a 2x2 diagram with these axes:
- Vertical axis: ${axisBottom} (bottom) to ${axisTop} (top)
- Horizontal axis: ${axisLeft} (left) to ${axisRight} (right)

Generate exactly 5 items related to "${inputValue}" that can be plotted on this diagram. For each item, provide:
1. A short title (2-5 words)
2. A brief description (1-2 sentences)
3. An x coordinate from -1 to 1 (where -1 is ${axisLeft} and 1 is ${axisRight})
4. A y coordinate from -1 to 1 (where -1 is ${axisBottom} and 1 is ${axisTop})

Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Item Title",
    "body": "Brief description.",
    "x": 0.5,
    "y": -0.3
  }
]`;

      const response = await fetchClaude({ prompt });

      // Extract JSON from response (in case Claude adds explanation text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const generatedItems = JSON.parse(jsonMatch[0]);

      // Add IDs and zIndex to items
      const itemsWithIds = generatedItems.map(
        (item: Omit<DiagramItem, "id" | "zIndex">, index: number) => ({
          ...item,
          id: `${Date.now()}-${index}`,
          zIndex: maxZIndex + index + 1,
        })
      );

      setItems(itemsWithIds);
      setMaxZIndex(maxZIndex + generatedItems.length);
    } catch (error) {
      console.error("Error generating items:", error);
      alert("Failed to generate items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert x,y coordinates (-1 to 1) to CSS percentage (0% to 100%)
  const getItemPosition = (x: number, y: number) => {
    const left = ((x + 1) / 2) * 100; // -1 to 1 -> 0 to 100
    const top = ((1 - y) / 2) * 100; // 1 to -1 -> 0 to 100 (inverted for CSS)
    return { left: `${left}%`, top: `${top}%` };
  };

  // Convert coordinates to percentage for display
  const coordsToPercent = (x: number, y: number) => {
    const xPercent = Math.round(((x + 1) / 2) * 100);
    const yPercent = Math.round(((y + 1) / 2) * 100);
    // return `${xPercent}% / ${yPercent}%`;

    return `(x: ${xPercent}, y: ${yPercent})`;
  };

  const handleItemClick = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, zIndex: maxZIndex + 1 } : item
      )
    );
    setMaxZIndex(prev => prev + 1);
  };

  const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handlePageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Page clicked", e.clientX, e.clientY);

    // Don't handle clicks on items, buttons, or form elements
    const target = e.target as HTMLElement;
    if (
      target.closest(".diagram-item") ||
      target.closest(".diagram-input-form") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      console.log("Click ignored - hit UI element");
      return;
    }

    if (!inputValue.trim()) {
      console.log("No input value");
      return;
    }

    if (isLoading) {
      console.log("Already loading");
      return;
    }

    const gridElement = document.querySelector(".diagram-grid") as HTMLElement;
    if (!gridElement) {
      console.log("Grid element not found");
      return;
    }

    const rect = gridElement.getBoundingClientRect();
    console.log("Grid bounds:", rect);

    // Calculate click position relative to grid (0 to 1)
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    // Convert to coordinate system (-1 to 1)
    const x = relativeX * 2 - 1; // 0-1 -> -1 to 1
    const y = 1 - relativeY * 2; // 0-1 -> 1 to -1 (inverted for y-axis)

    console.log("Coordinates:", { x, y, relativeX, relativeY });

    setIsLoading(true);
    setLoadingCoords({ x, y });

    try {
      const prompt = `Given the concept "${inputValue}" and a 2x2 diagram with these axes:
- Vertical axis: ${axisBottom} (bottom) to ${axisTop} (top)
- Horizontal axis: ${axisLeft} (left) to ${axisRight} (right)

Generate exactly 1 item related to "${inputValue}" that should be placed at coordinates x=${x.toFixed(2)}, y=${y.toFixed(2)} on this diagram.

For this item, provide:
1. A short title (2-5 words)
2. A brief description (1-2 sentences)

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Item Title",
  "body": "Brief description."
  }`;

      const response = await fetchClaude({ prompt });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const generatedItem = JSON.parse(jsonMatch[0]);

      // Add the new item with coordinates and zIndex
      const newItem: DiagramItem = {
        ...generatedItem,
        id: `${Date.now()}`,
        x,
        y,
        zIndex: maxZIndex + 1,
      };

      setItems(prevItems => [...prevItems, newItem]);
      setMaxZIndex(prev => prev + 1);
      console.log("Item added successfully:", newItem);
    } catch (error) {
      console.error("Error generating item:", error);
      alert("Failed to generate item. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingCoords(null);
    }
  };

  return (
    <div className="page-diagram" onClick={handlePageClick}>
      <div className="diagram-container">
        <div className="axis-label axis-label-top">{axisTop}</div>
        <div className="axis-label axis-label-left">{axisLeft}</div>
        <div className="axis-label axis-label-bottom">{axisBottom}</div>
        <div className="axis-label axis-label-right-opposite">{axisRight}</div>

        <div className="diagram-grid">
          <div className="axis-line axis-line-horizontal"></div>
          <div className="axis-line axis-line-vertical"></div>

          {loadingCoords && (
            <div
              className="diagram-loading-indicator"
              style={{
                left: `${((loadingCoords.x + 1) / 2) * 100}%`,
                top: `${((1 - loadingCoords.y) / 2) * 100}%`,
                zIndex: maxZIndex + 1,
              }}
            >
              Loading item...
            </div>
          )}

          {items.map(item => {
            const position = getItemPosition(item.x, item.y);
            return (
              <div
                key={item.id}
                className="diagram-item"
                style={{
                  left: position.left,
                  top: position.top,
                  zIndex: item.zIndex,
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="diagram-item-header">
                  <button
                    className="diagram-item-remove"
                    onClick={e => handleRemoveItem(item.id, e)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
                <h3 className="diagram-item-title">{item.title}</h3>
                <p className="diagram-item-body">{item.body}</p>
                <div className="diagram-item-footer">
                  <span className="diagram-item-coords">
                    {coordsToPercent(item.x, item.y)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="diagram-input-form">
          <form className="proto-form" onSubmit={handleSubmit}>
            <div className="proto-input-group">
              <input
                ref={inputRef}
                type="text"
                id="prompt-input"
                className="prompt-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter concept..."
                disabled={isLoading}
              />
            </div>
            <ButtonControl onClick={() => {}} disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </ButtonControl>
          </form>
        </div>
      </div>
    </div>
  );
}
