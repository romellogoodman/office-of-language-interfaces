import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { executeCommand } from "./commands.js";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  useInput((inputChar, key) => {
    if (key.return) {
      if (input.trim()) {
        const result = executeCommand(input.trim());
        setOutput((prev) => [...prev, `> ${input}`, result, ""]);
      }
      setInput("");
    } else if (key.backspace || key.delete) {
      setInput((prev) => prev.slice(0, -1));
    } else if (inputChar && !key.ctrl && !key.meta && !key.escape) {
      setInput((prev) => prev + inputChar);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="cyan" bold>
        🚀 Blink CLI
      </Text>
      <Text color="gray">Type "help" to see available commands</Text>
      <Text> </Text>

      {output.map((line, index) => (
        <Text key={index} color={line.startsWith(">") ? "green" : "white"}>
          {line}
        </Text>
      ))}

      <Box>
        <Text color="blue">$ </Text>
        <Text>{input}</Text>
        <Text color="gray">█</Text>
      </Box>
    </Box>
  );
};

export default App;
