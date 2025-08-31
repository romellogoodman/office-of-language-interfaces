"use client";

import { useState, useEffect } from "react";
import ButtonLink from "@/components/ButtonLink";
import ButtonControl from "@/components/ButtonControl";

interface FooterProps {
  commitHash?: string;
}

export default function Footer({ commitHash }: FooterProps) {
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
          <div className="footer-left">
            <p>
              Led by{" "}
              <a
                href="https://romellogoodman.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Romello Goodman
              </a>{" "}
              in Baltimore, MD
            </p>
          </div>
          <div className="footer-right">
            <ButtonControl
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              return to top
            </ButtonControl>
            {commitHash && (
              <ButtonLink
                href={`https://github.com/romellogoodman/oli/commit/${commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {commitHash}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
