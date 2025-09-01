# Component Architecture

This document explains the component system and architecture patterns used in the Oli website.

## Overview

The application follows a clear separation between page components and reusable UI components, with consistent naming conventions and a client/server component pattern.

## Architecture Pattern

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App Router    │───▶│  Page Component  │───▶│ UI Components   │
│  (src/app/)     │    │   (PageHome)     │    │ (ButtonControl) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    Server Side              Client Side             Reusable UI
   (Data Fetching)        (Interactivity)          (Cross-page)
```

## Component Types

### 1. App Router Pages (`src/app/`)

Thin server components that handle routing, metadata, and data fetching.

```typescript
// src/app/page.tsx
export default function Home() {
  const posts = getAllPosts(); // Server-side data fetching
  return <PageHome posts={posts} />;
}
```

**Characteristics:**
- Server components by default
- Handle data fetching and metadata
- Minimal logic, mostly pass data to Page components
- File-based routing

### 2. Page Components (`src/components/Page*.tsx`)

Client components that contain the main page logic and interactivity.

```typescript
// src/components/PageHome.tsx
'use client';

export default function PageHome({ posts }: PageHomeProps) {
  const [state, setState] = useState();
  // Main page logic here
  return <div>{/* Page content */}</div>;
}
```

**Naming Convention:** `Page{Name}` (e.g., `PageHome`, `PageNotFound`)

**Characteristics:**
- Client components (`'use client'`)
- Contain interactive logic and state
- Receive data as props from App Router pages
- Handle user interactions and dynamic behavior

### 3. UI Components (`src/components/`)

Reusable components used across multiple pages.

#### ButtonControl
Interactive button component for actions.

```typescript
<ButtonControl onClick={handleClick} className="generating">
  {isLoading ? "generating..." : "generate"}
</ButtonControl>
```

#### ButtonLink
Link component with button styling.

```typescript
<ButtonLink 
  href="https://github.com/user/repo/commit/abc123"
  target="_blank"
  rel="noopener noreferrer"
>
  abc123
</ButtonLink>
```

#### GenerationControls
Complex component for text generation with navigation.

```typescript
const { currentText, controls } = GenerationControls({
  initialText: "Starting text",
  generatePrompt: (text, generations) => "Rewrite this: " + text,
});
```

## Design Patterns

### 1. Client/Server Separation

**Server Components (App Router):**
- Data fetching
- Metadata
- Static rendering
- Environment variables

**Client Components (Page Components):**
- Interactivity
- State management
- Event handlers
- Browser APIs

### 2. Composition Pattern

Components compose smaller components rather than inheritance.

```typescript
// Page component uses UI components
function PageHome() {
  return (
    <div>
      <GenerationControls {...props} />
      <ButtonControl onClick={action}>Action</ButtonControl>
    </div>
  );
}
```

### 3. Hook-like Returns

Complex components return both data and UI for flexible composition.

```typescript
const { currentText, controls } = GenerationControls(config);

return (
  <div>
    <p>{currentText}</p>
    {controls}
  </div>
);
```

## Styling Conventions

### 1. SCSS with BEM-like Classes

All styles are in `src/app/globals.scss` using BEM naming conventions.

```scss
// Component styles
.button-control {
  // Base styles
  
  &:hover {
    // Hover state
  }
  
  &.disabled {
    // Modifier
  }
}

// Layout styles  
.homepage-container {
  display: flex;
  gap: var(--space-stack-l);
}
```

### 2. CSS Custom Properties

Consistent design tokens through CSS variables.

```scss
:root {
  --font-size-detail-s: 0.75rem;
  --space-stack-s: 24px;
  --color-sage: #85c7a3;
}
```

### 3. No Inline Styles

All styling is done through CSS classes, not inline styles.

## State Management

### 1. Local State with useState

Most components use React's built-in state management.

```typescript
const [generations, setGenerations] = useState<string[]>([initialText]);
const [currentIndex, setCurrentIndex] = useState(0);
```

### 2. Props Drilling

Data flows down through props from App Router → Page Component → UI Components.

```typescript
// App Router fetches data
const posts = getAllPosts();

// Passes to Page Component  
<PageHome posts={posts} />

// Page Component uses data
function PageHome({ posts }: PageHomeProps) {
  return posts.map(post => <PostItem key={post.id} post={post} />);
}
```

### 3. Custom Hooks Pattern

Complex logic is extracted into reusable patterns.

```typescript
// GenerationControls acts like a custom hook
const { currentText, controls } = GenerationControls({
  initialText,
  generatePrompt,
});
```

## File Organization

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Home route
│   ├── not-found.tsx      # 404 route
│   └── api/               # API routes
├── components/            # All components
│   ├── PageHome.tsx       # Page components
│   ├── PageNotFound.tsx
│   ├── ButtonControl.tsx  # UI components  
│   ├── ButtonLink.tsx
│   └── GenerationControls.tsx
└── lib/                   # Utilities
    ├── claude.ts          # API utilities
    ├── api-middleware.ts  # Security
    └── rate-limiter.ts
```

## Best Practices

### 1. Component Naming
- **Page Components**: `Page{Name}` format
- **UI Components**: Descriptive names (`ButtonControl`, not `Button`)
- **Files**: Match component names exactly

### 2. Props Interface
Always define TypeScript interfaces for props.

```typescript
interface PageHomeProps {
  posts: Post[];
}

interface ButtonControlProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}
```

### 3. Client Directive Placement
Place `'use client'` at the top of files that need it.

```typescript
'use client';

import { useState } from 'react';
// Component code
```

### 4. Error Boundaries
Handle errors gracefully in components.

```typescript
try {
  const response = await fetchData();
  setData(response);
} catch (error) {
  console.error('Error:', error);
  // Handle error state
}
```

## Testing Considerations

- **Server Components**: Test data fetching and props passing
- **Client Components**: Test interactivity and state changes  
- **UI Components**: Test reusability and prop variations
- **Integration**: Test App Router → Page Component flow