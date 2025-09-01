import { exec } from 'child_process';
import { promisify } from 'util';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimitOnly } from '@/lib/api-middleware';

const execAsync = promisify(exec);

interface Commit {
  hash: string;
  message: string;
  date: string;
  author: string;
}

export async function GET(request: NextRequest) {
  return withRateLimitOnly(request, async () => {
    try {
      // Get the latest 5 commits with format: hash|message|date|author
      const { stdout } = await execAsync(
        'git log --pretty=format:"%H|%s|%ci|%an" -n 5',
        { cwd: process.cwd() }
      );

      const commits: Commit[] = stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, message, date, author] = line.split('|');
          return {
            hash,
            message,
            date,
            author
          };
        });

      return NextResponse.json(commits);
    } catch (error) {
      console.error('Error fetching git commits:', error);
      return NextResponse.json(
        { error: 'Failed to fetch commits' },
        { status: 500 }
      );
    }
  });
}