import { useRef, useEffect } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import CommandList from './CommandList'
import SubmenuApiKey from './SubmenuApiKey'
import SubmenuTheme from './SubmenuTheme'
import { Theme } from '../hooks/useTheme'
import { useCommandCenter } from '../hooks/useCommandCenter'

interface CommandCenterProps {
  commandCenter: ReturnType<typeof useCommandCenter>
  onApiKeyUpdate: (apiKey: string) => void
  theme: Theme
  onThemeUpdate: (theme: Theme) => void
}

export default function CommandCenter({
  commandCenter,
  onApiKeyUpdate,
  theme,
  onThemeUpdate
}: CommandCenterProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Dynamic positioning above chat input
  useEffect(() => {
    if (commandCenter.isOpen && overlayRef.current) {
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
  }, [commandCenter.isOpen])

  if (!commandCenter.isOpen) return null

  return (
    <div ref={overlayRef} className="command-center-overlay" onClick={commandCenter.close}>
      <div className="command-center" onClick={(e) => e.stopPropagation()}>
        <div className="command-center__header">
          <div className="command-center__header-left">
            {commandCenter.showBackButton && (
              <button className="command-center__back" onClick={commandCenter.goBack}>
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="command-center__title">{commandCenter.viewTitle}</h2>
          </div>
          <button className="command-center__close" onClick={commandCenter.close}>
            <X size={20} />
          </button>
        </div>

        <div className="command-center__content">
          {commandCenter.currentView === 'commands' && (
            <CommandList 
              onOpenApiKey={commandCenter.openApiKey} 
              onOpenTheme={commandCenter.openTheme}
              selectedIndex={commandCenter.selectedIndex}
            />
          )}
          {commandCenter.currentView === 'api-key' && (
            <SubmenuApiKey onApiKeyUpdate={onApiKeyUpdate} onClose={commandCenter.close} />
          )}
          {commandCenter.currentView === 'theme' && (
            <SubmenuTheme theme={theme} onThemeUpdate={onThemeUpdate} />
          )}
        </div>
      </div>
    </div>
  )
}