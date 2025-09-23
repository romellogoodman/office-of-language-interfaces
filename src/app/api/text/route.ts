import { NextResponse } from "next/server";
import { parseResearchPostContent } from "@/lib/parseResearchPostContent";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const researchDir = path.join(process.cwd(), "src/app/research");
    const researchFolders = fs
      .readdirSync(researchDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const posts = [];

    for (const folder of researchFolders) {
      const contentPath = path.join(researchDir, folder, "content.md");

      if (fs.existsSync(contentPath)) {
        const contentRaw = fs.readFileSync(contentPath, "utf-8");
        const parsedContent = parseResearchPostContent(contentRaw);

        posts.push({
          slug: folder,
          ...parsedContent,
        });
      }
    }

    // Return all research content as plain text
    const textContent = posts
      .map(post => {
        const { frontmatter, content } = post;
        const furtherReadingYaml = frontmatter.furtherReading
          ? `furtherReading:\n${frontmatter.furtherReading
              .map(
                (item: { title: string; author: string; url: string }) =>
                  `  - title: "${item.title}"\n    author: "${item.author}"\n    url: "${item.url}"`
              )
              .join("\n")}`
          : "";

        return `---
title: "${frontmatter.title}"
slug: "${post.slug}"
publishedAt: "${frontmatter.publishedAt}"
${frontmatter.subhead ? `subhead: "${frontmatter.subhead}"` : ""}
${furtherReadingYaml}
---

# ${frontmatter.title}

${frontmatter.subhead || ""}

${content}

---

`;
      })
      .join("");

    return new NextResponse(textContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error serving research content:", error);
    return NextResponse.json(
      { error: "Failed to load research content" },
      { status: 500 }
    );
  }
}
