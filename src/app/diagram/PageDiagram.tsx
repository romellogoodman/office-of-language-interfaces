"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import ButtonControl from "@/components/ButtonControl";
import diagrams from "@/data/diagrams.json";

import "./PageDiagram.scss";

interface ConceptItem {
  title: string;
  body: string;
  y: number[]; // -1 to 1 (bottom to top), one per vertical axis option
  x: number[]; // -1 to 1 (left to right), one per horizontal axis option
}

interface Concept {
  name: string;
  vertical: { top: string; bottom: string }[];
  horizontal: { left: string; right: string }[];
  items: ConceptItem[];
}

interface DiagramItem {
  index: number; // index into the concept's items
  zIndex: number;
}

const concepts = diagrams as Concept[];
const INITIAL_ITEM_COUNT = 5;

const conceptList = (() => {
  const names = concepts.map(concept => concept.name);
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
})();

export default function PageDiagram() {
  const [inputValue, setInputValue] = useState("");
  const [concept, setConcept] = useState<Concept | null>(null);
  const [verticalIndex, setVerticalIndex] = useState(0);
  const [horizontalIndex, setHorizontalIndex] = useState(0);
  const [items, setItems] = useState<DiagramItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const vertical = concept?.vertical[verticalIndex] ?? {
    top: "ABSTRACT",
    bottom: "CONCRETE",
  };
  const horizontal = concept?.horizontal[horizontalIndex] ?? {
    left: "SIMPLE",
    right: "COMPLEX",
  };

  const getCoords = (item: ConceptItem) => ({
    x: item.x[horizontalIndex],
    y: item.y[verticalIndex],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim().toLowerCase();
    if (!query) return;

    const match = concepts.find(c => c.name.toLowerCase() === query);
    if (!match) {
      setMessage(`No map for “${inputValue.trim()}” yet. Try ${conceptList}.`);
      return;
    }

    const count = Math.min(INITIAL_ITEM_COUNT, match.items.length);
    setConcept(match);
    setVerticalIndex(0);
    setHorizontalIndex(0);
    setItems(
      Array.from({ length: count }, (_, index) => ({
        index,
        zIndex: index + 1,
      }))
    );
    setMaxZIndex(count);
    setMessage("");
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
    return `(x: ${xPercent}, y: ${yPercent})`;
  };

  const handleItemClick = (index: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.index === index ? { ...item, zIndex: maxZIndex + 1 } : item
      )
    );
    setMaxZIndex(prev => prev + 1);
  };

  const handleRemoveItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prevItems => prevItems.filter(item => item.index !== index));
  };

  const handleCycleAxis = (axis: "vertical" | "horizontal") => {
    if (!concept) return;

    if (axis === "vertical") {
      setVerticalIndex(prev => (prev + 1) % concept.vertical.length);
    } else {
      setHorizontalIndex(prev => (prev + 1) % concept.horizontal.length);
    }
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't handle clicks on items, buttons, or form elements
    const target = e.target as HTMLElement;
    if (
      target.closest(".diagram-item") ||
      target.closest(".diagram-input-form") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    if (!concept || !gridRef.current) return;

    const placed = new Set(items.map(item => item.index));
    const unplaced = concept.items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => !placed.has(index));
    if (unplaced.length === 0) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;

    // Place the unplaced item nearest the click, at its own coordinates
    const nearest = unplaced.reduce((best, candidate) => {
      const a = getCoords(candidate.item);
      const b = getCoords(best.item);
      const distA = (a.x - x) ** 2 + (a.y - y) ** 2;
      const distB = (b.x - x) ** 2 + (b.y - y) ** 2;
      return distA < distB ? candidate : best;
    });

    setItems(prevItems => [
      ...prevItems,
      { index: nearest.index, zIndex: maxZIndex + 1 },
    ]);
    setMaxZIndex(prev => prev + 1);
  };

  return (
    <div className="page-diagram" onClick={handlePageClick}>
      <div className="diagram-container">
        <div className="axis-label axis-label-top">
          <ButtonControl
            onClick={() => handleCycleAxis("vertical")}
            disabled={!concept}
          >
            {vertical.top}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-left">
          <ButtonControl
            onClick={() => handleCycleAxis("horizontal")}
            disabled={!concept}
          >
            {horizontal.left}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-bottom">
          <ButtonControl
            onClick={() => handleCycleAxis("vertical")}
            disabled={!concept}
          >
            {vertical.bottom}
          </ButtonControl>
        </div>
        <div className="axis-label axis-label-right-opposite">
          <ButtonControl
            onClick={() => handleCycleAxis("horizontal")}
            disabled={!concept}
          >
            {horizontal.right}
          </ButtonControl>
        </div>

        <div className="diagram-grid" ref={gridRef}>
          <div className="axis-line axis-line-horizontal"></div>
          <div className="axis-line axis-line-vertical"></div>

          {concept &&
            items.map(({ index, zIndex }) => {
              const item = concept.items[index];
              const { x, y } = getCoords(item);
              const position = getItemPosition(x, y);
              return (
                <div
                  key={`${concept.name}-${index}`}
                  className="diagram-item"
                  style={{
                    left: position.left,
                    top: position.top,
                    zIndex,
                  }}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="diagram-item-header">
                    <span className="diagram-item-coords">
                      {coordsToPercent(x, y)}
                    </span>
                    <button
                      className="diagram-item-remove"
                      onClick={e => handleRemoveItem(index, e)}
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
                list="diagram-concepts"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Pick a concept to map (snacks, movies, music, programming languages)"
              />
              <datalist id="diagram-concepts">
                {concepts.map(c => (
                  <option key={c.name} value={c.name} />
                ))}
              </datalist>
            </div>
            <ButtonControl onClick={() => {}}>Submit</ButtonControl>
          </form>
          <p className="diagram-fineprint">
            {message ? (
              message
            ) : (
              <>
                Diagram by{" "}
                <Link href="/" className="diagram-fineprint-link">
                  Office of Language Interfaces
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
