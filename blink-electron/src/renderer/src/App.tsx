import { useState, useEffect, useRef } from 'react';
import { Hourglass } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import CommandCenter from './components/CommandCenter';
import { useApiKey } from './hooks/useApiKey';
import { useTheme } from './hooks/useTheme';
import { sendChat, ChatMessage as ClaudeMessage } from './lib/claude';
import './scss/globals.scss';
import './scss/prism.scss';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

function App(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const regenerateFromMessage = async (messageIndex: number) => {
    const messagesToResubmit = messages.slice(0, messageIndex + 1);
    const lastUserMessage = messagesToResubmit.filter(m => m.isUser).pop();
    
    if (!lastUserMessage) return;
    if (!hasApiKey) {
      setIsCommandCenterOpen(true);
      return;
    }

    // Remove messages after this point
    setMessages(messagesToResubmit);
    setIsLoading(true);

    // Convert messages to Claude format
    const chatMessages: ClaudeMessage[] = messagesToResubmit.map(msg => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    try {
      const response = await sendChat({ messages: chatMessages, apiKey });
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: response,
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
      setIsCommandCenterOpen(true);
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
    const chatMessages: ClaudeMessage[] = updatedMessages.map(msg => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    try {
      const response = await sendChat({ messages: chatMessages, apiKey });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
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
          onCommandClick={() => setIsCommandCenterOpen(true)}
          prefilledMessage=""
          onMessageChange={() => {}}
        />
        <CommandCenter 
          isOpen={isCommandCenterOpen}
          onClose={() => setIsCommandCenterOpen(false)}
          onApiKeyUpdate={setApiKey}
          theme={theme}
          onThemeUpdate={setTheme}
        />
      </div>
    </>
  );
}

export default App;