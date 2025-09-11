import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getLatestCommitHash(): Promise<string> {
  try {
    const { stdout } = await execAsync("git rev-parse --short HEAD");
    return stdout.trim();
  } catch (error) {
    console.error("Error getting commit hash:", error);
    return "unknown";
  }
}

export async function getBuildInfo() {
  const commitHash = await getLatestCommitHash();
  const buildTime = new Date().toISOString();

  return {
    commitHash,
    buildTime,
  };
}
