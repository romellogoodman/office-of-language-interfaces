# Styling System

This document explains the styling architecture, design system, and CSS conventions used in the Oli website.

## Overview

The project uses a centralized SCSS architecture with CSS custom properties, BEM methodology, and a consistent design token system. All styles are contained in a single global stylesheet for better maintainability and consistency.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CSS Variables  │───▶│  Global SCSS     │───▶│   Components    │
│  (Design Tokens)│    │ (globals.scss)   │    │  (Class Names)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    :root values           BEM Classes              React Components
   (--font-size-*)       (.button-control)         (className="...")
```

## Design System

### 1. CSS Custom Properties (Design Tokens)

All design values are defined as CSS custom properties in `:root` for consistency and theming.

#### Typography Scale
```scss
:root {
  /* Font Sizes - Core Scale */
  --font-size-00: 0.5rem;   /* 8px */
  --font-size-0: 0.75rem;   /* 12px */
  --font-size-1: 1rem;      /* 16px */
  --font-size-2: 1.1rem;    /* 17.6px */
  --font-size-3: 1.25rem;   /* 20px */
  --font-size-4: 1.5rem;    /* 24px */
  --font-size-5: 2rem;      /* 32px */
  --font-size-6: 2.5rem;    /* 40px */
  --font-size-7: 3rem;      /* 48px */
  --font-size-8: 3.5rem;    /* 56px */

  /* Semantic Font Sizes */
  --font-size-display-s: var(--font-size-4);   /* Headlines */
  --font-size-display-m: var(--font-size-5);
  --font-size-display-l: var(--font-size-6);
  
  --font-size-paragraph-s: var(--font-size-1);  /* Body text */
  --font-size-paragraph-l: var(--font-size-4);
  
  --font-size-detail-s: var(--font-size-0);     /* Supporting text */
  --font-size-detail-m: var(--font-size-1);
  --font-size-detail-l: var(--font-size-2);
}
```

#### Spacing Scale
```scss
:root {
  /* Sizing Scale */
  --size-000: -8px;   /* Negative margins */
  --size-00: -4px;
  --size-01: 4px;     /* Micro spacing */
  --size-02: 8px;     /* Small spacing */
  --size-03: 16px;    /* Base spacing */
  --size-04: 20px;    /* Medium spacing */
  --size-05: 24px;    /* Large spacing */
  --size-06: 28px;
  --size-07: 32px;
  --size-08: 48px;    /* XL spacing */
  --size-09: 64px;
  --size-10: 80px;
  --size-11: 120px;
  --size-12: 160px;
  --size-13: 240px;
  --size-14: 320px;
  --size-15: 480px;   /* Layout spacing */

  /* Semantic Spacing - Stack (Vertical) */
  --space-stack-xs: var(--size-02);   /* 8px */
  --space-stack-s: var(--size-05);    /* 24px */
  --space-stack-m: var(--size-07);    /* 32px */
  --space-stack-l: var(--size-08);    /* 48px */
  --space-stack-xl: var(--size-10);   /* 80px */

  /* Layout Spacing */
  --space-layout-padding: var(--size-04);  /* 20px */
}
```

#### Color Palette
```scss
:root {
  /* Brand Colors */
  --color-lavender: #b0afed;
  --color-peach: #f4c2a1;
  --color-sage: #85c7a3;

  /* Semantic Colors */
  --background-color: var(--color-sage);
  --link-color: #000000;
  --text-color: #000000;
}
```

#### Typography
```scss
:root {
  /* Font Stacks */
  --font-heading: "Public Sans", sans-serif;
  --font-body: Georgia, serif;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 2. Layout System

#### Breakpoints
```scss
$breakpoints: (
  xs: 320px,
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  2xl: 1536px,
);

@mixin minWidth($breakpoint) {
  @if map.has-key($breakpoints, $breakpoint) {
    @media (min-width: map.get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

#### Container Sizes
```scss
:root {
  --max-content-width: 80ch;          /* Text content width */
  --page-padding: var(--space-layout-padding);  /* Page margins */
}
```

## Component Styling

### 1. BEM Methodology

Components use Block-Element-Modifier (BEM) naming for predictable and maintainable CSS.

#### Block
The main component name:
```scss
.button-control {
  /* Base button styles */
  font-size: var(--font-size-detail-s);
  font-family: monospace;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.05);
  padding: var(--size-01) var(--size-02);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
```

#### Element
Sub-parts of a component:
```scss
.changelog-sidebar {
  /* Sidebar block */
}

.changelog-title {
  /* Title element */
  margin: 0 0 var(--space-stack-s) 0;
  font-size: var(--font-size-paragraph-l);
}

.changelog-list {
  /* List element */
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-s);
}

