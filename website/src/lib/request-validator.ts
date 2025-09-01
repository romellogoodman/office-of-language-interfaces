const ALLOWED_MODELS = [
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
  'claude-3-sonnet-20240229',
  'claude-3-5-sonnet-20241022',
];

const MAX_PROMPT_LENGTH = 4000; // characters
const MIN_PROMPT_LENGTH = 1;

// Patterns that might indicate harmful or abusive prompts
const BLOCKED_PATTERNS = [
  /jailbreak/i,
  /ignore.*instructions/i,
  /you are now/i,
  /pretend.*you are/i,
  /act as.*hacker/i,
  /generate.*malware/i,
  /create.*virus/i,
  /bypass.*safety/i,
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedPrompt?: string;
  sanitizedModel?: string;
}

export function validateRequest(prompt: string, model?: string): ValidationResult {
  // Validate prompt length
  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, error: 'Prompt is required and must be a string' };
  }

  if (prompt.length < MIN_PROMPT_LENGTH) {
    return { isValid: false, error: 'Prompt is too short' };
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { isValid: false, error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` };
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(prompt)) {
      console.warn('Blocked prompt pattern detected:', pattern);
      return { isValid: false, error: 'Prompt contains prohibited content' };
    }
  }

  // Validate model if provided
  let sanitizedModel = model;
  if (model && !ALLOWED_MODELS.includes(model)) {
    console.warn('Invalid model requested:', model);
    return { isValid: false, error: 'Invalid model specified' };
  }

  // Use default model if none provided
  if (!sanitizedModel) {
    sanitizedModel = 'claude-3-5-haiku-20241022';
  }

  // Basic prompt sanitization
  const sanitizedPrompt = prompt.trim();

  return {
    isValid: true,
    sanitizedPrompt,
    sanitizedModel,
  };
}

export function logRequest(ip: string, prompt: string, model: string, success: boolean, error?: string) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    ip,
    promptLength: prompt.length,
    model,
    success,
    error: error || null,
  };

  // In production, you'd want to use a proper logging service
  console.log('Claude API Request:', JSON.stringify(logData));
  
  // You could also write to a file or send to a logging service here
  // Example: fs.appendFileSync('claude-api.log', JSON.stringify(logData) + '\n');
}