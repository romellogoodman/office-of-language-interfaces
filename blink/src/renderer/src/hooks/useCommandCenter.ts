import { useState, useEffect } from 'react'

export type CommandView = 'commands' | 'api-key' | 'theme'

export interface Command {
  id: string
  name: string
  description: string
  type: 'prompt' | 'apikey' | 'theme'
}

export const commands: Command[] = [
  { id: 'echo', name: 'Echo', description: 'Repeat the input text', type: 'prompt' },
  { id: 'capitalize', name: 'Capitalize', description: 'Convert text to uppercase', type: 'prompt' },
  { id: 'lowercase', name: 'Lowercase', description: 'Convert text to lowercase', type: 'prompt' },
  { id: 'vowelless', name: 'Vowelless', description: 'Remove vowels from text', type: 'prompt' },
  { id: 'api-key', name: 'API Key', description: 'Manage your Anthropic API key', type: 'apikey' },
  { id: 'theme', name: 'Theme', description: 'Change app appearance', type: 'theme' }
]

export function useCommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<CommandView>('commands')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Reset to main view and selection when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentView('commands')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard navigation handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

    // Cmd+K - Toggle command center (works from anywhere)
    if (e.metaKey && e.key === 'k' && !e.repeat) {
      e.preventDefault()
      setIsOpen(prev => !prev)
      return
    }

    // Only handle these keys when command center is open and not in input
    if (isOpen && !isInInput) {
      // Escape - Close command center
      if (e.key === 'Escape') {
        e.preventDefault()
        if (currentView === 'commands') {
          setIsOpen(false)
        } else {
          setCurrentView('commands')
        }
        return
      }

      // Arrow keys for navigation (only on commands view)
      if (currentView === 'commands') {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % commands.length)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length)
          return
        }

        // Enter - Execute selected command
        if (e.key === 'Enter') {
          e.preventDefault()
          executeCommand(selectedIndex)
          return
        }
      }
    }
  }

  // Command execution
  const executeCommand = (index: number) => {
    const command = commands[index]
    if (command.id === 'api-key') {
      setCurrentView('api-key')
    } else if (command.id === 'theme') {
      setCurrentView('theme')
    } else {
      console.log(`Command executed: ${command.name}`)
      // TODO: Implement prompt functionality
    }
  }

  // Navigation handlers
  const openApiKey = () => setCurrentView('api-key')
  const openTheme = () => setCurrentView('theme')
  const goBack = () => setCurrentView('commands')
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)

  // Get current view title
  const getViewTitle = () => {
    switch (currentView) {
      case 'commands':
        return 'Commands'
      case 'api-key':
        return 'API Key'
      case 'theme':
        return 'Theme'
    }
  }

  return {
    // State
    isOpen,
    currentView,
    selectedIndex,
    commands,

    // Computed
    showBackButton: currentView !== 'commands',
    viewTitle: getViewTitle(),

    // Actions
    handleKeyDown,
    executeCommand,
    openApiKey,
    openTheme,
    goBack,
    close,
    toggle,
    setIsOpen
  }
}