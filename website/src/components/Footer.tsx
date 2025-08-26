"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-inner">
          <p>
            Led by{" "}
            <a
              href="https://romellogoodman.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Romello Goodman
            </a>
          </p>
          <p>Baltimore, MD {currentTime}</p>
        </div>
      </div>
    </footer>
  );
}