# Using Task Master with Claude Code

This guide explains how to set up and use Task Master with Claude Code.

## Setup

There are two main ways to integrate Task Master with Claude Code:

### Option 1: Environment Variable (Recommended)

1. Create or edit a `.env` file in your project root with:

```
CLAUDE_CODE_MODE=true
```

> A sample `.env` file is provided at `claude-code-integration/sample.env` that you can copy to your project root.

2. Add your API keys to the `.env` file:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
# Add other provider keys as needed
```

3. When you initialize Task Master (`task-master init`), it will automatically detect the environment variable and set up the Claude Code integration.

### Option 2: Manual Configuration

1. Initialize Task Master as usual (`task-master init`)

2. Modify your `~/.claude.json` configuration file to include the Task Master MCP server and plugin:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-mcp"],
      "env": {
        "CLAUDE_CODE_MODE": "true",
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY_HERE",
        "OPENAI_API_KEY": "YOUR_OPENAI_KEY_HERE",
        "GOOGLE_API_KEY": "YOUR_GOOGLE_KEY_HERE"
      }
    }
  },
  "settings": {
    "plugins": [
      {
        "name": "taskMasterPlugin",
        "enabled": true,
        "path": "./node_modules/task-master-ai/claude-code-integration/taskMasterPlugin.mjs"
      }
    ]
  }
}
```

3. An example file named `example-claude-json.json` is provided in your project after initialization for reference.

## Using Task Master with Claude Code

Once configured, Task Master will:

1. Create and maintain a `CLAUDE.md` file in your project root with a placeholder for dynamic content
2. Add task information to this file when tasks are created or updated
3. Make this information available to Claude when you're interacting with it

## Key Commands

To interact with Task Master from Claude Code:

1. **Initialize a project**: `task-master init`
2. **Parse a PRD**: `task-master parse-prd prd.md`
3. **Analyze task complexity**: `task-master analyze-complexity`
4. **Expand tasks**: `task-master expand --all`
5. **Get the next task**: `task-master next`
6. **List all tasks**: `task-master list`

For a complete list of commands, use `task-master --help`.

## Troubleshooting

- If Task Master content doesn't appear in Claude's responses, make sure the `CLAUDE.md` file has the `<task-master-dynamic-content>` placeholder tags.
- Check that your API keys are correctly set in the `.env` file.
- Ensure your Claude Code integration is enabled and working by testing other dynamic content.

For more help, visit the [Task Master GitHub repository](https://github.com/eyaltoledano/task-master) or create an issue if you're experiencing persistent problems.