# Prompts and API Integration

This document explains the prompt system and API integration patterns used in the Oli website for AI-powered features.

## Overview

The application uses a structured approach to AI prompts and API integration, with reusable prompt templates and a centralized Claude API client.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │───▶│  Prompt System   │───▶│   Claude API    │
│ (ButtonGenerate)│    │ (src/prompts/)   │    │ (src/lib/claude)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    User Actions              Reusable                 External
   (Generate, Discuss)        Prompts                   API Calls
```

## Prompt System

### 1. Prompt Templates
All prompts are stored as TypeScript modules in `src/prompts/` for reusability and maintainability.

**Static Prompts:**
```typescript
// src/prompts/generate-research-tagline.ts
export const GENERATE_RESEARCH_TAGLINE_PROMPT = 
  "Generate a variation of this research lab tagline...";
```

**Dynamic Prompts:**
```typescript
// src/prompts/discuss-research.ts
export const DISCUSS_RESEARCH_PROMPT = (url: string) =>
  `I'd like to discuss this piece: ${url}...`;
```

### 2. Current Prompts
- **generate-research-tagline.ts**: Tagline variations
- **discuss-research.ts**: Research discussion starters
- **generate-error-poem.ts**: Humorous error handling

## API Integration

### 1. Claude API Client
The `fetchClaude` function in `src/lib/claude.ts` provides centralized API access with consistent error handling.

```typescript
interface ClaudeRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
}
```

### 2. Component Integration
Components use prompts through the `ButtonGenerate` pattern:

**Static Prompt Usage:**
```typescript
const { currentText, controls } = ButtonGenerate({
  initialText: "Starting text",
  prompt: GENERATE_RESEARCH_TAGLINE_PROMPT,
});
```

**Dynamic Prompt Usage:**
```typescript
const { currentText, controls } = ButtonGenerate({
  initialText: "Discussion starter", 
  generatePrompt: (currentText, generations) => 
    DISCUSS_RESEARCH_PROMPT(window.location.href),
});
```

## Usage Patterns

### 1. Text Generation
Used for generating variations of content like research taglines.

### 2. Content Discussion  
Used for generating discussion starters about research content.

### 3. Copy and Discuss Actions
Research posts include `ResearchActions` component for copying content and starting discussions.

## Security Considerations

### 1. API Key Protection
- API keys stored as environment variables
- Server-side API routes only
- Never expose keys in client code

### 2. Rate Limiting
- Implemented on API endpoints
- Prevents abuse through request throttling
- Middleware-based consistent limiting

### 3. Input Validation
- Sanitize inputs before API calls
- Validate prompt parameters
- Handle malformed requests gracefully

## Error Handling

### 1. API Errors
- Try/catch blocks around API calls
- User-friendly error messages
- Console logging for debugging

### 2. Network Issues
- Retry logic for failures
- Loading state indicators
- Graceful degradation when API unavailable

### 3. User Feedback
- Loading states during API calls
- Error messages in accessible language
- Fallback content when generation fails

## Best Practices

### 1. Prompt Design
- Keep prompts clear and specific
- Include context when helpful
- Test with various inputs
- Version prompts for significant changes

### 2. API Usage
- Use appropriate models for use cases
- Set reasonable token limits
- Monitor usage and costs
- Cache responses when appropriate

### 3. User Experience
- Show loading states during generation
- Allow navigation between generations
- Provide regeneration options
- Handle errors gracefully

## Development Workflow

### 1. Adding New Prompts
1. Create prompt file in `src/prompts/`
2. Export as named constant
3. Add TypeScript types if using parameters
4. Test with different inputs
5. Import and use in components

### 2. Component Usage
1. Import required prompts
2. Use `ButtonGenerate` for text generation
3. Implement proper error handling
4. Test user interactions
5. Add appropriate styling