.changelog-item {
  /* Item element */
  border-bottom: 1px solid var(--text-color);
  padding-bottom: var(--size-02);
}
```

#### Modifier
Variations or states:
```scss
.button-control {
  /* Base styles */

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.generating {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}
```

### 2. Component Examples

#### Button System
```scss
/* Base button control */
.button-control {
  font-size: var(--font-size-detail-s);
  font-family: monospace;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.05);
  padding: var(--size-01) var(--size-02);
  border-radius: 3px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: rgba(0, 0, 0, 0.15);
  }

  /* State modifiers */
  &.generating {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}

/* Button link uses same styles */
a.button-control {
  text-decoration: none;
  display: inline-block;
}
```

#### Layout Components
```scss
/* Homepage container */
.homepage-container {
  display: flex;
  gap: var(--space-stack-l);
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

/* Main content area */
.main-content {
  padding: 40px var(--page-padding);
}

/* Homepage intro section */
.homepage-intro {
  margin-bottom: var(--space-stack-xl);
  max-width: var(--max-content-width);

  p {
    font-size: var(--font-size-paragraph-l);
    text-wrap: balance;
    max-width: 60ch;
  }
}
```

#### Generation Controls
```scss
.generation-controls {
  display: flex;
  align-items: center;
  gap: var(--size-02);
  flex-wrap: wrap;
}

.generation-counter {
  font-size: var(--font-size-detail-s);
  font-family: monospace;
  color: rgba(0, 0, 0, 0.6);
  padding: var(--size-01) var(--size-02);
}
```

## Typography System

### 1. Hierarchy
```scss
/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  margin-bottom: var(--space-stack-s);
}

h1 {
  font-size: var(--font-size-display-l);
  margin-bottom: var(--space-stack-l);
}

h2 {
  font-size: var(--font-size-display-m);
}

h3 {
  font-size: var(--font-size-display-s);
}

/* Body text */
p {
  font-size: var(--font-size-paragraph);
  line-height: 1.6;
  margin-bottom: var(--space-stack-s);
}

/* Supporting text */
time {
  font-size: var(--font-size-detail-m);
}
```

### 2. Text Utilities
```scss
/* Text wrapping */
.text-balance {
  text-wrap: balance;
}

/* Content width */
.content-width {
  max-width: var(--max-content-width);
}

/* Readable line length */
.readable {
  max-width: 60ch;
}
```

## Layout Patterns

### 1. Flexbox Layouts
```scss
/* Horizontal layout with gap */
.flex-row {
  display: flex;
  align-items: center;
  gap: var(--size-02);
}

/* Vertical layout with gap */
.flex-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-s);
}

/* Space between layout */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 2. Responsive Patterns
```scss
/* Stack on mobile */
.responsive-flex {
  display: flex;
  gap: var(--space-stack-l);

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* Hide on mobile */
.desktop-only {
  @media (max-width: 768px) {
    display: none;
  }
}
```

## Component Integration

