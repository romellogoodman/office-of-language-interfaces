# Project Structure

This document outlines the file organization and development patterns for the Oli website. For component architecture, see [Component Architecture](./components.md). For styling details, see [Styling System](./styling-system.md).

## Directory Structure

```
oli/website/
├── docs/                    # Documentation
├── src/
│   ├── app/                 # Next.js App Router (routes & globals.scss)
│   │   └── api/             # API endpoints (claude, commits)
│   ├── components/          # React components (Page*, Button*, UI components)
│   ├── lib/                 # Utilities (claude.ts, middleware, validation)
│   ├── prompts/             # AI prompt templates
│   └── utils/               # Helper functions
├── content/research/        # MDX research posts
├── public/                  # Static assets
└── CLAUDE.md                # Development notes
```

## File Naming Conventions

### Components

- **Page Components**: `Page{Name}.tsx` (e.g., `PageHome.tsx`)
- **UI Components**: Descriptive names (`ButtonControl.tsx`)
- **Layout Components**: Simple names (`Header.tsx`, `Footer.tsx`)

### Utilities

- **Services**: Feature-based (`claude.ts`, `rate-limiter.ts`)
- **Middleware**: Purpose-based (`api-middleware.ts`)
- **Validators**: Domain-based (`origin-validator.ts`)

### API Routes

- **RESTful**: Use HTTP methods (`GET`, `POST`)
- **Nested**: Group related endpoints (`api/claude/`, `api/commits/`)

## Import Conventions

### Path Aliases

Use `@/` prefix for clean imports:

```typescript
import { fetchClaude } from "@/lib/claude";
import ButtonControl from "@/components/ButtonControl";
import PageHome from "@/components/PageHome";
```

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal utilities (`@/lib/`)
4. Components (`@/components/`)
5. Relative imports

```typescript
import { useState } from "react";
import { NextRequest } from "next/server";
import matter from "gray-matter";

import { fetchClaude } from "@/lib/claude";
import ButtonControl from "@/components/ButtonControl";
import "./styles.scss";
```

## Development Patterns

### 1. Server/Client Architecture

- **Server Components** (`src/app/`): Data fetching, metadata, routing
- **Client Components** (`src/components/Page*.tsx`): Interactivity, state

```typescript
// Server component - data fetching
export default function Home() {
  const posts = getAllPosts();
  return <PageHome posts={posts} />;
}

// Client component - interactivity
"use client";
export default function PageHome({ posts }) {
  const [state, setState] = useState();
  // Interactive logic
}
```

### 2. API Route Security

All API routes use middleware for consistent security. See [API Security](./api-security.md) for details.

```typescript
// Full protection for external APIs
export async function POST(request: NextRequest) {
  return withFullProtection(request, async ({ clientIP, body }) => {
    // Route logic
  });
}
```

### 3. Component Organization

- **Flat structure**: All components in `src/components/`
- **Clear naming**: Component purpose obvious from filename
- **Type definitions**: Every component has TypeScript interfaces

## Environment Configuration

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx tsc --noEmit     # Type checking
```

### Environment Variables

```bash
ANTHROPIC_API_KEY=sk-...    # Claude API access
```

### Build Process

1. **Type Checking**: TypeScript compilation
2. **Style Processing**: SCSS compilation
3. **Bundle Generation**: Next.js build
4. **Build Info**: Git commit hash capture

## Security Architecture

### API Protection

- **Rate Limiting**: Per-IP and global limits
- **Origin Validation**: Whitelist allowed domains
- **Input Validation**: Sanitize and validate requests
- **Error Logging**: Monitor security violations

### Content Security

- **Prompt Filtering**: Block jailbreak attempts in [Prompts & API](./prompts-and-api.md)
- **Model Validation**: Whitelist allowed AI models
- **Length Limits**: Prevent oversized requests

## Development Workflow

### 1. New Features

1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Follow [Component Architecture](./components.md) patterns
4. Use [Styling System](./styling-system.md) classes
5. Update documentation

### 2. API Routes

1. Use appropriate middleware wrapper
2. Follow security patterns in [API Security](./api-security.md)
3. Add proper error handling
4. Test rate limiting behavior

### 3. Styling

1. Use design tokens from [Styling System](./styling-system.md)
2. Follow BEM naming conventions
3. Add to `src/app/globals.scss`
4. Test responsive behavior

## Performance Patterns

### Code Splitting

- **Server Components**: Automatic optimization
- **Client Components**: Bundle splitting by route
- **Dynamic Imports**: Load heavy components on demand

### Caching Strategy

- **Static Assets**: Next.js automatic optimization
- **API Responses**: No caching for dynamic content
- **Rate Limits**: In-memory with automatic cleanup

## Testing Strategy

- **Unit Tests**: Components, utilities, validators
- **Integration Tests**: API routes, security middleware
- **End-to-End Tests**: User flows, security, performance
