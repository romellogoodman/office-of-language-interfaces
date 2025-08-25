'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hourglass } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SettingsModal from '@/components/SettingsModal';
import { useApiKey } from '@/hooks/useApiKey';
import { useTheme } from '@/hooks/useTheme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');
  const { apiKey, setApiKey, hasApiKey } = useApiKey();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();

  // Handle URL parameter for prefilled prompts
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setPrefilledMessage(decodeURIComponent(prompt));
    }
  }, [searchParams]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const regenerateFromMessage = async (messageIndex: number) => {
    const messagesToResubmit = messages.slice(0, messageIndex + 1);
    const lastUserMessage = messagesToResubmit.filter(m => m.isUser).pop();
    
    if (!lastUserMessage) return;
    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    // Remove messages after this point
    setMessages(messagesToResubmit);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: lastUserMessage.text, apiKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        isUser: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error regenerating message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your message.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return false;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, apiKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    
    return true;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            onRefresh={!message.isUser ? () => regenerateFromMessage(index - 1) : undefined}
          />
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">
              <Hourglass size={16} />
            </div>
            <div className="chat-message__wrapper">
              <div className="chat-message__content">
                Generating...
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        hasMessages={messages.length > 0} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        prefilledMessage={prefilledMessage}
        onMessageChange={() => setPrefilledMessage('')}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApiKeyUpdate={setApiKey}
        theme={theme}
        onThemeUpdate={setTheme}
      />
    </div>
  );
}
