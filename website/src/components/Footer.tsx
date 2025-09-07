"use client";

import ButtonLink from "@/components/ButtonLink";
import ButtonControl from "@/components/ButtonControl";

interface FooterProps {
  commitHash?: string;
}

export default function Footer({ commitHash }: FooterProps) {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-inner">
          <div className="footer-left">
            <p>
              <a href="/" className="footer-oli-link">
                Office of Language Interfaces
              </a>
              <br />
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
