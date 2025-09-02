export const generateFavicon = (color: string | string[] = 'black'): string => {
  const svgContent = Array.isArray(color)
    ? `
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        ${color.map((col, index) => {
          const percent = Math.floor(100 / color.length) * (index + 1);
          return `<stop offset="${percent}%" stop-color="${col}" />`;
        }).join('')}
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

export const getFaviconDataUrl = (color: string | string[] = 'black'): string => {
  return `data:image/svg+xml,${encodeURIComponent(generateFavicon(color))}`;
};