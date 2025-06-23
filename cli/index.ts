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
      maxTurns: 3,
      permissionMode: "acceptEdits",
    },
  })) {
    messages.push(message);
  }

  console.log(messages);
}

// Parse command line arguments
program.parse();
