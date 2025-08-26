export interface Command {
  name: string;
  description: string;
  usage: string;
}

export const COMMANDS: Command[] = [
  {
    name: "/login",
    description: "Login with your Anthropic API key",
    usage: "/login <api-key>",
  },
  {
    name: "/logout",
    description: "Sign out from your account",
    usage: "/logout",
  },
  {
    name: "/model",
    description: "View or change the AI model",
    usage: "/model [name]",
  },
  {
    name: "/clear",
    description: "Clear conversation history",
    usage: "/clear",
  },
  {
    name: "/init",
    description: "Initialize AGENTS.md file in current directory",
    usage: "/init"
  },
  {
    name: "/help",
    description: "Show help and usage",
    usage: "/help"
  },
];