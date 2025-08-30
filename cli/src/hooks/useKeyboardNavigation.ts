import { useInput } from 'ink';
import { Command } from '../constants.js';

interface UseKeyboardNavigationProps {
  showCommandSelector: boolean;
  filteredCommands: Command[];
  selectedCommandIndex: number;
  setSelectedCommandIndex: (index: number) => void;
  setInput: (value: string) => void;
  setShowCommandSelector: (show: boolean) => void;
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  escapeCount: number;
  setEscapeCount: (count: number | ((prev: number) => number)) => void;
  escapeTimeout: NodeJS.Timeout | null;
  setEscapeTimeout: (timeout: NodeJS.Timeout | null) => void;
  setIsLoading: (loading: boolean) => void;
  setOutput: (updater: (prev: string[]) => string[]) => void;
  cycleMode: () => void;
}

export const useKeyboardNavigation = ({
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
}: UseKeyboardNavigationProps) => {
  const handleEscape = () => {
    if (escapeTimeout) clearTimeout(escapeTimeout);
    
    setEscapeCount(prev => prev + 1);
    
    const timeout = setTimeout(() => {
      setEscapeCount(0);
    }, 1000);
    
    setEscapeTimeout(timeout);
    
    if (escapeCount === 0) {
      setInput("");
      setHistoryIndex(-1);
      if (showCommandSelector) {
        setShowCommandSelector(false);
      }
    } else if (escapeCount === 1) {
      setIsLoading(false);
      setOutput(prev => [...prev, "⚠️ Agent stopped by user", ""]);
    }
  };

  useInput((_, key) => {
    // Handle Shift+Tab for mode switching
    if (key.shift && key.tab) {
      cycleMode();
      return;
    }

    // Handle escape with double-escape detection
    if (key.escape) {
      handleEscape();
      return;
    }

    if (showCommandSelector && filteredCommands.length > 0) {
      // Command selector navigation
      if (key.upArrow) {
        setSelectedCommandIndex(
          selectedCommandIndex > 0 ? selectedCommandIndex - 1 : filteredCommands.length - 1
        );
      } else if (key.downArrow) {
        setSelectedCommandIndex(
          selectedCommandIndex < filteredCommands.length - 1 ? selectedCommandIndex + 1 : 0
        );
      } else if (key.return) {
        const selectedCommand = filteredCommands[selectedCommandIndex];
        if (selectedCommand) {
          setInput(selectedCommand.name + " ");
          setShowCommandSelector(false);
        }
      }
    } else {
      // Command history navigation
      if (key.upArrow && commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
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
      }
    }
  });
};