#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { query, type SDKMessage } from "@anthropic-ai/claude-code";

const program = new Command();

// Define the CLI program
program
  .name("my-cli")
  .description("A CLI tool for my Next.js app")
  .version("1.0.0");

program
  .command("claude")
  .description("Generate code with Claude")
  .argument("<prompt>", "The prompt to generate code with")
  .action(async (prompt) => {
    await generateCodeWithClaude(prompt);
  });

async function generateCodeWithClaude(prompt: string): Promise<void> {
  console.log(`🤖 Asking Claude: "${prompt}"`);
  console.log("⏳ Generating response...\n");

  const messages: SDKMessage[] = [];

  for await (const message of query({
    prompt: prompt,
    abortController: new AbortController(),
    options: {
      maxTurns: 10,
      permissionMode: "acceptEdits",
    },
  })) {
    messages.push(message);
  }

  console.log(messages);

  // Find the final result
  const result = messages.find((msg) => msg.type === "result");
  if (result && "result" in result) {
    console.log("✅ Claude Response:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(result.result);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } else {
    // Fallback: show assistant messages
    const assistantMessages = messages.filter(
      (msg) => msg.type === "assistant"
    );
    if (assistantMessages.length > 0) {
      console.log("✅ Claude Response:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      assistantMessages.forEach((msg) => {
        if ("message" in msg && msg.message.content) {
          const content = Array.isArray(msg.message.content)
            ? msg.message.content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => (typeof c === "string" ? c : c.text || ""))
                .join("")
            : msg.message.content;
          console.log(content);
        }
      });
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      console.log("❌ No response received from Claude");
    }
  }

  // Show usage information if available
  const finalMessage = messages[messages.length - 1];
  if (finalMessage && "usage" in finalMessage && finalMessage.usage) {
    console.log(`\n📊 Usage: ${finalMessage.usage.output_tokens} tokens`);
  }
}

// Parse command line arguments
program.parse();
