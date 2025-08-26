export interface Command {
  name: string;
  description: string;
  handler: (args: string[]) => string;
}

export const commands: Command[] = [
  {
    name: 'add',
    description: 'Add two numbers together',
    handler: (args: string[]) => {
      if (args.length < 2) {
        return 'Usage: add <number1> <number2>';
      }
      
      const num1 = parseFloat(args[0]);
      const num2 = parseFloat(args[1]);
      
      if (isNaN(num1) || isNaN(num2)) {
        return 'Error: Both arguments must be valid numbers';
      }
      
      return `Result: ${num1 + num2}`;
    }
  },
  {
    name: 'echo',
    description: 'Echo back the provided text',
    handler: (args: string[]) => {
      if (args.length === 0) {
        return 'Usage: echo <text>';
      }
      
      return args.join(' ');
    }
  },
  {
    name: 'help',
    description: 'Show available commands',
    handler: () => {
      return commands
        .map(cmd => `  ${cmd.name} - ${cmd.description}`)
        .join('\n');
    }
  }
];

export function executeCommand(input: string): string {
  const [commandName, ...args] = input.trim().split(' ');
  
  if (!commandName) {
    return 'Type "help" to see available commands';
  }
  
  const command = commands.find(cmd => cmd.name === commandName.toLowerCase());
  
  if (!command) {
    return `Unknown command: ${commandName}. Type "help" to see available commands`;
  }
  
  return command.handler(args);
}