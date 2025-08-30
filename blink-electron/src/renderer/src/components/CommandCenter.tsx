import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import CommandList from './CommandList'
import SubmenuApiKey from './SubmenuApiKey'
import SubmenuTheme from './SubmenuTheme'
import { Theme } from '../hooks/useTheme'

interface CommandCenterProps {
  isOpen: boolean
  onClose: () => void
  onApiKeyUpdate: (apiKey: string) => void
  theme: Theme
  onThemeUpdate: (theme: Theme) => void
}

type View = 'commands' | 'api-key' | 'theme'

export default function CommandCenter({
  isOpen,
  onClose,
  onApiKeyUpdate,
  theme,
  onThemeUpdate
}: CommandCenterProps) {
  const [currentView, setCurrentView] = useState<View>('commands')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset to main view when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentView('commands')
    }
  }, [isOpen])

  // Dynamic positioning above chat input
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      const updatePosition = () => {
        const chatInput = document.querySelector('.chat-input')
        if (chatInput && overlayRef.current) {
          const chatInputHeight = chatInput.getBoundingClientRect().height
          overlayRef.current.style.paddingBottom = `${chatInputHeight + 20}px`
        }
      }

      updatePosition()
      window.addEventListener('resize', updatePosition)
      return () => window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (currentView === 'commands') {
            onClose()
          } else {
            setCurrentView('commands')
          }
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, currentView, onClose])

  const handleBack = () => {
    setCurrentView('commands')
  }

  const handleOpenApiKey = () => {
    setCurrentView('api-key')
  }

  const handleOpenTheme = () => {
    setCurrentView('theme')
  }

  if (!isOpen) return null

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

  const showBackButton = currentView !== 'commands'

  return (
    <div ref={overlayRef} className="command-center-overlay" onClick={onClose}>
      <div className="command-center" onClick={(e) => e.stopPropagation()}>
        <div className="command-center__header">
          <div className="command-center__header-left">
            {showBackButton && (
              <button className="command-center__back" onClick={handleBack}>
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="command-center__title">{getViewTitle()}</h2>
          </div>
          <button className="command-center__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="command-center__content">
          {currentView === 'commands' && (
            <CommandList 
              onOpenApiKey={handleOpenApiKey} 
              onOpenTheme={handleOpenTheme}
            />
          )}
          {currentView === 'api-key' && (
            <SubmenuApiKey onApiKeyUpdate={onApiKeyUpdate} />
          )}
          {currentView === 'theme' && (
            <SubmenuTheme theme={theme} onThemeUpdate={onThemeUpdate} />
          )}
        </div>
      </div>
    </div>
  )
}