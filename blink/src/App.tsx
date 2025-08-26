import React, { useState, useEffect } from "react";
import { Text, Box, useInput } from "ink";
import TextInput from "ink-text-input";
import { Agent } from "./agent.js";
import { Command, COMMANDS } from "./constants.js";

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

  // Command history state
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Agent instance
  const [agent] = useState(() => new Agent({ mode: "regular" }));

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
  }, [agent]);

  // Handle input changes for command filtering
  useEffect(() => {
    if (input.startsWith("/") && input.length > 1) {
      const query = input.toLowerCase();
      const filtered = COMMANDS.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query.slice(1))
      );
      setFilteredCommands(filtered);
      setSelectedCommandIndex(0);
      setShowCommandSelector(filtered.length > 0);
    } else if (input === "/") {
      setFilteredCommands(COMMANDS);
      setSelectedCommandIndex(0);
      setShowCommandSelector(true);
    } else {
      setShowCommandSelector(false);
      setFilteredCommands([]);
    }
  }, [input]);

  // Input handling functions
  const handleInputChange = (value: string) => {
    setInput(value);
    setHistoryIndex(-1);
  };

  // Keyboard navigation handler
  useInput((_, key) => {
    if (showCommandSelector && filteredCommands.length > 0) {
      // Command selector navigation
      if (key.upArrow) {
        setSelectedCommandIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (key.downArrow) {
        setSelectedCommandIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (key.return) {
        const selectedCommand = filteredCommands[selectedCommandIndex];
        if (selectedCommand) {
          setInput(selectedCommand.name + " ");
          setShowCommandSelector(false);
        }
      } else if (key.escape) {
        setShowCommandSelector(false);
        setInput("");
      }
    } else {
      // Command history navigation (when not showing command selector)
      if (key.upArrow && commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (key.downArrow) {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
      } else if (key.escape) {
        // Clear input when escape is pressed (in any context)
        setInput("");
        setHistoryIndex(-1);
      }
    }
  });

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
    } catch (error: any) {
      setOutput((prev) => [...prev, `Error: ${error.message}`, ""]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flexDirection="column">
      <Text> </Text>
      <Text color="cyan" bold>
        👀 Blink CLI - AI Coding Assistant
      </Text>
      <Text> </Text>

      {output.map((line, index) => {
        const isCommand = line.startsWith(">");
        const prevLine = output[index - 1];
        const nextLine = output[index + 1];
        const isFirstCommand = isCommand && !prevLine?.startsWith(">");
        const isLastCommand = isCommand && !nextLine?.startsWith(">");
        
        return (
          <React.Fragment key={index}>
            {isFirstCommand && <Text> </Text>}
            <Text color="white" dimColor={isCommand}>
              {line}
            </Text>
            {isLastCommand && <Text> </Text>}
          </React.Fragment>
        );
      })}

      {isLoading && <Text color="yellow">🤔 Thinking...</Text>}

      <Text> </Text>

      <Box>
        <Text color="blue">$ </Text>
        <TextInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </Box>

      {/* Status line */}
      <Box
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
        marginTop={1}
        justifyContent="space-between"
      >
        {/* Left side - Mode */}
        <Box>
          <Text color="green" bold>
            {agent.getMode().toUpperCase()} MODE
          </Text>
          <Text dimColor> | </Text>
          <Text color={isAuthenticated ? "green" : "red"}>
            {isAuthenticated ? "✅ Logged in" : "❌ Not logged in"}
          </Text>
        </Box>

        {/* Right side - Shortcuts */}
        <Box>
          <Text dimColor>
            {showCommandSelector
              ? "↑↓: navigate • enter: select • esc: cancel"
              : "↑↓: history • /: commands"}
          </Text>
        </Box>
      </Box>

      {/* Live command suggestions */}
      {showCommandSelector && filteredCommands.length > 0 && (
        <Box flexDirection="column" marginTop={1} paddingLeft={2}>
          {filteredCommands.map((cmd, index) => (
            <Box key={cmd.name}>
              <Text color={index === selectedCommandIndex ? "blue" : "gray"}>
                {index === selectedCommandIndex ? "❯ " : "  "}
              </Text>
              <Text color={index === selectedCommandIndex ? "blue" : "white"}>
                {cmd.usage}
              </Text>
              <Text color="gray" dimColor>
                {" - " + cmd.description}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default App;