### 1. React Components
```tsx
// Using design system classes
export default function ButtonControl({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`button-control ${className}`}
    >
      {children}
    </button>
  );
}

// Usage with modifiers
<ButtonControl 
  onClick={handleGenerate}
  className={isGenerating ? "generating" : ""}
>
  {isGenerating ? "generating..." : "generate"}
</ButtonControl>
```

### 2. Dynamic Classes
```tsx
// Conditional styling
const buttonClass = [
  'button-control',
  isLoading && 'generating',
  isDisabled && 'disabled'
].filter(Boolean).join(' ');

<button className={buttonClass}>
  {children}
</button>
```

## Best Practices

### 1. Design Token Usage
```scss
/* ✅ Good - Use design tokens */
.component {
  margin-bottom: var(--space-stack-s);
  font-size: var(--font-size-detail-m);
  color: var(--text-color);
}

/* ❌ Bad - Hard-coded values */
.component {
  margin-bottom: 24px;
  font-size: 16px;
  color: #000000;
}
```

### 2. BEM Naming
```scss
/* ✅ Good - Clear BEM structure */
.post-item { }
.post-title { }
.post-meta { }
.post-date { }

/* ❌ Bad - Nested or unclear names */
.post {
  .item {
    .title { }
  }
}
```

### 3. Responsive Design
```scss
/* ✅ Good - Mobile-first with semantic breakpoints */
.component {
  flex-direction: column;

  @include minWidth(md) {
    flex-direction: row;
  }
}

/* ❌ Bad - Hard-coded media queries */
.component {
  @media (min-width: 768px) {
    /* styles */
  }
}
```

### 4. Component Composition
```scss
/* ✅ Good - Reuse base styles */
.button-control,
.changelog-hash {
  font-size: var(--font-size-detail-s);
  font-family: monospace;
  padding: var(--size-01) var(--size-02);
  border-radius: 3px;
}

/* ❌ Bad - Duplicate styles */
.button-control {
  font-size: var(--font-size-detail-s);
  font-family: monospace;
}

.changelog-hash {
  font-size: var(--font-size-detail-s);
  font-family: monospace;
}
```

## Performance Considerations

### 1. CSS Custom Properties
- **Runtime Performance**: CSS variables are computed at runtime
- **Browser Support**: Excellent modern browser support
- **Theming**: Easy to update values dynamically

### 2. Single Stylesheet
- **Bundle Size**: One CSS file reduces HTTP requests
- **Caching**: Better cache efficiency
- **Maintenance**: Centralized style management

### 3. Responsive Images
```scss
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## Development Workflow

### 1. Adding New Styles
1. Check if design tokens exist for values
2. Use BEM naming convention
3. Add to appropriate section in `globals.scss`
4. Test responsive behavior
5. Verify accessibility (contrast, focus states)

### 2. Design Token Updates
1. Update `:root` values in `globals.scss`
2. Test impact across all components
3. Update documentation if adding new tokens

### 3. Component Styling
1. Create base styles for the block
2. Add element styles for sub-components
3. Include modifier classes for states
4. Add responsive variants
5. Test with different content lengths

## Accessibility

### 1. Color Contrast
- Text meets WCAG AA contrast requirements
- Interactive elements have sufficient contrast
- Focus indicators are clearly visible

### 2. Typography
- Readable font sizes (minimum 16px for body text)
- Sufficient line height (1.4+)
- Reasonable line length (45-75 characters)

### 3. Interactive States
```scss
.button-control {
  /* Visual feedback for all states */
  &:hover { }
  &:focus { }
  &:active { }
  &:disabled { }
}
```

## Future Considerations

### 1. CSS-in-JS Migration
- Current system could migrate to styled-components
- Design tokens would translate to theme objects
- BEM naming would become component names

### 2. CSS Modules
- Could adopt CSS Modules for component scoping
- Keep design tokens in global scope
- Maintain BEM methodology within modules

### 3. Design System Evolution
- Consider adding more semantic tokens
- Expand color palette with accessibility in mind
- Add animation and transition tokens