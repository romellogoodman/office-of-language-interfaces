# CLI AI Agent Design Specification

## Implementation Priorities

### Phase 1: Core Foundation
1. **Authentication & API Setup**
   - API key management via `/login` command
   - Secure key storage in ~/.agent/auth.json
   - Anthropic API client initialization
   - Basic model selection (claude-3-opus, claude-3-sonnet, etc.)

2. **Core agent loop with basic tool system**
   - Single control loop architecture
   - Message history management
   - Anthropic API integration
   - Basic tool execution framework

3. **Essential Tools (MVP)**
   - `read_file` - Read file contents
   - `write_file` - Create/overwrite files
   - `edit_file` - Modify existing files
   - `list_files` - List directory contents
   - `execute_command` - Run shell commands

### Phase 2: Context & Configuration
4. **AGENTS.md discovery and parsing**
   - File discovery at project root
   - Markdown parsing for instructions
   - Hierarchical loading for monorepos

5. **Advanced Model Configuration**
   - Model selection from JSON config
   - Model-specific parameters (temperature, max_tokens)
   - Multiple account switching support

### Phase 3: User Experience
6. **Mode switching with UI indicators**
   - Three modes: Regular, Auto-Pilot, Planning
   - Shift+Tab for mode cycling
   - Visual mode indicator in UI
   - Double-Escape to stop execution

7. **Task Management System**
   - Todo list with pending/in_progress/completed states
   - UI sidebar display
   - Single task in_progress limit

### Phase 4: Advanced Features
8. **Context management and visual feedback**
   - Real-time token usage display
   - Color-coded usage indicators
   - Simple auto-compaction at 80% threshold

9. **Custom slash commands**
   - Load from `.agent/commands/`
   - Frontmatter parsing
   - Argument substitution

---

## Technology Stack

### Core Technologies
- **Language**: TypeScript
- **CLI Framework**: React Ink (for interactive terminal UI)
- **API**: Anthropic Claude API (user-provided keys)
- **UI Components**: ink-spinner, ink-progress-bar for loading states

---

## UI/UX Components

### Loading Indicators
Visual feedback for all async operations with interrupt instructions:

```typescript
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import ProgressBar from 'ink-progress-bar';

interface LoadingState {
  type: 'thinking' | 'tool' | 'api' | 'streaming';
  message: string;
  progress?: number;
  details?: string;
  isInterruptible?: boolean;
}

const LoadingIndicator: React.FC<{ state: LoadingState }> = ({ state }) => {
  const getSpinnerType = () => {
    switch (state.type) {
      case 'thinking': return 'dots';
      case 'tool': return 'arc';
      case 'api': return 'bouncingBar';
      case 'streaming': return 'line';
      default: return 'dots';
    }
  };

  const getColor = () => {
    switch (state.type) {
      case 'thinking': return 'cyan';
      case 'tool': return 'yellow';
      case 'api': return 'blue';
      case 'streaming': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color={getColor()}>
          <Spinner type={getSpinnerType()} />
        </Text>
        <Text> {state.message}</Text>
        {state.isInterruptible && (
          <Text dimColor> (esc to interrupt)</Text>
        )}
      </Box>
      
      {state.progress !== undefined && (
        <Box marginLeft={2}>
          <ProgressBar percent={state.progress} />
          <Text dimColor> {Math.round(state.progress * 100)}%</Text>
        </Box>
      )}
      
      {state.details && (
        <Text dimColor marginLeft={2}>
          {state.details}
        </Text>
      )}
    </Box>
  );
};
```

### Status Bar
Persistent status information below the main interface:

```typescript
import { Box, Text, useApp } from 'ink';

interface StatusBarProps {
  mode: 'Regular' | 'Auto-Pilot' | 'Planning';
  contextUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  apiStatus: 'connected' | 'disconnected' | 'error';
  currentModel: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  mode, 
  contextUsage, 
  apiStatus,
  currentModel 
}) => {
  const getModeColor = () => {
    switch (mode) {
      case 'Regular': return 'green';
      case 'Auto-Pilot': return 'yellow';
      case 'Planning': return 'blue';
    }
  };
  
  const getContextColor = () => {
    if (contextUsage.percentage < 60) return 'green';
    if (contextUsage.percentage < 85) return 'yellow';
    return 'red';
  };
  
  const formatTokens = (num: number) => {
    if (num < 1000) return `${num}`;
    return `${(num / 1000).toFixed(1)}k`;
  };
  
  return (
    <Box 
      borderStyle="single" 
      borderColor="gray"
      paddingX={1}
      justifyContent="space-between"
      width="100%"
    >
      {/* Left side - Mode and Model */}
      <Box>
        <Text color={getModeColor()} bold>
          {mode} Mode
        </Text>
        <Text dimColor> | </Text>
        <Text dimColor>{currentModel}</Text>
      </Box>
      
      {/* Center - Context Usage */}
      <Box>
        <Text>Context: </Text>
        <Text color={getContextColor()}>
          {formatTokens(contextUsage.used)}/{formatTokens(contextUsage.total)}
        </Text>
        <Text dimColor> ({contextUsage.percentage}%)</Text>
      </Box>
      
      {/* Right side - Shortcuts */}
      <Box>
        <Text dimColor>
          shift+tab: cycle mode | esc×2: stop | /help: commands
        </Text>
      </Box>
    </Box>
  );
};
```

