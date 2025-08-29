import React from 'react';
import { Text, Box } from 'ink';

interface OutputFormatterProps {
  content: string;
}

const OutputFormatter: React.FC<OutputFormatterProps> = ({ content }) => {
  const parseStructuredOutput = (text: string) => {
    const elements: React.ReactElement[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regex patterns for different structured elements
    const thinkingPattern = /<blink:thinking>([\s\S]*?)<\/blink:thinking>/g;
    const functionCallsPattern = /<blink:function_calls>([\s\S]*?)<\/blink:function_calls>/g;
    const invokePattern = /<blink:invoke name="([^"]+)">([\s\S]*?)<\/blink:invoke>/g;
    const parameterPattern = /<blink:parameter name="([^"]+)">([^<]*)<\/blink:parameter>/g;
    const resultPattern = /<blink:function_result>([\s\S]*?)<\/blink:function_result>/g;

    // Find all structured elements and their positions
    const allMatches: Array<{
      type: string;
      match: RegExpExecArray;
      start: number;
      end: number;
    }> = [];

    // Thinking blocks
    let match;
    while ((match = thinkingPattern.exec(text)) !== null) {
      allMatches.push({
        type: 'thinking',
        match,
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Function calls blocks
    functionCallsPattern.lastIndex = 0;
    while ((match = functionCallsPattern.exec(text)) !== null) {
      allMatches.push({
        type: 'function_calls',
        match,
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Function results
    resultPattern.lastIndex = 0;
    while ((match = resultPattern.exec(text)) !== null) {
      allMatches.push({
        type: 'result',
        match,
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Sort by start position
    allMatches.sort((a, b) => a.start - b.start);

    // Process each match
    for (const { type, match, start, end } of allMatches) {
      // Add any plain text before this match
      if (currentIndex < start) {
        const plainText = text.slice(currentIndex, start).trim();
        if (plainText) {
          elements.push(
            <Text key={key++} color="white">
              {plainText}
            </Text>
          );
        }
      }

      // Add the formatted structured element
      if (type === 'thinking') {
        elements.push(
          <Box key={key++} flexDirection="column" marginY={1}>
            <Text color="cyan" bold>Thinking...</Text>
            <Text color="gray" dimColor>
              {match[1].trim()}
            </Text>
          </Box>
        );
      } else if (type === 'function_calls') {
        const functionCallsContent = match[1];
        const invokeMatches: React.ReactElement[] = [];
        
        invokePattern.lastIndex = 0;
        let invokeMatch;
        while ((invokeMatch = invokePattern.exec(functionCallsContent)) !== null) {
          const toolName = invokeMatch[1];
          const parametersContent = invokeMatch[2];
          
          // Parse parameters
          const parameters: Array<{ name: string; value: string }> = [];
          parameterPattern.lastIndex = 0;
          let paramMatch;
          while ((paramMatch = parameterPattern.exec(parametersContent)) !== null) {
            parameters.push({
              name: paramMatch[1],
              value: paramMatch[2]
            });
          }

          invokeMatches.push(
            <Box key={key++} flexDirection="column" marginLeft={2}>
              <Text color="green" bold>
                {toolName}
              </Text>
              {parameters.map((param, idx) => (
                <Box key={idx} flexDirection="row">
                  <Text color="green" dimColor>
                    {param.name}: 
                  </Text>
                  <Text color="white" dimColor>
                    {' '}{param.value}
                  </Text>
                </Box>
              ))}
            </Box>
          );
        }

        if (invokeMatches.length > 0) {
          elements.push(
            <Box key={key++} flexDirection="column" marginY={1}>
              <Text color="green" bold>Function Calls:</Text>
              {invokeMatches}
            </Box>
          );
        }
      } else if (type === 'result') {
        elements.push(
          <Box key={key++} flexDirection="column" marginY={1}>
            <Text color="blue" bold>Result:</Text>
            <Text color="gray" dimColor>
              {match[1].trim()}
            </Text>
          </Box>
        );
      }

      currentIndex = end;
    }

    // Add any remaining plain text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex).trim();
      if (remainingText) {
        elements.push(
          <Text key={key++} color="white">
            {remainingText}
          </Text>
        );
      }
    }

    return elements;
  };

  // Check if content has structured elements
  const hasStructuredElements = /<blink:/.test(content);
  
  if (!hasStructuredElements) {
    // Return plain text if no structured elements
    return <Text color="white">{content}</Text>;
  }

  const formattedElements = parseStructuredOutput(content);

  return (
    <Box flexDirection="column">
      {formattedElements}
    </Box>
  );
};

export default OutputFormatter;