import React from 'react';
import { Text, Box } from 'ink';
import { ContextUsage } from '../context.js';

interface StatusBarProps {
  currentMode: 'regular' | 'autopilot' | 'planning';
  contextUsage: ContextUsage;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentMode, contextUsage }) => {
  const getModeColor = () => {
    switch (currentMode) {
      case 'regular': return 'green';
      case 'autopilot': return 'magenta'; 
      case 'planning': return 'yellow';
      default: return 'white';
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
      marginTop={1}
      justifyContent="space-between"
    >
      {/* Left side - Mode only */}
      <Box>
        {currentMode !== 'regular' && (
          <Text color={getModeColor()} bold>
            {currentMode.toUpperCase()} MODE
          </Text>
        )}
      </Box>

      {/* Right side - Context Usage */}
      <Box>
        <Text>Context: </Text>
        <Text color={getContextColor()}>
          {formatTokens(contextUsage.used)}/{formatTokens(contextUsage.total)}
        </Text>
        <Text dimColor> ({contextUsage.percentage}%)</Text>
      </Box>
    </Box>
  );
};

export default StatusBar;