### Loading States Throughout the App

```typescript
class UIManager {
  private loadingStates: Map<string, LoadingState> = new Map();
  
  // Different loading scenarios with interrupt capability
  showThinking(): void {
    this.setLoading('main', {
      type: 'thinking',
      message: 'Claude is thinking',
      isInterruptible: true
    });
  }
  
  showToolExecution(toolName: string, description?: string): void {
    this.setLoading('tool', {
      type: 'tool',
      message: `Executing ${toolName}`,
      details: description,
      isInterruptible: true
    });
  }
  
  showApiCall(endpoint: string): void {
    this.setLoading('api', {
      type: 'api',
      message: 'Calling Anthropic API',
      details: endpoint,
      isInterruptible: false
    });
  }
  
  showStreaming(bytesReceived: number, totalBytes?: number): void {
    const progress = totalBytes ? bytesReceived / totalBytes : undefined;
    this.setLoading('stream', {
      type: 'streaming',
      message: 'Streaming response',
      progress,
      details: `${bytesReceived} bytes received`,
      isInterruptible: true
    });
  }
  
  showFileOperation(operation: string, file: string, progress?: number): void {
    this.setLoading('file', {
      type: 'tool',
      message: `${operation} ${file}`,
      progress,
      isInterruptible: false
    });
  }
  
  clearLoading(id: string): void {
    this.loadingStates.delete(id);
    this.render();
  }
  
  private setLoading(id: string, state: LoadingState): void {
    this.loadingStates.set(id, state);
    this.render();
  }
}
```

### Smart Loading Messages
Context-aware loading messages that change based on duration:

```typescript
class SmartLoadingMessage {
  private startTime: number;
  private messages: { after: number; message: string }[] = [
    { after: 0, message: 'Starting...' },
    { after: 3000, message: 'Still working...' },
    { after: 8000, message: 'This is taking a bit longer...' },
    { after: 15000, message: 'Almost there...' },
    { after: 30000, message: 'Thank you for your patience...' }
  ];
  
  constructor(private baseMessage: string) {
    this.startTime = Date.now();
  }
  
  getMessage(): string {
    const elapsed = Date.now() - this.startTime;
    const timedMessage = this.messages
      .reverse()
      .find(m => elapsed >= m.after)?.message || '';
    
    return `${this.baseMessage} ${timedMessage}`;
  }
}
```

### Loading Indicator Integration Points

1. **API Calls**:
   - Show spinner when sending to Anthropic
   - Progress bar for streaming responses
   - Time estimate based on token count

2. **Tool Execution**:
   - Different spinners per tool type
   - Progress for file operations
   - Real-time output for streaming tools

3. **Long Operations**:
   - Checkpoint creation/restoration
   - Context condensation
   - Multi-file operations

4. **User Feedback**:
   - Subtle animations for thinking
   - Clear progress for deterministic operations
   - Cancelable operations show "Press Esc to cancel"

---

## Core Architecture
*Based on Ampcode's minimalist approach*

### Conversation Loop
Simple state management with single control loop (no complex branching):
```typescript
interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

class Agent {
  private messages: Message[] = [];
  
  async run(): Promise<void> {
    while (true) {
      const input = await getUserInput();
      const result = await this.processInput(input);
      
      // Maximum one level of sub-agent spawning
      if (result.needsSubAgent) {
        await this.spawnSubAgent(result.task); // No recursion allowed
      }
      
      this.display(result);
    }
  }
  
  async processInput(input: string): Promise<Result> {
    // 1. Add user input to messages
    // 2. Send full conversation to Anthropic API
    // 3. Check for tool usage in response
    // 4. Execute tools if requested
    // 5. Add tool results back to conversation
    // 6. Continue until complete
  }
}
```
**Key principle**: Debuggability > Complex multi-agent systems

