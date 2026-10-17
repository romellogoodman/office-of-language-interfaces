"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import taglines from "@/data/research-taglines.json";
// import "@/app/prototypes.scss";
import "../../prototypes.scss";

export default function Prototype() {
  const { currentText, controls } = ButtonGenerate({
    pool: taglines,
    initialCount: 3,
  });

  return (
    <div className="proto-tagline">
      <div className="proto-tagline-text">
        <p>Office of Language Interfaces is {currentText}</p>
      </div>
      <div className="proto-tagline-controls">{controls}</div>
    </div>
  );
}
