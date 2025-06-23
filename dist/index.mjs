#!/usr/bin/env node
import { Command } from "commander";
import { query } from "@anthropic-ai/claude-code";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
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
program
    .command("mcp-server")
    .description("Start the MCP server")
    .action(async () => {
    await startMcpServer();
});
async function startMcpServer() {
    // Create an MCP server
    const server = new McpServer({
        name: "demo-server",
        version: "1.0.0",
    });
    // Add an addition tool
    server.registerTool("add", {
        title: "Addition Tool",
        description: "Add two numbers",
        inputSchema: { a: z.number(), b: z.number() },
    }, async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
    }));
    // Add more useful tools for code generation
    server.registerTool("get_current_time", {
        title: "Get Current Time",
        description: "Get the current timestamp",
        inputSchema: {},
    }, async () => ({
        content: [{ type: "text", text: new Date().toISOString() }],
    }));
    // Add a string utility tool
    server.registerTool("reverse_string", {
        title: "Reverse String",
        description: "Reverse a given string",
        inputSchema: { text: z.string() },
    }, async ({ text }) => ({
        content: [{ type: "text", text: text.split("").reverse().join("") }],
    }));
    // Add a random number generator
    server.registerTool("random_number", {
        title: "Random Number Generator",
        description: "Generate a random number between min and max",
        inputSchema: { min: z.number(), max: z.number() },
    }, async ({ min, max }) => ({
        content: [
            {
                type: "text",
                text: String(Math.floor(Math.random() * (max - min + 1)) + min),
            },
        ],
    }));
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server started successfully");
}
async function generateCodeWithClaude(prompt) {
    // Get the current file's directory to locate the MCP server
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const mcpServerPath = path.resolve(__dirname, "../dist/index.mjs");
    for await (const message of query({
        prompt: prompt,
        abortController: new AbortController(),
        options: {
            maxTurns: 5,
            permissionMode: "bypassPermissions",
            // Configure MCP server as an external process
            mcpServers: {
                "demo-server": {
                    command: "node",
                    args: [mcpServerPath, "mcp-server"],
                    env: {},
                },
            },
        },
    })) {
        // Stream just the text content for better UX
        // if (message.type === "assistant") {
        //   const content = (message as any).content;
        //   if (typeof content === "string") {
        //     process.stdout.write(content);
        //   } else if (Array.isArray(content)) {
        //     for (const block of content) {
        //       if (block.type === "text") {
        //         process.stdout.write(block.text);
        //       }
        //     }
        //   }
        // }
        // Optionally uncomment below to see all message types:
        process.stdout.write(JSON.stringify(message, null, 2) + "\n");
    }
    // Add a final newline
    process.stdout.write("\n");
}
// Parse command line arguments
program.parse();
