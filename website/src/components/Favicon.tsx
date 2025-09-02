"use client";

import { useEffect } from "react";

interface FaviconProps {
  color?: string | string[];
}

const generateFavicon = (color: string | string[] = "#85c7a3") => {
  const svgContent = Array.isArray(color)
    ? `
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        ${color
          .map((col, index) => {
            const percent = Math.floor(100 / color.length) * (index + 1);
            return `<stop offset="${percent}%" stop-color="${col}" />`;
          })
          .join("")}
      </linearGradient>
      <rect x="0" y="0" height="16" width="16" fill="url('#gradient')" />
    `
    : `
      <rect x="0" y="0" height="16" width="16" fill="${color}" />
    `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      ${svgContent}
    </svg>
  `;
};

export default function Favicon({ color = "#85c7a3" }: FaviconProps) {
  const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color)
  )}`;

  useEffect(() => {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconDataUrl;
    document.head.appendChild(link);

    // Cleanup
    return () => {
      const currentFavicon = document.querySelector(`link[href="${faviconDataUrl}"]`);
      if (currentFavicon) {
        currentFavicon.remove();
      }
    };
  }, [faviconDataUrl]);

  return null; // This component doesn't render anything
}
