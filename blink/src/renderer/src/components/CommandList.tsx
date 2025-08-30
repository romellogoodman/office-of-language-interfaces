import { useState, useEffect } from 'react'
import { WandSparkles, Key, Palette } from 'lucide-react'

interface CommandListProps {
  onOpenApiKey: () => void
  onOpenTheme: () => void
}

type CommandType = 'prompt' | 'apikey' | 'theme'

interface Command {
  id: string
  name: string
  description: string
  type: CommandType
}

const commands: Command[] = [
  { id: 'echo', name: 'Echo', description: 'Repeat the input text', type: 'prompt' },
  { id: 'capitalize', name: 'Capitalize', description: 'Convert text to uppercase', type: 'prompt' },
  { id: 'lowercase', name: 'Lowercase', description: 'Convert text to lowercase', type: 'prompt' },
  { id: 'vowelless', name: 'Vowelless', description: 'Remove vowels from text', type: 'prompt' },
  { id: 'api-key', name: 'API Key', description: 'Manage your Anthropic API key', type: 'apikey' },
  { id: 'theme', name: 'Theme', description: 'Change app appearance', type: 'theme' }
]

const getCommandIcon = (type: CommandType) => {
  switch (type) {
    case 'prompt':
      return WandSparkles
    case 'apikey':
      return Key
    case 'theme':
      return Palette
  }
}

export default function CommandList({ onOpenApiKey, onOpenTheme }: CommandListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % commands.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length)
        break
      case 'Enter':
        e.preventDefault()
        handleCommandClick(commands[selectedIndex])
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  // Reset selection when component mounts
  useEffect(() => {
    setSelectedIndex(0)
  }, [])

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