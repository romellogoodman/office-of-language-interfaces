import React from 'react';
import { Text, Box } from 'ink';
import OutputFormatter from './OutputFormatter.js';

interface ChatHistoryProps {
  output: string[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ output }) => {
  return (
    <Box flexDirection="column">
      {output.map((line, index) => {
        const isCommand = line.startsWith(">");
        const prevLine = output[index - 1];
        const nextLine = output[index + 1];
        const isFirstCommand = isCommand && !prevLine?.startsWith(">");
        const isLastCommand = isCommand && !nextLine?.startsWith(">");
        
        return (
          <React.Fragment key={index}>
            {isFirstCommand && <Text> </Text>}
            {isCommand ? (
              <Text color="white" dimColor>
                {line}
              </Text>
            ) : (
              <OutputFormatter content={line} />
            )}
            {isLastCommand && <Text> </Text>}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default ChatHistory;