### Exception-Based Control Flow
Clean error handling pattern from mini-swe-agent:
```typescript
// Exception-based control flow for clean state management
class NonTerminatingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonTerminatingException';
  }
}

class TerminatingException extends Error {
  constructor(public readonly result: any) {
    super('Task complete');
    this.name = 'TerminatingException';
  }
}

class Agent {
  async processInput(input: string): Promise<Result> {
    try {
      // Normal processing
      const response = await this.llm.complete(this.messages);
      
      if (response.toolCalls) {
        for (const call of response.toolCalls) {
          await this.executeTool(call);
        }
      }
      
      // Check completion conditions
      if (this.isTaskComplete(response)) {
        throw new TerminatingException(response);
      }
      
      return response;
    } catch (e) {
      if (e instanceof NonTerminatingException) {
        // Continue with error message to LLM
        this.messages.push({ role: 'system', content: e.message });
        return await this.processInput(''); // Retry
      }
      if (e instanceof TerminatingException) {
        return e.result; // Clean exit
      }
      throw e; // Unexpected error
    }
  }
}
```

### Tool System
Enhanced TypeScript implementation with validation and metadata:
```typescript
import { z } from 'zod';

interface ToolMetadata {
  category: 'file' | 'shell' | 'search' | 'edit' | 'mcp';
  requiresApproval: boolean;
  streaming: boolean;
  timeout?: number;
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (input: any) => Promise<string>;
}

interface StreamingTool extends ToolDefinition {
  executeStream: (
    input: any,
    onChunk: (chunk: string) => void
  ) => Promise<string>;
}

class ToolRegistry {
  private tools: Map<string, ToolDefinition & ToolMetadata> = new Map();
  
  register(tool: ToolDefinition & ToolMetadata): void {
    this.tools.set(tool.name, tool);
  }
  
  // Zod validation for tool parameters (from opencode pattern)
  registerWithValidation(
    tool: ToolDefinition & ToolMetadata, 
    schema: z.ZodSchema
  ): void {
    this.tools.set(tool.name, {
      ...tool,
      execute: async (input: any) => {
        const validated = schema.parse(input);
        return await tool.execute(validated);
      }
    });
  }
  
  async executeTool(name: string, input: any): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool ${name} not found`);
    return await tool.execute(input);
  }
  
  // Provider-specific adaptations (from codex/gemini-cli pattern)
  getToolsForProvider(provider: string): ToolDefinition[] {
    return Array.from(this.tools.values()).map(tool => {
      if (provider === 'anthropic') return tool;
      // Provider-specific schema transformations
      return this.adaptToolForProvider(tool, provider);
    });
  }
}
```

### Implementation Principles
From Ampcode's "elbow grease" philosophy:
- **Minimal abstraction** - Direct API integration, no unnecessary layers
- **Tool-centric design** - Agent capabilities come from tools, not complex architecture
- **Stateless simplicity** - Send full conversation history (until optimization needed)
- **Keep the agent loop minimal** - Focus on simplicity and debuggability
- **Error-to-LLM pattern** - Return errors to model for self-correction

---

## Operating Modes

### 1. Regular Mode (Default)
- Interactive chat with tool execution capabilities
- Can create, edit, and manipulate files
- **Smart permission system**:
  - First-time tool use requires permission
  - Users can select "Always allow for this project"
  - Approved tools saved to `.agent/permissions.json`
  - Destructive operations (delete, overwrite) always require confirmation
  - Non-destructive operations (read, list) can be pre-approved
- Clear confirmation prompts with "always allow" option

### 2. Auto-Pilot Mode
- Autonomous execution without permission prompts
- Proceeds with tool usage and file operations automatically
- User can interrupt at any time
- Should show progress/status of operations
- Activated via command or flag

### 3. Planning Mode
- Discussion and planning without execution
- Focus on:
  - Creating implementation checklists
  - Breaking down tasks into steps
  - Architectural discussions
  - Design decisions
- No tool execution or file operations
- Generates actionable plans and specifications
- Transition to execution modes when ready

### Mode Controls
- **Shift+Tab**: Cycle between modes (Regular → Auto-Pilot → Planning → Regular)
- **Mode Indicator**: Always visible in UI showing current mode
- **Escape (2x)**: Stop agent execution
  - First press: Ready to stop
  - Second press: Stops agent with clear indication "Agent stopped by user"

---

## Top-Level Features

### 1. AGENTS.md Support
- Automatically discover and load AGENTS.md files from project root
- Parse markdown for project-specific instructions and context
- Support hierarchical loading for monorepos (nearest file takes precedence)

### 2. Custom Slash Command Support
- Load custom commands from `.agent/commands/` directory
- Support markdown-based command definitions with frontmatter
- Enable argument substitution with `$ARGUMENTS` placeholder
- Allow bash command execution and file inclusion within commands

### 3. Built-in Slash Commands
- `/clear` - Clear conversation history
- `/compact [instructions]` - Compact conversation with optional focus instructions
- `/help` - Get usage help
- `/init` - Initialize project with AGENTS.md guide
- `/login [api-key]` - Switch Anthropic accounts (accepts API key as argument)
- `/logout` - Sign out from your Anthropic account
- `/model` - Select from available Anthropic models (loaded from JSON configuration)
- `/command <name> <description>` - Create a new custom slash command using AI to generate the template

---

## Essential Tools (MVP)
Following Ampcode's basic tool set (see [CLAUDE_CODE_TOOLS.md](CLAUDE_CODE_TOOLS.md) for Claude Code's implementation):
1. **read_file** - Read file contents
2. **write_file** - Create/overwrite files
3. **edit_file** - Modify existing files
4. **list_files** - List directory contents
5. **execute_command** - Run shell commands (with mode-based permissions)

### Tool Abstraction Hierarchy
Design tools at different abstraction levels:
```typescript
// Low-level tools (direct operations)
const readFile = { name: 'read_file', /* direct fs.readFile */ };
const writeFile = { name: 'write_file', /* direct fs.writeFile */ };

