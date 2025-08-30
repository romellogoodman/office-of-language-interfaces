import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onSubmit }) => {
  return (
    <Box>
      <Text color="blue">$ </Text>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default InputArea;