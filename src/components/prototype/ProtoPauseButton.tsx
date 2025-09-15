"use client";

import { useState, useEffect } from "react";
import { Send, Clock } from "lucide-react";
import ButtonControl from "../ButtonControl";
import "./prototypes.scss";

const PAUSE_DURATIONS = [
  { duration: 3, label: "3 seconds" },
  { duration: 30, label: "30 seconds" },
  { duration: 60, label: "1 minute" },
  { duration: 120, label: "2 minutes" },
  { duration: 300, label: "5 minutes" },
  { duration: 600, label: "10 minutes" },
  { duration: 1800, label: "30 minutes" },
  { duration: 3600, label: "1 hour" },
];

interface ProtoPauseButtonProps {
  onSubmit?: () => void;
}

export default function ProtoPauseButton({ onSubmit }: ProtoPauseButtonProps) {
  const [submitCount, setSubmitCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPaused(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, timeRemaining]);

  const handleSubmit = () => {
    if (isPaused) return;

    // Execute the submit callback if provided
    if (onSubmit) {
      onSubmit();
    }

    // Get the pause duration for this submit count
    const pauseIndex = Math.min(submitCount, PAUSE_DURATIONS.length - 1);
    const pauseDuration = PAUSE_DURATIONS[pauseIndex].duration;

    // Start the pause
    setIsPaused(true);
    setTimeRemaining(pauseDuration);
    setSubmitCount(prev => prev + 1);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getNextPauseDuration = (): string => {
    const nextIndex = Math.min(submitCount, PAUSE_DURATIONS.length - 1);
    return PAUSE_DURATIONS[nextIndex].label;
  };

  return (
    <div className="proto-pause-button">
      <div className="proto-form">
        <div className="button-control-group">
          <ButtonControl
            onClick={handleSubmit}
            icon={isPaused ? <Clock size={14} /> : <Send size={14} />}
            className={isPaused ? "paused" : ""}
            disabled={isPaused}
          >
            {isPaused ? `waiting ${formatTime(timeRemaining)}` : "submit"}
          </ButtonControl>
        </div>
      </div>
    </div>
  );
}