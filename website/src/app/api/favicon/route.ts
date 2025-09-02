import { NextRequest, NextResponse } from 'next/server';
import { generateFavicon } from '@/utils/favicon';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const color = searchParams.get('color') || '#85c7a3'; // Default to sage green
  
  // Handle gradient colors (comma-separated)
  const colors = color.includes(',') ? color.split(',') : color;
  
  const svg = generateFavicon(colors);
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}