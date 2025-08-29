# Blink Electron

A desktop chat application powered by Claude AI, built with Electron and React.

## Features

- **Multi-Theme Support**: Light, dark, and system theme options
- **Desktop Native**: Full desktop experience with system integration  
- **Message Actions**: Copy and regenerate responses from any point in conversation
- **Auto-resizing Input**: Input grows with content up to 200px max height
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- **Client-side API Key Storage**: Secure localStorage with direct Anthropic Console links

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Mode

Run the app in development mode with hot reloading:

```bash
npm run dev
```

In another terminal, start the Electron app:

```bash
npm run electron
```

Or run both concurrently:

```bash
npm run electron-dev
```

### Building

Build the React app for production:

```bash
npm run build
```

Run the production Electron app:

```bash
npm run electron
```

### Packaging

Create distributable packages:

```bash
npm run dist
```

This will create platform-specific distributables in the `dist-electron` directory.

## API Key Setup

1. Get your Anthropic API key from the [Anthropic Console](https://console.anthropic.com/)
2. Click the settings button (⚙️) in the chat input
3. Enter your API key and choose your preferred theme
4. Click Save

Your API key is stored securely in your local application data and never sent anywhere except Anthropic's API.

## Tech Stack

- **Electron**: Desktop app framework
- **React**: UI framework  
- **TypeScript**: Type safety
- **Webpack**: Module bundling
- **SCSS**: Styling with BEM methodology
- **Anthropic SDK**: Claude API integration
- **Lucide React**: Icons

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API clients
├── styles/             # SCSS stylesheets
├── App.tsx             # Main app component
└── index.tsx           # React entry point

main.js                 # Electron main process
preload.js             # Electron preload script
webpack.config.js       # Webpack configuration
```