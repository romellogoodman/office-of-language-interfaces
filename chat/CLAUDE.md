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
- SCSS for styling (using BEM naming conventions)
- ESLint for code quality

## Project Structure

```
src/
├── app/
│   ├── globals.scss     # Global styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Homepage
└── components/          # Reusable components (create as needed)
```
