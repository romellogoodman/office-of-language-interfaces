"use client";

import { useState, useEffect } from "react";

interface Commit {
  hash: string;
  message: string;
  date: string;
  author: string;
}

export default function ChangelogSidebar() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const response = await fetch("/api/commits");
        if (!response.ok) {
          throw new Error("Failed to fetch commits");
        }
        const data = await response.json();
        setCommits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, []);

  if (loading) {
    return (
      <div className="changelog-sidebar">
        <h3 className="changelog-title">Changelog</h3>
        <p className="changelog-loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="changelog-sidebar">
        <h3 className="changelog-title">Changelog</h3>
        <p className="changelog-error">Failed to load commits: {error}</p>
      </div>
    );
  }

  return (
    <div className="changelog-sidebar">
      <h3 className="changelog-title">Changelog</h3>
      <div className="changelog-list">
        {commits.map((commit) => (
          <div key={commit.hash} className="changelog-item">
            <div className="changelog-line">
              {/* <time className="changelog-date">{new Date(commit.date).toLocaleDateString()}</time> */}
              <div className="changelog-message">{commit.message}</div>
              <a 
                href={`https://github.com/romellogoodman/oli/commit/${commit.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="changelog-hash"
              >
                {commit.hash.substring(0, 7)}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
