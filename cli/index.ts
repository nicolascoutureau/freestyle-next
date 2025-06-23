#!/usr/bin/env node

import { Command } from "commander";
import { query, SDKAssistantMessage } from "@anthropic-ai/claude-code";

const program = new Command();

// Define the CLI program
program
  .name("my-cli")
  .description("A CLI tool for my Next.js app")
  .version("1.0.0");

program
  .command("hello")
  .description("Say hello")
  .action(() => {
    console.log("Hello, world!");
  });

program
  .command("claude")
  .description("Generate code with Claude")
  .argument("<prompt>", "The prompt to generate code with")
  .action(async (prompt) => {
    await generateCodeWithClaude(prompt);
  });

async function generateCodeWithClaude(prompt: string): Promise<void> {
  for await (const message of query({
    prompt: prompt,
    abortController: new AbortController(),
    options: {
      maxTurns: 5,
      permissionMode: "acceptEdits",
    },
  })) {
    process.stdout.write(JSON.stringify(message, null, 4));
    process.stdout.write("\n");
  }

  // Add a final newline
  process.stdout.write("\n");
}

// Parse command line arguments
program.parse();
