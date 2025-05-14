# Task Master - Claude Code Integration Installation Guide

This guide provides detailed instructions for integrating Task Master with Claude Code.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Claude Code CLI installed
- Task Master (task-master-ai) installed globally or in your project

## Installation Options

### Option 1: Automatic Setup (Recommended)

The easiest way to set up Claude Code integration is to use the environment variable approach:

1. **Create or update your `.env` file:**

```bash
# Create or edit your .env file
echo "CLAUDE_CODE_MODE=true" > .env
echo "ANTHROPIC_API_KEY=your_api_key_here" >> .env

# Optional: Add other API keys if needed
echo "PERPLEXITY_API_KEY=your_perplexity_key_here" >> .env
```

2. **Initialize your project with Task Master:**

```bash
npx task-master-ai init
```

This will:
- Create the necessary directory structure
- Initialize the tasks directory
- Create a CLAUDE.md file with the task-master-dynamic-content placeholder
- Set up the Claude Code plugin

3. **Configure Claude Code:**

The initialization process will provide instructions for configuring your `~/.claude.json` file. Add the following to your configuration:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "CLAUDE_CODE_MODE": "true"
      }
    }
  },
  "settings": {
    "plugins": [
      {
        "name": "taskMasterPlugin",
        "enabled": true,
        "path": "./.claude/taskMasterPlugin.mjs"
      }
    ]
  }
}
```

4. **Create and manage tasks:**

You can now create and manage tasks using both the CLI and Claude Code:

```bash
# Using the CLI
task-master add "Implement user authentication" --priority high

# Or via Claude Code:
claude-code
```

Then within Claude Code, you can say: "Add a new task to implement database integration with medium priority."

### Option 2: Manual Setup

If you prefer a more manual setup:

1. **Initialize Task Master without Claude Code mode:**

```bash
npx task-master-ai init
```

2. **Create the CLAUDE.md file manually:**

```bash
echo "# Task Master with Claude Code

This file contains dynamic content that will be updated by Task Master.

<task-master-dynamic-content></task-master-dynamic-content>
" > CLAUDE.md
```

3. **Set up the .claude directory and plugin:**

```bash
mkdir -p .claude
cp node_modules/task-master-ai/claude-code-integration/taskMasterPlugin.mjs .claude/
```

4. **Configure Claude Code as in Option 1, step 3.**

## Testing the Integration

To test if your integration is working correctly:

1. **Create a test task:**

```bash
npx task-master-ai add "Test task" --priority medium
```

2. **Check CLAUDE.md:**

The CLAUDE.md file should now contain formatted task information in the dynamic content section.

3. **Start Claude Code and check if tasks are visible:**

```bash
claude-code
```

Then ask Claude about your tasks: "What tasks do I have pending?"

## Troubleshooting

### Common Issues

1. **Task information not appearing in Claude Code:**
   - Check if CLAUDE.md exists and contains the proper placeholder tags
   - Verify that tasks.json exists in your project's tasks directory
   - Ensure the Claude Code plugin is correctly configured

2. **MCP Tools not available in Claude Code:**
   - Verify your ~/.claude.json configuration
   - Check that the taskmaster-ai MCP server is properly configured
   - Make sure CLAUDE_CODE_MODE=true is set in the environment

3. **Plugin not found errors:**
   - Check that the path to taskMasterPlugin.mjs in your Claude Code config is correct
   - Ensure the .claude directory exists and contains the plugin file

### Debugging

For advanced debugging:

1. **Enable verbose logging:**

```bash
NODE_DEBUG=taskmaster* npx task-master-ai init
```

2. **Check Claude Code logs:**

```bash
claude-code --debug
```

3. **Verify file structure:**

```bash
find . -name "CLAUDE.md"
find . -path "*/.claude/taskMasterPlugin.mjs"
find ./tasks -name "tasks.json"
```

## Manual Refresh

If you need to manually refresh the task content in CLAUDE.md:

```bash
# Using the test script
node node_modules/task-master-ai/claude-code-integration/test.js
```

## Uninstalling

To remove Claude Code integration:

1. Remove the CLAUDE.md file
2. Remove the .claude directory
3. Remove the taskmaster-ai configuration from ~/.claude.json

## Further Reading

- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Task Master Documentation](https://github.com/your-repo/task-master-ai/README.md)
- [Claude MCP Protocol Specification](https://github.com/anthropics/anthropic-cookbook/blob/main/mcp/README.md)