export interface Command {
  name: string;
  description: string;
  usage: string;
}

export const COMMANDS: Command[] = [
  {
    name: "/clear",
    description: "Clear conversation history",
    usage: "/clear",
  },
  {
    name: "/command",
    description: "Generate a custom command using AI",
    usage: "/command <name> <description>"
  },
  {
    name: "/help",
    description: "Show help and usage",
    usage: "/help"
  },
  {
    name: "/init",
    description: "Initialize AGENTS.md file in current directory",
    usage: "/init"
  },
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
    name: "/permissions",
    description: "Manage tool permissions (list/allow/block/reset)",
    usage: "/permissions [list | allow <tool> | block <tool> | reset]"
  },
];