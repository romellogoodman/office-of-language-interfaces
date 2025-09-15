import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, generationCount } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Increase the word count with each generation
    const targetWordCount = Math.max(15, 15 + generationCount * 10);

    const prompt = `Please rewrite this text: "${text}"

Requirements:
- Keep the core meaning about being a research lab designing software that responds to language
- Make it approximately ${targetWordCount} words long
- Make it more detailed and expansive than the original
- Keep it engaging and descriptive
- Only return the rewritten text, nothing else`;

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText =
      message.content[0].type === "text"
        ? message.content[0].text.trim()
        : text;

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}
