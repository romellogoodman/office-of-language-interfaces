# Project Structure

This document outlines the file organization and development patterns for the Oli website.

## Directory Structure

```
oli/website/
├── docs/                          # Documentation
│   ├── README.md                  # Documentation index
│   ├── api-security.md           # API security guide
│   ├── components.md             # Component architecture
│   └── project-structure.md      # This file
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.scss          # Global styles (BEM)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage route
│   │   ├── not-found.tsx         # 404 page
│   │   └── api/                  # API routes
│   │       ├── claude/           # Claude AI endpoint
│   │       └── commits/          # Git commits endpoint
│   ├── components/               # React components
│   │   ├── PageHome.tsx          # Homepage logic
│   │   ├── PageNotFound.tsx      # 404 page logic
│   │   ├── GenerationControls.tsx # Text generation UI
│   │   ├── ButtonControl.tsx     # Interactive button
│   │   ├── ButtonLink.tsx        # Link with button styling
│   │   ├── Header.tsx            # Site header
│   │   └── Footer.tsx            # Site footer
│   ├── lib/                      # Utilities and services
│   │   ├── claude.ts             # Claude API client
│   │   ├── api-middleware.ts     # Security middleware
│   │   ├── rate-limiter.ts       # Rate limiting logic
│   │   ├── origin-validator.ts   # Origin whitelist validation
│   │   ├── request-validator.ts  # Request validation
│   │   ├── build-info.ts         # Build-time utilities
│   │   └── date.ts               # Date formatting
│   └── utils/                    # Helper functions
├── public/                       # Static assets
├── content/                      # MDX content
│   └── research/                 # Research posts
├── CLAUDE.md                     # Claude Code development notes
├── package.json                  # Dependencies and scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
└── tsconfig.json                # TypeScript configuration
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
import { fetchClaude } from '@/lib/claude';
import ButtonControl from '@/components/ButtonControl';
import PageHome from '@/components/PageHome';
```

### Import Order
1. React and Next.js imports
2. Third-party libraries  
3. Internal utilities (`@/lib/`)
4. Components (`@/components/`)
5. Relative imports

```typescript
import { useState } from 'react';
import { NextRequest } from 'next/server';
import matter from 'gray-matter';

import { fetchClaude } from '@/lib/claude';
import ButtonControl from '@/components/ButtonControl';
import './styles.scss';
```

## Development Patterns

### 1. Server/Client Architecture

**Server Components (App Router):**
```typescript
// src/app/page.tsx - Server component
export default function Home() {
  const posts = getAllPosts(); // Server-side data fetching
  return <PageHome posts={posts} />;
}
```

**Client Components (Page Components):**
```typescript
// src/components/PageHome.tsx - Client component
'use client';
export default function PageHome({ posts }) {
  const [state, setState] = useState();
  // Interactive logic
}
```

### 2. API Route Security

All API routes use middleware for consistent security:

```typescript
// Full protection for external APIs
export async function POST(request: NextRequest) {
  return withFullProtection(request, async ({ clientIP, body }) => {
    // Route logic
  });
}

// Rate limiting only for internal APIs  
export async function GET(request: NextRequest) {
  return withRateLimitOnly(request, async () => {
    // Route logic
  });
}
```

### 3. Component Composition

Components compose through props and children:

```typescript
// Flexible composition
const { currentText, controls } = GenerationControls(config);

return (
  <div>
    <p>{currentText}</p>
    {controls}
  </div>
);
```

## Styling Architecture

### Global Styles (`globals.scss`)

All styles in one file using CSS custom properties and BEM methodology:

```scss
:root {
  /* Design tokens */
  --font-size-detail-s: 0.75rem;
  --space-stack-s: 24px;
  --color-sage: #85c7a3;
}

/* Component styles */
.button-control {
  font-size: var(--font-size-detail-s);
  
  &:hover {
    opacity: 0.7;
  }
  
  &.disabled {
    pointer-events: none;
  }
}
```

### Design System

- **Typography Scale**: Consistent font sizes (`--font-size-*`)
- **Spacing Scale**: Consistent spacing (`--space-stack-*`, `--size-*`) 
- **Color Palette**: Named colors (`--color-sage`, `--color-peach`)
- **Component States**: Modifier classes (`.disabled`, `.generating`)

## Environment Configuration

### Development
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

## Security Considerations

### API Protection
- **Rate Limiting**: Per-IP and global limits
- **Origin Validation**: Whitelist allowed domains
- **Input Validation**: Sanitize and validate requests
- **Error Logging**: Monitor security violations

### Content Security
- **Prompt Filtering**: Block jailbreak attempts
- **Model Validation**: Whitelist allowed AI models
- **Length Limits**: Prevent oversized requests

## Performance Patterns

### Code Splitting
- **Server Components**: Automatic optimization
- **Client Components**: Bundle splitting by route
- **Dynamic Imports**: Load heavy components on demand

### Caching Strategy  
- **Static Assets**: Next.js automatic optimization
- **API Responses**: No caching for dynamic content
- **Rate Limits**: In-memory with automatic cleanup

## Development Workflow

### 1. New Features
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Implement with proper error handling
4. Add security middleware if API route
5. Update documentation

### 2. API Routes
1. Use appropriate middleware wrapper
2. Validate inputs with request-validator
3. Handle errors gracefully  
4. Add logging for security events
5. Test rate limiting behavior

### 3. Components
1. Follow naming conventions
2. Add proper TypeScript types
3. Use global SCSS classes
4. Handle loading and error states
5. Compose with existing components

## Testing Strategy

### Unit Tests
- **Components**: Props, state, and interactions
- **Utilities**: Pure function behavior
- **Validators**: Input/output validation

### Integration Tests  
- **API Routes**: Security middleware integration
- **Components**: Data flow between components
- **Pages**: Server/client component interaction

### End-to-End Tests
- **User Flows**: Complete feature usage
- **Security**: Rate limiting and validation
- **Performance**: Load times and responsiveness

## Deployment Considerations

### Production Build
- Set `NODE_ENV=production`
- Configure `ANTHROPIC_API_KEY`
- Update allowed origins for domain
- Monitor rate limiting logs

### Monitoring
- **API Usage**: Rate limit violations
- **Security Events**: Blocked requests  
- **Performance**: Response times
- **Errors**: Application crashes