'use client';

import { useState, useEffect, useRef } from 'react';
import { Hourglass } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SettingsModal from '@/components/SettingsModal';
import SearchParamsHandler from '@/components/SearchParamsHandler';
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
  const shouldScrollRef = useRef(false);
  const chatInputRef = useRef<{ focus: () => void }>(null);
  const { apiKey, setApiKey, hasApiKey } = useApiKey();
  const { theme, setTheme } = useTheme();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (shouldScrollRef.current) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      shouldScrollRef.current = false;
      
      // Refocus the chat input after scrolling
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
    }
  }, [messages]);

  // Focus chat input on page load
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, []);

  const handlePrefilledMessage = (message: string) => {
    setPrefilledMessage(message);
  };

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

    // Convert messages to Claude format
    const chatMessages = messagesToResubmit.map(msg => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatMessages, apiKey }),
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
      shouldScrollRef.current = true;
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    shouldScrollRef.current = true;

    // Convert all messages to Claude format
    const chatMessages = updatedMessages.map(msg => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatMessages, apiKey }),
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
      shouldScrollRef.current = true;
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
    <>
      <SearchParamsHandler onPrefilledMessage={handlePrefilledMessage} />
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
          ref={chatInputRef}
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
    </>
  );
}
