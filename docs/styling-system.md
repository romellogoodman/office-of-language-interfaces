# Styling System

This document explains the styling architecture, design system, and CSS conventions used in the Oli website.

## Overview

The project uses a centralized SCSS architecture with CSS custom properties, BEM methodology, and a consistent design token system. All styles are contained in a single global stylesheet (`src/app/globals.scss`) for better maintainability and consistency.

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

- **Core Scale**: `--font-size-0` (12px) to `--font-size-8` (56px)
- **Semantic Sizes**:
  - Display: `--font-size-display-s/m/l` (headlines)
  - Paragraph: `--font-size-paragraph-s/l` (body text)
  - Detail: `--font-size-detail-s/m/l` (supporting text)

#### Spacing Scale

- **Size Scale**: `--size-01` (4px) to `--size-15` (480px)
- **Semantic Spacing**: `--space-stack-xs/s/m/l/xl` (vertical rhythm)
- **Layout**: `--space-layout-padding` (page margins)

#### Color Palette

- **Brand Colors**: `--color-lavender`, `--color-peach`, `--color-sage`
- **Semantic Colors**: `--background-color`, `--text-color`, `--link-color`

#### Typography

- **Font Stacks**: `--font-heading` (Public Sans), `--font-body` (Georgia)
- **Font Weights**: `--font-weight-light` to `--font-weight-bold`

### 2. Layout System

#### Breakpoints

- **Mobile-first** responsive design
- **Semantic breakpoints**: xs, sm, md, lg, xl, 2xl
- **SCSS mixin**: `@include minWidth(md)` for consistent media queries

#### Container Sizes

- **Content width**: `--max-content-width: 80ch` (optimal reading length)
- **Page padding**: `--page-padding` (consistent margins)

## Component Styling

### 1. BEM Methodology

Components use Block-Element-Modifier (BEM) naming for predictable and maintainable CSS.

- **Block**: `.button-control` (main component)
- **Element**: `.post-title`, `.post-meta` (sub-parts)
- **Modifier**: `.generating`, `.disabled` (states/variations)

### 2. Key Component Classes

#### Buttons

- **Base**: `.button-control` (consistent button styling)
- **Groups**: `.button-control-group` (flexbox layout with gap)
- **Icons**: `.button-icon` (icon positioning within buttons)
- **States**: `.generating`, `.disabled` (interaction states)

#### Layout

- **Containers**: `.homepage-container`, `.main-content`
- **Responsive**: Mobile-first with `@include minWidth()` breakpoints

## Best Practices

### 1. Design Token Usage

```scss
/* ✅ Good - Use design tokens */
.component {
  margin-bottom: var(--space-stack-s);
  font-size: var(--font-size-detail-m);
}

/* ❌ Bad - Hard-coded values */
.component {
  margin-bottom: 24px;
  font-size: 16px;
}
```

### 2. BEM Naming

```scss
/* ✅ Good - Clear BEM structure */
.post-item {
}
.post-title {
}
.post-meta {
}

/* ❌ Bad - Nested selectors */
.post .item .title {
}
```

### 3. Component Integration

```tsx
// Using design system classes
<ButtonControl
  onClick={handleGenerate}
  className={isGenerating ? "generating" : ""}
  icon={<RefreshCw size={14} />}
>
  {isGenerating ? "generating..." : "generate"}
</ButtonControl>
```

### 4. Responsive Design

```scss
/* ✅ Good - Mobile-first with semantic breakpoints */
.component {
  flex-direction: column;

  @include minWidth(md) {
    flex-direction: row;
  }
}
```

## Performance Considerations

- **Single Stylesheet**: One CSS file reduces HTTP requests and improves caching
- **CSS Custom Properties**: Runtime theming capability with good browser support
- **BEM Methodology**: Flat specificity and predictable class names

## Accessibility

- **Color Contrast**: WCAG AA compliance for all text
- **Typography**: Minimum 16px body text, 1.4+ line height
- **Interactive States**: Clear hover, focus, and disabled states
- **Readable Line Length**: 45-75 characters for optimal readability

## Development Workflow

### Adding New Styles

1. Check if design tokens exist for values
2. Use BEM naming convention
3. Add to appropriate section in `globals.scss`
4. Test responsive behavior
5. Verify accessibility (contrast, focus states)

### Component Styling

1. Create base styles for the block (`.component-name`)
2. Add element styles for sub-components (`.component-element`)
3. Include modifier classes for states (`.component-name.modifier`)
4. Add responsive variants with `@include minWidth()`
5. Test with different content lengths
