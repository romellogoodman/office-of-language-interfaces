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
    description: "Generate custom commands",
    usage: "/command <name> <description>"
  },
  {
    name: "/help",
    description: "Show help and usage",
    usage: "/help"
  },
  {
    name: "/init",
    description: "Create AGENTS.md",
    usage: "/init"
  },
  {
    name: "/login",
    description: "Login with Anthropic API key",
    usage: "/login <api-key>",
  },
  {
    name: "/logout",
    description: "Sign out",
    usage: "/logout",
  },
  {
    name: "/model",
    description: "View and change model",
    usage: "/model [name]",
  },
  {
    name: "/permissions",
    description: "Manage tool permissions",
    usage: "/permissions [list | allow <tool> | block <tool> | reset]"
  },
];