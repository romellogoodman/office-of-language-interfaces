"use client";

import { ReactElement } from "react";

interface IconAction {
  icon: ReactElement;
  onClick: () => void;
  disabled?: boolean;
}

interface ButtonIconRowProps {
  text: string;
  icons: IconAction[];
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export default function ButtonIconRow({
  text,
  icons,
  isLoading = false,
  loadingText,
  className = "",
}: ButtonIconRowProps) {
  return (
    <button className={`generation-button ${className}`}>
      <span className="generation-text">
        {isLoading && loadingText ? loadingText : text}
      </span>
      <div className="generation-icons">
        {icons.map((iconAction, index) => (
          <div
            key={index}
            onClick={iconAction.disabled ? undefined : iconAction.onClick}
            style={{
              opacity: iconAction.disabled ? 0.3 : 1,
              cursor: iconAction.disabled ? "default" : "pointer",
            }}
          >
            {iconAction.icon}
          </div>
        ))}
      </div>
    </button>
  );
}
