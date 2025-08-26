import React from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';

interface LoadingIndicatorProps {
  isVisible: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Box>
      <Text color="cyan">
        <Spinner type="dots" />
      </Text>
      <Text color="cyan"> Thinking...</Text>
    </Box>
  );
};

export default LoadingIndicator;