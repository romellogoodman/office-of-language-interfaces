import { useState, useEffect } from "react";
import { X, Monitor, Sun, Moon } from "lucide-react";

import { Theme } from "@/hooks/useTheme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyUpdate: (apiKey: string) => void;
  theme: Theme;
  onThemeUpdate: (theme: Theme) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onApiKeyUpdate,
  theme,
  onThemeUpdate,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem("anthropic_api_key");
      if (savedKey) {
        setApiKey(savedKey);
        setHasExistingKey(true);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("anthropic_api_key", apiKey.trim());
      onApiKeyUpdate(apiKey.trim());
      onClose();
    }
  };

  const handleClear = () => {
    localStorage.removeItem("anthropic_api_key");
    setApiKey("");
    setHasExistingKey(false);
    onApiKeyUpdate("");
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal__header">
          <h2>Settings</h2>
          <button className="settings-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-modal__content">
          <div className="settings-modal__field">
            <label htmlFor="api-key">Anthropic API Key</label>
            <input
              type="text"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Insert API Key"
              className="settings-modal__input"
            />
            <p className="settings-modal__help">
              Get your API key from the{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-modal__link"
              >
                Anthropic Console
              </a>
              . Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="settings-modal__field">
            <label>Theme</label>
            <div className="settings-modal__theme-options">
              <button
                className={`settings-modal__theme-option ${
                  theme === "light"
                    ? "settings-modal__theme-option--active"
                    : ""
                }`}
                onClick={() => onThemeUpdate("light")}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                className={`settings-modal__theme-option ${
                  theme === "dark" ? "settings-modal__theme-option--active" : ""
                }`}
                onClick={() => onThemeUpdate("dark")}
              >
                <Moon size={16} />
                Dark
              </button>
              <button
                className={`settings-modal__theme-option ${
                  theme === "system"
                    ? "settings-modal__theme-option--active"
                    : ""
                }`}
                onClick={() => onThemeUpdate("system")}
              >
                <Monitor size={16} />
                System
              </button>
            </div>
          </div>
        </div>

        <div className="settings-modal__actions">
          {hasExistingKey && (
            <button
              className="settings-modal__button settings-modal__button--secondary"
              onClick={handleClear}
            >
              Clear Key
            </button>
          )}
          <button
            className="settings-modal__button settings-modal__button--primary"
            onClick={handleSave}
            disabled={!apiKey.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
