import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const color = searchParams.get("color") || "#85c7a3";
  const size = parseInt(searchParams.get("size") || "16", 10);

  const svg = generateFavicon(color, size);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
