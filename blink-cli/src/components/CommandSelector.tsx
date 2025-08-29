import React from 'react';
import { Text, Box } from 'ink';
import { Command } from '../constants.js';

interface CommandSelectorProps {
  isVisible: boolean;
  commands: Command[];
  selectedIndex: number;
}

const CommandSelector: React.FC<CommandSelectorProps> = ({ 
  isVisible, 
  commands, 
  selectedIndex 
}) => {
  if (!isVisible || commands.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingLeft={2}>
      {commands.map((cmd, index) => (
        <Box key={cmd.name}>
          <Text color={index === selectedIndex ? "blue" : "gray"}>
            {index === selectedIndex ? "❯ " : "  "}
          </Text>
          <Text color={index === selectedIndex ? "blue" : "white"}>
            {cmd.usage}
          </Text>
          <Text color="gray" dimColor>
            {" - " + cmd.description}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default CommandSelector;