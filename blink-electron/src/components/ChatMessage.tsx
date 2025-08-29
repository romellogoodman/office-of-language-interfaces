import { BotMessageSquare, RefreshCcw, Copy } from 'lucide-react';
import Response from './Response';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  onRefresh?: () => void;
}

export default function ChatMessage({ message, isUser, onRefresh }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="chat-message chat-message--user">
        <div className="chat-message__content">
          {message}
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="chat-message chat-message--assistant">
      <div className="chat-message__avatar">
        <BotMessageSquare size={16} />
      </div>
      <div className="chat-message__wrapper">
        <div className="chat-message__content">
          <Response text={message} />
        </div>
        <div className="chat-message__actions">
          <button className="chat-message__action-button" onClick={handleRefresh}>
            <RefreshCcw size={16} />
          </button>
          <button className="chat-message__action-button" onClick={handleCopy}>
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}