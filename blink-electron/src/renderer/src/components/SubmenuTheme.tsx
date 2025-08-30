import { Monitor, Sun, Moon } from 'lucide-react'
import { Theme } from '../hooks/useTheme'

interface SubmenuThemeProps {
  theme: Theme
  onThemeUpdate: (theme: Theme) => void
}

export default function SubmenuTheme({ theme, onThemeUpdate }: SubmenuThemeProps) {
  const handleThemeSelect = (selectedTheme: Theme) => {
    onThemeUpdate(selectedTheme)
  }

  return (
    <div className="command-center__submenu">
      <div className="command-center__theme-options">
        <button
          className={`command-center__theme-option ${
            theme === 'light' ? 'command-center__theme-option--active' : ''
          }`}
          onClick={() => handleThemeSelect('light')}
        >
          <Sun size={16} />
          Light
        </button>
        <button
          className={`command-center__theme-option ${
            theme === 'dark' ? 'command-center__theme-option--active' : ''
          }`}
          onClick={() => handleThemeSelect('dark')}
        >
          <Moon size={16} />
          Dark
        </button>
        <button
          className={`command-center__theme-option ${
            theme === 'system' ? 'command-center__theme-option--active' : ''
          }`}
          onClick={() => handleThemeSelect('system')}
        >
          <Monitor size={16} />
          System
        </button>
      </div>
    </div>
  )
}