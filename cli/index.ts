#!/usr/bin/env node

import { Command } from "commander";
import { query, type SDKMessage } from "@anthropic-ai/claude-code";

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
  const messages: SDKMessage[] = [];

  for await (const message of query({
    prompt: prompt,
    abortController: new AbortController(),
    options: {
      maxTurns: 5,
      permissionMode: "acceptEdits",
    },
  })) {
    messages.push(message);
  }

  console.log(JSON.stringify(messages, null, 4));
}

// Parse command line arguments
program.parse();
