import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Settings, SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading: boolean;
  hasMessages?: boolean;
  onSettingsClick: () => void;
  prefilledMessage?: string;
  onMessageChange?: () => void;
}

const ChatInput = forwardRef<{ focus: () => void }, ChatInputProps>(
  (
    {
      onSendMessage,
      isLoading,
      hasMessages = false,
      onSettingsClick,
      prefilledMessage = "",
      onMessageChange,
    },
    ref
  ) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      },
    }));

    // Handle prefilled message
    useEffect(() => {
      if (prefilledMessage && !message) {
        setMessage(prefilledMessage);
        // Adjust textarea height for prefilled content
        setTimeout(() => {
          const textarea = document.querySelector(
            ".chat-input__field"
          ) as HTMLTextAreaElement;
          if (textarea) {
            adjustHeight(textarea);
            textarea.focus();
          }
        }, 0);
      }
    }, [prefilledMessage, message]);

    const adjustHeight = (textarea: HTMLTextAreaElement) => {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    };

    const handleSubmit = async () => {
      if (message.trim() && !isLoading) {
        const messageToSend = message.trim();

        // Clear input immediately for better UX
        setMessage("");
        // Reset textarea height immediately
        setTimeout(() => {
          const textarea = document.querySelector(
            ".chat-input__field"
          ) as HTMLTextAreaElement;
          if (textarea) {
            textarea.style.height = "auto";
          }
        }, 0);

        const success = await onSendMessage(messageToSend);
        if (!success) {
          // If failed (no API key), restore the message
          setMessage(messageToSend);
          setTimeout(() => {
            const textarea = document.querySelector(
              ".chat-input__field"
            ) as HTMLTextAreaElement;
            if (textarea) {
              textarea.style.height = "auto";
              textarea.style.height =
                Math.min(textarea.scrollHeight, 200) + "px";
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
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustHeight(e.target);
                if (onMessageChange) {
                  onMessageChange();
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={hasMessages ? "Reply..." : "Lets chat..."}
              className="chat-input__field"
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
);

ChatInput.displayName = "ChatInput";

export default ChatInput;