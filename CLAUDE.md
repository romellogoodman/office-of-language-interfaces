## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- SCSS for styling with CSS custom properties (tokens) - **All styles are in `src/app/globals.scss`, no inline styles**
- react-lucide for standard icons (Copy, ArrowLeft, ArrowRight, RefreshCw)
- ESLint for code quality

## Strict Conventions

### Component Naming (REQUIRED)

- **Page Components**: `Page{Name}` format (e.g., `PageHome`, `PageNotFound`)
- **UI Components**: Descriptive names (`ButtonControl`, `ButtonCopy`, `ButtonGenerate`)
- **Files**: Match component names exactly

### Client/Server Pattern (REQUIRED)

- **App Router pages** (`src/app/`): Thin server components for data fetching
- **Page Components** (`src/components/Page*.tsx`): Client components with `"use client"`
- This separation is mandatory for the architecture

### Styling Rules (REQUIRED)

- **All styles** must be in `src/app/globals.scss` - NO inline styles
- **Use CSS tokens**: `var(--font-size-detail-s)`, `var(--space-stack-s)`, etc.
- **BEM naming**: `.button-control`, `.button-control-group`, `.post-title`
- **Button icons**: Use `size={14}` for consistency

### Import Order (REQUIRED)

1. React and Next.js imports
2. Third-party libraries
3. Internal utilities (`@/lib/`)
4. Components (`@/components/`)
5. Relative imports

```typescript
import { useState } from "react";
import { NextRequest } from "next/server";

import { fetchClaude } from "@/lib/claude";
import ButtonControl from "@/components/ButtonControl";
```

## Proto Component Guidelines (STRICT)

- **Naming**: MUST use `Proto` prefix (e.g., `ProtoPromptBuilder`)
- **Location**: MUST go in `src/components/prototype/`
- **Styling**: ALL styles go in `prototypes.scss` - use CSS tokens from globals.scss
- **Display**: MUST show "Proto:" prefix in UI titles
- **Purpose**: Interactive demos and experiments for research articles

## Quick Reference

- **Architecture details**: See [docs/components.md](docs/components.md)
- **Styling system**: See [docs/styling-system.md](docs/styling-system.md)
- **File organization**: See [docs/project-structure.md](docs/project-structure.md)
- **AI prompts**: See [docs/prompts-and-api.md](docs/prompts-and-api.md)
- **Security patterns**: See [docs/api-security.md](docs/api-security.md)

## Documentation Maintenance

**When to Update Documentation:**

- Adding new components or changing component patterns
- Modifying security middleware or API routes
- Changing styling conventions or design tokens
- Adding new AI prompts or API integrations
- Updating development workflows

**Process:**

1. Read existing docs to understand current structure
2. Update all affected documentation files
3. Remove redundancy between docs
4. Add cross-references for related concepts
5. Verify code examples match implementation

---

_For detailed implementation guides, patterns, and examples, refer to the comprehensive documentation in the `docs/` folder._
