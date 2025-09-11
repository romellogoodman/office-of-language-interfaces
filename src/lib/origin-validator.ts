const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://oli.software",
  "https://www.oli.software",
];

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Allow requests without origin/referer (for server-to-server, Postman, etc.)
  if (!origin && !referer) {
    return true;
  }

  // Check origin header first
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // Check referer header as backup
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return ALLOWED_ORIGINS.includes(refererOrigin);
    } catch {
      return false;
    }
  }

  return false;
}

export function getOriginFromRequest(request: Request): string {
  return (
    request.headers.get("origin") || request.headers.get("referer") || "unknown"
  );
}
