import { useState, useEffect } from 'react';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem('anthropic_api_key', key.trim());
      setApiKeyState(key.trim());
    } else {
      localStorage.removeItem('anthropic_api_key');
      setApiKeyState('');
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('anthropic_api_key');
    setApiKeyState('');
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    hasApiKey: !!apiKey.trim()
  };
}