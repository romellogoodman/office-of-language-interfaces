import { useEffect } from 'react';
import { Command } from '../constants.js';

interface UseCommandFilteringProps {
  input: string;
  allCommands: Command[];
  setFilteredCommands: (commands: Command[]) => void;
  setSelectedCommandIndex: (index: number) => void;
  setShowCommandSelector: (show: boolean) => void;
}

export const useCommandFiltering = ({
  input,
  allCommands,
  setFilteredCommands,
  setSelectedCommandIndex,
  setShowCommandSelector
}: UseCommandFilteringProps) => {
  useEffect(() => {
    if (input.startsWith("/") && input.length > 1) {
      const query = input.toLowerCase();
      const filtered = allCommands.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query.slice(1))
      );
      setFilteredCommands(filtered);
      setSelectedCommandIndex(0);
      setShowCommandSelector(filtered.length > 0);
    } else if (input === "/") {
      setFilteredCommands(allCommands);
      setSelectedCommandIndex(0);
      setShowCommandSelector(true);
    } else {
      setShowCommandSelector(false);
      setFilteredCommands([]);
    }
  }, [input, allCommands, setFilteredCommands, setSelectedCommandIndex, setShowCommandSelector]);
};