import { WandSparkles, Key, Palette } from 'lucide-react'
import { commands, Command } from '../hooks/useCommandCenter'

interface CommandListProps {
  onOpenApiKey: () => void
  onOpenTheme: () => void
  selectedIndex: number
}

const getCommandIcon = (type: Command['type']) => {
  switch (type) {
    case 'prompt':
      return WandSparkles
    case 'apikey':
      return Key
    case 'theme':
      return Palette
  }
}

export default function CommandList({ onOpenApiKey, onOpenTheme, selectedIndex }: CommandListProps) {

  const handleCommandClick = (command: Command) => {
    if (command.id === 'api-key') {
      onOpenApiKey()
    } else if (command.id === 'theme') {
      onOpenTheme()
    } else {
      console.log(`Command clicked: ${command.name}`)
      // TODO: Implement prompt functionality
    }
  }


  return (
    <div className="command-center__list">
      {commands.map((command, index) => {
        const IconComponent = getCommandIcon(command.type)
        const isSelected = index === selectedIndex
        return (
          <button
            key={command.id}
            className={`command-center__item ${isSelected ? 'command-center__item--selected' : ''}`}
            onClick={() => handleCommandClick(command)}
          >
            <div className="command-center__item-left">
              <IconComponent size={16} className="command-center__item-icon" />
              <div className="command-center__item-name">{command.name}</div>
            </div>
            <div className="command-center__item-description">{command.description}</div>
          </button>
        )
      })}
    </div>
  )
}