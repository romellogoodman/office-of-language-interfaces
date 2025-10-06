"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { fetchClaude } from "@/lib/claude";
import ButtonControl from "@/components/ButtonControl";
import {
  GENERATE_ITEMS_PROMPT,
  REGENERATE_AXIS_PROMPT,
  GENERATE_SINGLE_ITEM_PROMPT,
} from "./prompts";

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
      const prompt = GENERATE_ITEMS_PROMPT({
        inputValue,
        axisBottom,
        axisTop,
        axisLeft,
        axisRight,
      });

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

  const handleRegenerateAxis = async (axis: "vertical" | "horizontal") => {
    if (isLoading || !inputValue.trim()) return;

    setIsLoading(true);

    try {
      const prompt = REGENERATE_AXIS_PROMPT({
        inputValue,
        axis,
        axisTop,
        axisBottom,
        axisLeft,
        axisRight,
      });

      const response = await fetchClaude({ prompt });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const newLabels = JSON.parse(jsonMatch[0]);

      if (axis === "vertical") {
        setAxisTop(newLabels.top);
        setAxisBottom(newLabels.bottom);
      } else {
        setAxisLeft(newLabels.left);
        setAxisRight(newLabels.right);
      }

      console.log(`Regenerated ${axis} axis:`, newLabels);

      // Clear existing items
      setItems([]);

      // Generate new items with the updated axes
      const generatePrompt = GENERATE_ITEMS_PROMPT({
        inputValue,
        axisBottom: axis === "vertical" ? newLabels.bottom : axisBottom,
        axisTop: axis === "vertical" ? newLabels.top : axisTop,
        axisLeft: axis === "horizontal" ? newLabels.left : axisLeft,
        axisRight: axis === "horizontal" ? newLabels.right : axisRight,
      });

      const generateResponse = await fetchClaude({ prompt: generatePrompt });

      // Extract JSON from response
      const generateJsonMatch = generateResponse.match(/\[[\s\S]*\]/);
      if (!generateJsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const generatedItems = JSON.parse(generateJsonMatch[0]);

      // Add IDs and zIndex to items
      const itemsWithIds = generatedItems.map(
        (item: Omit<DiagramItem, "id" | "zIndex">, index: number) => ({
          ...item,
          id: `${Date.now()}-${index}`,
          zIndex: index + 1,
        })
      );

      setItems(itemsWithIds);
      setMaxZIndex(generatedItems.length);
    } catch (error) {
      console.error("Error regenerating axis:", error);
      alert("Failed to regenerate axis. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      const prompt = GENERATE_SINGLE_ITEM_PROMPT({
        inputValue,
        axisBottom,
        axisTop,
        axisLeft,
        axisRight,
        x,
        y,
      });

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
        <div className="axis-label axis-label-top">
          <ButtonControl
            onClick={() => handleRegenerateAxis("vertical")}
            disabled={isLoading || !inputValue.trim()}
          >
            {axisTop}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-left">
          <ButtonControl
            onClick={() => handleRegenerateAxis("horizontal")}
            disabled={isLoading || !inputValue.trim()}
          >
            {axisLeft}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-bottom">
          <ButtonControl
            onClick={() => handleRegenerateAxis("vertical")}
            disabled={isLoading || !inputValue.trim()}
          >
            {axisBottom}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-right-opposite">
          <ButtonControl
            onClick={() => handleRegenerateAxis("horizontal")}
            disabled={isLoading || !inputValue.trim()}
          >
            {axisRight}
          </ButtonControl>
        </div>

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
                  <span className="diagram-item-coords">
                    {coordsToPercent(item.x, item.y)}
                  </span>
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
                placeholder="Enter a concept to map (e.g. snacks, movies, music)"
                disabled={isLoading}
              />
            </div>
            <ButtonControl onClick={() => {}} disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </ButtonControl>
          </form>
          <p className="diagram-fineprint">
            Diagram by{" "}
            <Link href="/" className="diagram-fineprint-link">
              Office of Language Interfaces
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
