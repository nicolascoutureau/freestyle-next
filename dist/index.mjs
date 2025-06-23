#!/usr/bin/env node
import { Command } from "commander";
import { query } from "@anthropic-ai/claude-code";
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
async function generateCodeWithClaude(prompt) {
    console.log(`🤖 Asking Claude: "${prompt}"`);
    console.log("⏳ Generating response...\n");
    const messages = [];
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