// Mid-level tools (composed operations)  
const searchProject = { name: 'search_project', /* grep + context */ };
const replaceInFiles = { name: 'replace_in_files', /* find + edit */ };

// High-level tools (complex workflows)
const refactorComponent = { name: 'refactor_component', /* multi-step */ };
const generateTests = { name: 'generate_tests', /* analyze + create */ };
```

---

## Task Management System
Based on Claude Code's proven todo system:
```typescript
interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm?: string; // Display text when in_progress
}

class TodoManager {
  private todos: Todo[] = [];
  private currentTask: Todo | null = null;
  
  // Only ONE task can be in_progress at a time
  markInProgress(todo: Todo): void {
    if (this.currentTask) {
      throw new Error('Complete current task first');
    }
    todo.status = 'in_progress';
    this.currentTask = todo;
  }
  
  // Proactive updates - mark complete immediately
  markComplete(todo: Todo): void {
    todo.status = 'completed';
    if (this.currentTask === todo) {
      this.currentTask = null;
    }
  }
}
```
- Display todo list in UI sidebar
- Automatically track multi-step operations
- System reminders when todo list is empty

---

## System Prompt Design
Following Claude Code's ~2800 token comprehensive prompt (see [CLAUDE_CODE_SYSTEM_PROMPT.md](CLAUDE_CODE_SYSTEM_PROMPT.md) for reference):
- **Structure sections**:
  - Tone and style guidelines (varies by mode)
  - Tool usage policies
  - Task management rules
  - Convention following instructions
  - Proactiveness boundaries
  - Error handling patterns
- **Use XML tags for system reminders**:
  ```xml
  <system-reminder>Critical context or state information</system-reminder>
  ```
- **Keywords for emphasis**: "IMPORTANT", "ALWAYS", "NEVER"
- **Mode-specific variations**: Different prompts for Regular/Auto-Pilot/Planning

---

## Authentication & Model Configuration

### API Key Management
- Built exclusively for Anthropic models
- Users provide their own Anthropic API key via `/login` command
- Support multiple account switching
- Secure key storage (consider using system keychain)

### Permission Management
- Store approved tools in `.agent/permissions.json`
- Simple per-tool permissions: always/ask/never
- Per-project permission persistence
- Default categories:
  - Always allowed: read_file, list_files
  - Ask by default: write_file, edit_file, execute_command
  - Always ask: delete operations, git commits

### Simple Permission System
Basic per-tool permissions for MVP:
```typescript
interface ToolPermission {
  tool: string;          // Tool name: read_file, write_file, execute_command
  action: 'always' | 'ask' | 'never';
}

class PermissionManager {
  private permissions: Map<string, 'always' | 'ask' | 'never'> = new Map();
  
