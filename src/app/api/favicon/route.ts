import { NextRequest, NextResponse } from "next/server";

const DEFAULT_COLOR = "#85c7a3";
const DEFAULT_SIZE = 16;
const MAX_SIZE = 512;
const COLOR_PATTERN = /^#[0-9a-f]{3,8}$/i;

const sanitizeColor = (color: string) =>
  COLOR_PATTERN.test(color) ? color : DEFAULT_COLOR;

const sanitizeSize = (size: string | null) => {
  const parsed = parseInt(size || String(DEFAULT_SIZE), 10);

  if (Number.isNaN(parsed)) {
    return DEFAULT_SIZE;
  }

  return Math.min(Math.max(parsed, 1), MAX_SIZE);
};

const generateFavicon = (
  color: string | string[] = DEFAULT_COLOR,
  size: number = DEFAULT_SIZE
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
  const colorParam = searchParams.get("color") || DEFAULT_COLOR;
  const colors = colorParam.split(",").map(sanitizeColor);
  const color = colors.length > 1 ? colors : colors[0];
  const size = sanitizeSize(searchParams.get("size"));

  const svg = generateFavicon(color, size);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, immutable",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
