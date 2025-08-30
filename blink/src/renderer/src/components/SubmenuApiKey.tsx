import { useState, useEffect } from 'react'

interface SubmenuApiKeyProps {
  onApiKeyUpdate: (apiKey: string) => void
}

export default function SubmenuApiKey({ onApiKeyUpdate }: SubmenuApiKeyProps) {
  const [apiKey, setApiKey] = useState('')
  const [hasExistingKey, setHasExistingKey] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setHasExistingKey(true)
    }
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropic_api_key', apiKey.trim())
      onApiKeyUpdate(apiKey.trim())
    }
  }

  const handleClear = () => {
    localStorage.removeItem('anthropic_api_key')
    setApiKey('')
    setHasExistingKey(false)
    onApiKeyUpdate('')
  }

  return (
    <div className="command-center__submenu">
      <div className="command-center__field">
        <label htmlFor="api-key-input">Anthropic API Key</label>
        <input
          id="api-key-input"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Insert API Key"
          className="command-center__input"
          autoFocus
        />
        <p className="command-center__help">
          Get your API key from the{' '}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="command-center__link"
          >
            Anthropic Console
          </a>
          . Your API key is stored locally and never sent to our servers.
        </p>
      </div>
      <div className="command-center__actions">
        {hasExistingKey && (
          <button
            className="command-center__button command-center__button--secondary"
            onClick={handleClear}
          >
            Clear Key
          </button>
        )}
        <button
          className="command-center__button command-center__button--primary"
          onClick={handleSave}
          disabled={!apiKey.trim()}
        >
          Save
        </button>
      </div>
    </div>
  )
}