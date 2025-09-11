# Component Architecture

This document explains the component system and architecture patterns used in the Oli website. For styling conventions, see [Styling System](./styling-system.md). For file organization, see [Project Structure](./project-structure.md).

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
- Minimal logic, pass data to Page components
- File-based routing

### 2. Page Components (`src/components/Page*.tsx`)

Client components that contain the main page logic and interactivity.

```typescript
// src/components/PageHome.tsx
"use client";

export default function PageHome({ posts }: PageHomeProps) {
  const [state, setState] = useState();
  // Main page logic here
  return <div>{/* Page content */}</div>;
}
```

**Naming Convention:** `Page{Name}` (e.g., `PageHome`, `PageNotFound`)

**Characteristics:**

- Client components (`"use client"`)
- Contain interactive logic and state
- Receive data as props from App Router pages
- Handle user interactions and dynamic behavior

### 3. UI Components (`src/components/`)

Reusable components used across multiple pages.

#### ButtonControl

Interactive button component with optional icon support.

```typescript
<ButtonControl
  onClick={handleClick}
  className="generating"
  icon={<RefreshCw size={14} />}
>
  {isLoading ? "generating..." : "generate"}
</ButtonControl>
```

#### ButtonGenerate

Complex component for text generation with navigation controls. Returns both data and UI for flexible composition.

```typescript
const { currentText, controls } = ButtonGenerate({
  initialText: "Starting text",
  prompt: "Rewrite this text in a different style",
  // OR use generatePrompt for dynamic prompts
  generatePrompt: (text, generations) => "Rewrite this: " + text,
});
```

#### ButtonCopy

Button component for copying text to clipboard with visual feedback.

```typescript
<ButtonCopy text="Text to copy">copy</ButtonCopy>
```

#### Other UI Components

- **ButtonLink**: Link component with button styling
- **Header**: Main site header with navigation
- **Footer**: Site footer with copyright and links
- **ResearchActions**: Action buttons for research posts
- **CodeBlock**: Syntax highlighted code display

## Design Patterns

### 1. Client/Server Separation

- **Server Components**: Data fetching, metadata, static rendering
- **Client Components**: Interactivity, state management, event handlers

### 2. Composition Pattern

Components compose smaller components rather than inheritance.

```typescript
function PageHome() {
  const { currentText, controls } = ButtonGenerate({
    initialText: "Sample text",
    prompt: "Generate new text",
  });

  return (
    <div>
      <p>{currentText}</p>
      {controls}
      <ButtonControl onClick={action}>Action</ButtonControl>
    </div>
  );
}
```

### 3. Hook-like Returns

Complex components return both data and UI for flexible composition.

```typescript
const { currentText, controls } = ButtonGenerate(config);

return (
  <div>
    <p>{currentText}</p>
    {controls}
  </div>
);
```

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
<PageHome posts={posts} />;

// Page Component uses data
function PageHome({ posts }: PageHomeProps) {
  return posts.map((post) => <PostItem key={post.id} post={post} />);
}
```

### 3. Custom Hooks Pattern

Complex logic is extracted into reusable patterns.

```typescript
// ButtonGenerate acts like a custom hook
const { currentText, controls } = ButtonGenerate({
  initialText,
  prompt: "Generate variation",
  // OR use generatePrompt for dynamic prompts
  generatePrompt: (text, generations) => `Rewrite: ${text}`,
});
```

## Best Practices

### 1. Component Naming

- **Page Components**: `Page{Name}` format
- **UI Components**: Descriptive names (`ButtonControl`, `ButtonCopy`, `ButtonGenerate`)
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
  icon?: React.ReactNode;
}
```

### 3. Client Directive Placement

Place `"use client"` at the top of files that need it.

```typescript
"use client";

import { useState } from "react";
// Component code
```

### 4. Error Handling

Handle errors gracefully in components.

```typescript
try {
  const response = await fetchData();
  setData(response);
} catch (error) {
  console.error("Error:", error);
  // Handle error state
}
```

## Testing Considerations

- **Server Components**: Test data fetching and props passing
- **Client Components**: Test interactivity and state changes
- **UI Components**: Test reusability and prop variations
- **Integration**: Test App Router → Page Component flow
