# Blink Electron - Desktop Chat Client

## Development Commands

```bash
# Start development with hot reload
npm run dev

# Build the application
npm run build

# Build and preview (production mode)
npm start

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run format

# Build distributables
npm run build:unpack  # Build without packaging
npm run build:win     # Windows installer
npm run build:mac     # macOS app bundle
npm run build:linux   # Linux AppImage/deb
```

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **electron-vite** - Fast build tooling with hot reload. [electron-vite documentation](https://electron-vite.org/)
- **React 19** - Modern UI framework with latest features
- **TypeScript** - Type-safe development
- **SCSS** - Advanced styling with variables and nesting
- **Vite** - Lightning-fast development server
- **Lucide React** - Beautiful iconography
- **Prism.js** - Syntax highlighting for code blocks
- **Anthropic Claude API** - AI chat integration

## Project Structure

```
blink-electron/
├── src/
│   ├── main/           # Electron main process
│   │   └── index.ts    # Main process entry point
│   ├── preload/        # Preload scripts (if needed)
│   │   └── index.ts    # Preload script
│   └── renderer/       # React application
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── ChatMessage.tsx    # Message display with actions
│       │   │   ├── ChatInput.tsx      # Auto-resizing input component
│       │   │   ├── SettingsModal.tsx  # Settings UI for API key/theme
│       │   │   ├── Response.tsx       # Markdown parser and renderer
│       │   │   ├── CodeBlock.tsx      # Syntax-highlighted code blocks
│       │   │   └── InlineCode.tsx     # Inline code formatting
│       │   ├── hooks/          # Custom React hooks
│       │   │   ├── useApiKey.ts       # API key management
│       │   │   └── useTheme.ts        # Theme switching logic
│       │   ├── lib/            # Utility libraries
│       │   │   └── claude.ts          # Claude API client
│       │   ├── scss/           # Styling
│       │   │   ├── globals.scss       # Global styles and themes
│       │   │   └── prism.scss         # Code syntax highlighting
│       │   ├── App.tsx         # Main application component
│       │   └── main.tsx        # React application entry
│       └── index.html          # HTML template
├── electron-builder.yml        # Build configuration
├── electron.vite.config.ts     # Vite configuration
└── package.json                # Dependencies and scripts
```

## Key Features

### 🎨 **Multi-Theme Support**

- **Dark Theme** (default): Deep grays with purple accent (#b0afed)
- **Light Theme**: Clean whites and light grays
- **System Theme**: Automatically follows OS preference
- Persistent theme selection with smooth transitions

### 💬 **Advanced Chat Interface**

- **Message History**: Full conversation context maintained
- **Auto-scroll**: Smooth scrolling to new messages
- **Message Actions**: Copy responses and regenerate from any point
- **Loading States**: Visual feedback during API calls
- **Auto-resizing Input**: Grows with content up to 200px max height

### ⚙️ **Settings Management**

- **API Key Storage**: Secure local storage (never sent to our servers)
- **Theme Controls**: Easy switching between light/dark/system
- **Direct Links**: Quick access to Anthropic Console for API keys
- **Persistent Settings**: All preferences saved locally

### 📝 **Rich Text Support**

- **Markdown Rendering**: Full markdown support with custom parser
- **Syntax Highlighting**: 20+ programming languages supported
- **Code Blocks**: Copy-to-clipboard functionality
- **Inline Code**: Styled inline code snippets
- **Lists & Links**: Proper formatting for structured content

### ⚡ **Developer Experience**

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **Modern Build**: electron-vite for optimal performance
- **Cross-platform**: Windows, macOS, and Linux support

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up API Key**
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - Launch the app and click the settings button (⚙️)
   - Enter your API key and save

3. **Start Development**

   ```bash
   npm run dev
   ```

4. **Start Chatting!**
   - The app will open automatically
   - Start typing in the input field
   - Use Shift+Enter for new lines, Enter to send

## Configuration

### Electron Builder

Packaging and distribution settings are in `electron-builder.yml`:

- App metadata and icons
- Platform-specific build options
- Auto-updater configuration
- Code signing settings (when configured)

### Vite Configuration

Build and development settings in `electron.vite.config.ts`:

- TypeScript compilation
- SCSS processing
- Asset optimization
- Hot reload configuration

## API Integration

The app uses the Anthropic Claude API directly from the renderer process:

- **Model**: Claude 3.5 Sonnet (latest)
- **Max Tokens**: 1000 per response
- **System Prompt**: Optimized for helpful, concise responses
- **Error Handling**: Graceful fallbacks and user feedback

## Security

- **API Keys**: Stored locally using localStorage, never transmitted to our servers
- **Content Security**: Proper CSP headers in development and production
- **No External Dependencies**: All chat data stays between you and Anthropic
- **Local Processing**: Markdown parsing and syntax highlighting happen locally

## Building for Distribution

```bash
# Build for all platforms (requires platform-specific tools)
npm run build:win    # Windows (requires Windows or wine)
npm run build:mac    # macOS (requires macOS)
npm run build:linux  # Linux

# Universal build (works on any platform)
npm run build:unpack
```

The built applications will be in the `dist/` directory.

## Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in input
- **Ctrl/Cmd + ,** - Open settings (when implemented)
- **F12** - Open developer tools

## Troubleshooting

### App Won't Start

- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install`
- Check for port conflicts (default: 5173)

### API Errors

- Verify your API key is correct
- Check your Anthropic account has credits
- Ensure stable internet connection

### Build Issues

- Install platform-specific build tools
- Check `electron-builder` documentation for requirements
- Verify all dependencies are properly installed
