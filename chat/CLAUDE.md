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
- Custom React hooks for state management

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
│   ├── ChatInput.tsx        # Auto-resizing input with send button
│   └── SettingsModal.tsx    # Settings modal for API key and theme
├── hooks/
│   ├── useApiKey.ts         # Custom hook for API key management
│   └── useTheme.ts          # Custom hook for theme switching
└── lib/
    └── claude.ts            # Claude API client
```

## Features

- **Multi-Theme Support**: Light, dark, and system theme options with automatic OS detection
- **Settings Modal**: User-friendly interface for API key management and theme switching
- **Auto-resizing Textarea**: Input grows with content up to 200px max height
- **Message Actions**: Copy and regenerate responses from any point in conversation
- **Loading States**: Hourglass indicator during API calls
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- **Auto-scroll**: Smooth scrolling to new messages
- **Smart Input Clearing**: Preserves text when no API key, clears immediately when sending
- **Responsive Design**: 800px centered layout with proper spacing
- **Client-side API Key Storage**: Secure localStorage with direct Anthropic Console links

## API Key Setup

No environment variables needed! The app uses client-side API key management:

1. Click the settings button (⚙️) in the chat input
2. Enter your Anthropic API key from the [Anthropic Console](https://console.anthropic.com/)
3. Choose your preferred theme (Light, Dark, or System)
4. Click Save

Your API key is stored securely in your browser's localStorage and never sent to any servers except Anthropic's API.

## Styling

- **CSS Variables**: `--primary-color: #b0afed` for consistent theming across light/dark modes
- **Theme System**: Comprehensive CSS variable system supporting:
  - **Dark Theme**: Deep grays with high contrast (#212121 background)
  - **Light Theme**: Clean whites and light grays (#fafaf9 background) 
  - **System Theme**: Automatically follows OS preference
- **BEM Methodology**: Structured class naming for maintainability
- **Component-based**: Modular SCSS with component-specific styles

## Custom Hooks

- **`useApiKey`**: Manages API key state and localStorage persistence
- **`useTheme`**: Handles theme switching, system detection, and persistence
