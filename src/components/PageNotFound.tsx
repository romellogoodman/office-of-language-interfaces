"use client";

import ButtonGenerate from "@/components/ButtonGenerate";
import poems from "@/data/error-poems.json";

export default function PageNotFound() {
  const { currentText: poem, controls } = ButtonGenerate({
    pool: poems,
    initialCount: 2,
  });

  return (
    <div className="main-content">
      <div className="not-found">
        {/* <h1>404 Not Found</h1> */}

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
