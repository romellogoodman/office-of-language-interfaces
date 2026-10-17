# API Routes

The site has no generation API and needs no secrets or API keys. The former `/api/claude` route, its Anthropic SDK client and its security middleware (rate limiting, origin and request validation) have been removed. Generated content is now pre-written in `src/data/` (see [Pre-written Content and Prompts](./prompts-and-api.md)).

## Remaining Routes

- **`/api/favicon`** (`GET`): Returns an SVG favicon in a solid color or gradient.
- **`/api/text`** (`GET`): Returns all research posts as plain text, read from `src/app/research/*/content.md`.

Both are read-only, call no external services and need no middleware. If a future route calls a paid or external service, add rate limiting and origin checks before shipping it.