  constructor() {
    this.loadPermissions();
  }
  
  async checkPermission(tool: string): Promise<boolean> {
    const permission = this.permissions.get(tool) || 'ask';
    
    switch (permission) {
      case 'always':
        return true;
      case 'never':
        return false;
      case 'ask':
        return await this.promptUser(tool);
    }
  }
  
  async setPermission(tool: string, action: 'always' | 'ask' | 'never'): Promise<void> {
    this.permissions.set(tool, action);
    await this.savePermissions();
  }
  
  private async loadPermissions(): Promise<void> {
    const path = '.agent/permissions.json';
    if (fs.existsSync(path)) {
      const data = JSON.parse(await fs.readFile(path, 'utf-8'));
      data.permissions.forEach((p: ToolPermission) => {
        this.permissions.set(p.tool, p.action);
      });
    } else {
      // Set defaults
      this.permissions.set('read_file', 'always');
      this.permissions.set('list_files', 'always');
      this.permissions.set('write_file', 'ask');
      this.permissions.set('edit_file', 'ask');
      this.permissions.set('execute_command', 'ask');
    }
  }
  
  private async savePermissions(): Promise<void> {
    const permissions = Array.from(this.permissions.entries()).map(
      ([tool, action]) => ({ tool, action })
    );
    
    await fs.writeFile('.agent/permissions.json', JSON.stringify({
      version: 1,
      permissions,
      timestamp: new Date().toISOString()
    }, null, 2));
  }
}
```

### Example Permission File
```json
{
  "version": 1,
  "permissions": [
    { "tool": "read_file", "action": "always" },
    { "tool": "list_files", "action": "always" },
    { "tool": "write_file", "action": "ask" },
    { "tool": "edit_file", "action": "ask" },
    { "tool": "execute_command", "action": "ask" }
  ]
}
```

### Model Selection
- Maintain JSON configuration file with available Anthropic models
- `/model` command displays and allows selection from available models
- Support model-specific capabilities and context limits

---

## Context Window Management

### Visual Indicator
- Display real-time context usage in UI (e.g., "Context: 45k/200k tokens")
- Show percentage bar or visual indicator of context consumption
- Color coding: green (0-60%), yellow (60-85%), red (85-100%)

### Auto-Compaction
- Simple truncation when context reaches 80% threshold
- Keep first N messages (system prompt + initial request)
- Keep last N messages (recent context)
- Show notification: "Auto-compacting conversation..."
- User can configure threshold in settings (60-90% range)

### Simple Context Management
Basic truncation strategy for MVP:

```typescript
class SimpleContextManager {
  private maxTokens = 200000;  // Model limit
  private targetUsage = 0.8;   // Compact at 80%
  
  async autoCompact(messages: Message[]): Promise<Message[]> {
    const currentTokens = this.countTokens(messages);
    
    if (currentTokens < this.maxTokens * this.targetUsage) {
      return messages; // No compaction needed
    }
    
    // Simple truncation: keep first 2 and last 20 messages
    const compacted: Message[] = [];
    
    // Always keep system prompt and initial request
    compacted.push(messages[0], messages[1]);
    
    // Add truncation notice
    compacted.push({
      role: 'system',
      content: '<context_truncated>Older messages removed to save space</context_truncated>'
    });
    
    // Keep recent context
    compacted.push(...messages.slice(-20));
    
    return compacted;
  }
  
  private countTokens(messages: Message[]): number {
    // Simple estimation: ~4 characters per token
    const text = messages.map(m => m.content).join(' ');
    return Math.ceil(text.length / 4);
  }
}
```

### Context Rules
1. **Always keep**:
   - System prompt (message 0)
   - Initial user request (message 1)
   - Last 20 messages (recent context)

2. **When truncating**:
   - Add clear marker showing truncation occurred
   - Preserve conversation continuity
   - Keep enough context for the agent to understand current task

### Context Preservation
- **Project context file**: Support `.agent/context.md` for persistent preferences
- **Layered context loading**:
  1. System defaults
  2. AGENTS.md (project-wide)
  3. `.agent/context.md` (user-specific)
- **System reminders**: Inject critical context as XML tags
- **Flat message history**: No nested conversations for clarity

---

## Future Features

See [DESIGN_SPEC_v2.md](DESIGN_SPEC_v2.md) for advanced features planned for v1.2+ and v2.0, including:
- MCP Integration
- Checkpoint System
- Context Condensation Algorithm
- Wildcard Permission System
- Streaming Tool Execution
- Session Persistence
- And more...