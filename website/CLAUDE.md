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
- SCSS for styling (using BEM naming conventions) - **All styles are in `src/app/globals.scss`, no inline styles**
- **Proto components**: Interactive demos and experiments go in `src/components/prototype/` with styles in `prototypes.scss`
- ESLint for code quality

## Project Structure

```
src/
├── app/
│   ├── globals.scss     # Global styles
│   ├── layout.tsx       # Root layout component
│   ├── page.tsx         # Homepage
│   ├── not-found.tsx    # 404 page
│   └── research/
│       └── [slug]/
│           └── page.tsx # Individual research post pages
├── components/
│   ├── Header.tsx       # Site header component
│   ├── PageHome.tsx     # Homepage component
│   ├── PageNotFound.tsx # 404 page component
│   ├── ButtonControl.tsx # Reusable button component
│   └── prototype/       # Interactive demos and experiments
│       └── prototypes.scss # Styles for all proto components
├── lib/
│   └── claude.ts        # Claude API utilities
└── content/
    └── research/        # MDX research posts
```

## Component Conventions

- **Page Components**: Follow the `PageName` convention (e.g., `PageHome`, `PageNotFound`)
- Page components are client components that contain the main logic for each page
- App router pages (in `src/app/`) are thin wrappers that import and render the corresponding Page component
- This separation allows for better code organization and reusability

## Proto Component Guidelines

- **Naming**: All proto components must use the `Proto` prefix (e.g., `ProtoPromptBuilder`, `ProtoSlider`)
- **Location**: All proto components go in `src/components/prototype/`
- **Styling**: All proto styles go in `prototypes.scss` - never inline styles
- **Display**: Proto components should display "Proto:" prefix in their UI titles
- **Purpose**: Interactive demos, experiments, and prototypes for research articles
- **MDX Integration**: Register proto components in `PageResearch.tsx` components mapping

## Documentation

The project maintains comprehensive documentation in the `docs/` folder:

- **[docs/README.md](docs/README.md)** - Documentation index and overview
- **[docs/api-security.md](docs/api-security.md)** - API security implementation and middleware usage
- **[docs/components.md](docs/components.md)** - Component architecture and patterns
- **[docs/project-structure.md](docs/project-structure.md)** - File organization and development workflow
- **[docs/styling-system.md](docs/styling-system.md)** - Design system, SCSS architecture, and styling conventions

**Maintenance**: Documentation should be updated when making significant architectural changes, adding new security features, or changing component patterns. The docs provide detailed implementation guides and examples for future development.
