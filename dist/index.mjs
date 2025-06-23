#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { query } from "@anthropic-ai/claude-code";
const program = new Command();
// Define the CLI program
program
    .name("my-cli")
    .description("A CLI tool for my Next.js app")
    .version("1.0.0");
// Add a simple hello command
program
    .command("hello")
    .description("Say hello")
    .option("-n, --name <name>", "Name to greet", "World")
    .action((options) => {
    console.log(`Hello, ${options.name}!`);
});
// Add a file creation command
program
    .command("create-component")
    .description("Create a new React component")
    .argument("<name>", "Component name")
    .option("-d, --directory <dir>", "Directory to create component in", "components")
    .action((name, options) => {
    createComponent(name, options.directory);
});
// Add a list files command
program
    .command("list")
    .description("List files in the project")
    .option("-p, --path <path>", "Path to list files from", ".")
    .action((options) => {
    listFiles(options.path);
});
// Add a build info command
program
    .command("info")
    .description("Show project information")
    .action(() => {
    showProjectInfo();
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
    }
    else {
        // Fallback: show assistant messages
        const assistantMessages = messages.filter((msg) => msg.type === "assistant");
        if (assistantMessages.length > 0) {
            console.log("✅ Claude Response:");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            assistantMessages.forEach((msg) => {
                if ("message" in msg && msg.message.content) {
                    const content = Array.isArray(msg.message.content)
                        ? msg.message.content
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((c) => (typeof c === "string" ? c : c.text || ""))
                            .join("")
                        : msg.message.content;
                    console.log(content);
                }
            });
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
        else {
            console.log("❌ No response received from Claude");
        }
    }
    // Show usage information if available
    const finalMessage = messages[messages.length - 1];
    if (finalMessage && "usage" in finalMessage && finalMessage.usage) {
        console.log(`\n📊 Usage: ${finalMessage.usage.output_tokens} tokens`);
    }
}
// Helper functions
function createComponent(name, directory) {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    const fileName = `${componentName}.tsx`;
    const filePath = path.join(directory, fileName);
    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    const componentContent = `import React from 'react';

interface ${componentName}Props {
  // Add your props here
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  );
};

export default ${componentName};
`;
    try {
        fs.writeFileSync(filePath, componentContent);
        console.log(`✅ Component created: ${filePath}`);
    }
    catch (error) {
        console.error(`❌ Error creating component: ${error}`);
    }
}
function listFiles(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        console.log(`📁 Files in ${dirPath}:`);
        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            const type = stats.isDirectory() ? "📁" : "📄";
            console.log(`  ${type} ${file}`);
        });
    }
    catch (error) {
        console.error(`❌ Error listing files: ${error}`);
    }
}
function showProjectInfo() {
    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
        console.log("📊 Project Information:");
        console.log(`  Name: ${packageJson.name}`);
        console.log(`  Version: ${packageJson.version}`);
        console.log(`  Description: ${packageJson.description || "No description"}`);
        // Count components
        if (fs.existsSync("components")) {
            const components = fs
                .readdirSync("components")
                .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));
            console.log(`  Components: ${components.length}`);
        }
        // Count pages
        if (fs.existsSync("app")) {
            const pages = fs
                .readdirSync("app")
                .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));
            console.log(`  App Pages: ${pages.length}`);
        }
    }
    catch (error) {
        console.error(`❌ Error reading project info: ${error}`);
    }
}
// Parse command line arguments
program.parse();
