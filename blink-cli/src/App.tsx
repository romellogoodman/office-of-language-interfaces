import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import { Agent } from "./agent.js";
import { Command, COMMANDS } from "./constants.js";
import { ContextUsage } from "./context.js";

// Components
import OutputFormatter from "./components/OutputFormatter.js";
import StatusBar from "./components/StatusBar.js";
import CommandSelector from "./components/CommandSelector.js";
import ChatHistory from "./components/ChatHistory.js";
import LoadingIndicator from "./components/LoadingIndicator.js";
import InputArea from "./components/InputArea.js";

// Hooks
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation.js";
import { useCommandFiltering } from "./hooks/useCommandFiltering.js";

const App: React.FC = () => {
  // State variables
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Command suggestion state
  const [showCommandSelector, setShowCommandSelector] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [allCommands, setAllCommands] = useState<Command[]>(COMMANDS);

  // Command history state
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Mode switching state
  const [currentMode, setCurrentMode] = useState<'regular' | 'autopilot' | 'planning'>('regular');
  const [escapeCount, setEscapeCount] = useState(0);
  const [escapeTimeout, setEscapeTimeout] = useState<NodeJS.Timeout | null>(null);


  // Context state
  const [contextUsage, setContextUsage] = useState<ContextUsage>({
    used: 0,
    total: 200000,
    percentage: 0
  });

  // Agent instance
  const [agent] = useState(() => new Agent({ mode: "regular" }));

  // Mode cycling helper
  const cycleMode = () => {
    const modes: ('regular' | 'autopilot' | 'planning')[] = ['regular', 'autopilot', 'planning'];
    const currentIndex = modes.indexOf(currentMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setCurrentMode(nextMode);
    agent.setMode(nextMode);
  };

  // Input handling functions
  const handleInputChange = (value: string) => {
    setInput(value);
    setHistoryIndex(-1);
  };

  // Command execution handler
  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    // If command selector is showing, don't execute - let arrow keys handle selection
    if (showCommandSelector && filteredCommands.length > 0) {
      const selectedCommand = filteredCommands[selectedCommandIndex];
      if (selectedCommand) {
        setInput(selectedCommand.name + " ");
        setShowCommandSelector(false);
      }
      return;
    }

    // Add command to history (avoid duplicates)
    const trimmedValue = value.trim();
    setCommandHistory((prev) => {
      const filtered = prev.filter((cmd) => cmd !== trimmedValue);
      return [...filtered, trimmedValue].slice(-50); // Keep last 50 commands
    });

    // Reset history index
    setHistoryIndex(-1);

    setOutput((prev) => [...prev, `> ${value}`]);
    setInput("");
    setShowCommandSelector(false);
    setIsLoading(true);

    try {
      const result = await agent.processInput(trimmedValue);
      setOutput((prev) => [...prev, result, ""]);

      // Update auth status if login/logout was used
      if (
        trimmedValue.startsWith("/login") ||
        trimmedValue.startsWith("/logout")
      ) {
        const newAuthStatus = await agent.isAuthenticated();
        setIsAuthenticated(newAuthStatus);
      }

      // Update commands if new command was generated
      if (trimmedValue.startsWith("/command")) {
        setAllCommands(agent.getAllCommands());
      }
    } catch (error: any) {
      setOutput((prev) => [...prev, `Error: ${error.message}`, ""]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize app and check authentication
  useEffect(() => {
    // Show welcome message and check auth status
    const checkAuth = async () => {
      const authenticated = await agent.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        setOutput([
          "To get started:",
          "1. Login with your Anthropic API key: /login <your-api-key>",
          "2. Type '/' to see available commands",
          "3. Start chatting with the AI!",
          "",
        ]);
      }
    };

    checkAuth();

    // Set up context manager listener
    const contextManager = agent.getContextManager();
    const unsubscribeContext = contextManager.onUpdate((usage) => {
      setContextUsage(usage);
    });

    // Update commands list to include custom commands
    const updateCommands = () => {
      setAllCommands(agent.getAllCommands());
    };
    updateCommands();

    // Set up conversation callback for tool calls
    agent.setConversationCallback((message: string) => {
      setOutput(prev => [...prev, message]);
    });

    return () => {
      unsubscribeContext();
    };
  }, [agent]);

  // Use custom hooks
  useCommandFiltering({
    input,
    allCommands,
    setFilteredCommands,
    setSelectedCommandIndex,
    setShowCommandSelector
  });

  useKeyboardNavigation({
    showCommandSelector,
    filteredCommands,
    selectedCommandIndex,
    setSelectedCommandIndex,
    setInput,
    setShowCommandSelector,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    escapeCount,
    setEscapeCount,
    escapeTimeout,
    setEscapeTimeout,
    setIsLoading,
    setOutput,
    cycleMode
  });

  return (
    <Box flexDirection="column" height={30}>
      <Text> </Text>
      <Text color="cyan" bold>
        👀 Blink CLI - AI Coding Assistant
      </Text>
      <Text> </Text>

      <ChatHistory output={output} />

      <LoadingIndicator isVisible={isLoading} />

      <Text> </Text>

      <InputArea
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      <StatusBar
        currentMode={currentMode}
        contextUsage={contextUsage}
      />

      <CommandSelector
        isVisible={showCommandSelector}
        commands={filteredCommands}
        selectedIndex={selectedCommandIndex}
      />
    </Box>
  );
};

export default App;