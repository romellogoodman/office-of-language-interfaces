import { useState } from "react";
import { Settings, SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading: boolean;
  hasMessages?: boolean;
  onSettingsClick: () => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  hasMessages = false,
  onSettingsClick,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleSubmit = async () => {
    if (message.trim() && !isLoading) {
      const messageToSend = message.trim();
      
      // Clear input immediately for better UX
      setMessage("");
      // Reset textarea height immediately
      setTimeout(() => {
        const textarea = document.querySelector('.chat-input__field') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = 'auto';
        }
      }, 0);
      
      const success = await onSendMessage(messageToSend);
      if (!success) {
        // If failed (no API key), restore the message
        setMessage(messageToSend);
        setTimeout(() => {
          const textarea = document.querySelector('.chat-input__field') as HTMLTextAreaElement;
          if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input__container">
        <div className="chat-input__textarea-container">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight(e.target);
            }}
            onKeyDown={handleKeyDown}
            placeholder={hasMessages ? "Reply..." : "Lets chat..."}
            className="chat-input__field"
            disabled={isLoading}
            rows={1}
          />
        </div>
        <div className="chat-input__buttons">
          <div className="chat-input__buttons-right">
            <button className="chat-input__button" onClick={onSettingsClick}>
              <Settings size={16} />
            </button>
            <button
              onClick={handleSubmit}
              className="chat-input__button chat-input__button--primary"
              disabled={!message.trim() || isLoading}
            >
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
