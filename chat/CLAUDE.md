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
- Anthropic Claude API integration
- Lucide React icons

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts     # Claude API endpoint
│   ├── globals.scss         # Global styles with dark theme
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main chat interface
├── components/
│   ├── ChatMessage.tsx      # Message component with avatar and actions
│   └── ChatInput.tsx        # Auto-resizing input with send button
└── lib/
    └── claude.ts            # Claude API client
```

## Features

- **Dark Theme**: Custom dark interface matching Claude.ai design
- **Auto-resizing Textarea**: Input grows with content up to 200px max height
- **Message Actions**: Copy and regenerate responses from any point in conversation
- **Loading States**: Hourglass indicator during API calls
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- **Responsive Design**: 800px centered layout with proper spacing

## Environment Variables

Create a `.env.local` file with:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Styling

- **CSS Variables**: `--primary-color: #b0afed` for consistent theming
- **BEM Methodology**: Structured class naming for maintainability
- **Component-based**: Modular SCSS with component-specific styles
