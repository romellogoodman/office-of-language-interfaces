"use client";

import { useEffect } from "react";

interface FaviconProps {
  color?: string | string[];
}

const generateFavicon = (
  color: string | string[] = "#85c7a3",
  size: number = 16
) => {
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
      <rect x="0" y="0" height="${size}" width="${size}" fill="url('#gradient')" />
    `
    : `
      <rect x="0" y="0" height="${size}" width="${size}" fill="${color}" />
    `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      ${svgContent}
    </svg>
  `;
};

export default function Favicon({ color = "#85c7a3" }: FaviconProps) {
  const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color)
  )}`;

  // Generate Apple Touch Icons in different sizes
  const appleTouchIcon180 = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color, 180)
  )}`;
  const appleTouchIcon152 = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color, 152)
  )}`;
  const appleTouchIcon120 = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color, 120)
  )}`;
  const appleTouchIcon76 = `data:image/svg+xml,${encodeURIComponent(
    generateFavicon(color, 76)
  )}`;

  useEffect(() => {
    // Remove existing favicon and Apple Touch Icons
    const existingFavicon = document.querySelector('link[rel="icon"]');
    const existingAppleIcons = document.querySelectorAll(
      'link[rel="apple-touch-icon"]'
    );

    if (existingFavicon) {
      existingFavicon.remove();
    }
    existingAppleIcons.forEach(icon => icon.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = faviconDataUrl;
    document.head.appendChild(link);

    // Add Apple Touch Icons
    const appleIconSizes = [
      { size: "180x180", href: appleTouchIcon180 },
      { size: "152x152", href: appleTouchIcon152 },
      { size: "120x120", href: appleTouchIcon120 },
      { size: "76x76", href: appleTouchIcon76 },
    ];

    appleIconSizes.forEach(({ size, href }) => {
      const appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      appleIcon.sizes = size;
      appleIcon.href = href;
      document.head.appendChild(appleIcon);
    });

    // Cleanup
    return () => {
      const currentFavicon = document.querySelector(
        `link[href="${faviconDataUrl}"]`
      );
      if (currentFavicon) {
        currentFavicon.remove();
      }

      // Clean up Apple Touch Icons
      [
        appleTouchIcon180,
        appleTouchIcon152,
        appleTouchIcon120,
        appleTouchIcon76,
      ].forEach(iconUrl => {
        const icon = document.querySelector(`link[href="${iconUrl}"]`);
        if (icon) {
          icon.remove();
        }
      });
    };
  }, [
    faviconDataUrl,
    appleTouchIcon180,
    appleTouchIcon152,
    appleTouchIcon120,
    appleTouchIcon76,
  ]);

  return null; // This component doesn't render anything
}
