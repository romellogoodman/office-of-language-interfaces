'use client';

import { useEffect } from 'react';

export const useFavicon = (color: string | string[]) => {
  useEffect(() => {
    const colorParam = Array.isArray(color) ? color.join(',') : color;
    const faviconUrl = `/api/favicon?color=${encodeURIComponent(colorParam)}`;
    
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    
    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconUrl;
    document.head.appendChild(link);
    
    // Cleanup function
    return () => {
      const currentFavicon = document.querySelector(`link[href="${faviconUrl}"]`);
      if (currentFavicon) {
        currentFavicon.remove();
      }
    };
  }, [color]);
};