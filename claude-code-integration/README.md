# Task Master - Claude Code Integration

This module adds Claude Code support to Task Master, allowing it to work seamlessly with Claude CLI.

## Quick Start

```bash
# Install Task Master globally
npm install -g task-master-ai

# Create a .env file with Claude Code mode enabled
echo "CLAUDE_CODE_MODE=true" > .env

# Initialize a new project
task-master init
```

## How It Works

The integration is designed to be simple and non-intrusive:

1. **Initialization** - When a project is initialized with `CLAUDE_CODE_MODE=true`:
   - Creates a `CLAUDE.md` file with a special `<task-master-dynamic-content>` placeholder
   - Creates a `.claude` directory for the router plugin
   - No changes to how Task Master operates otherwise

2. **Claude Code Router Plugin** - The plugin:
   - Reads tasks directly from your `tasks.json` file 
   - Also reads and formats Windsurf rules from `.windsurfrules` 
   - Injects this content into Claude's context through the placeholder
   - No file duplication or complex wrappers - just direct access

3. **Normal Task Master Operation** - Task Master operates as usual:
   - Add, update, and manage tasks with Task Master CLI
   - Tasks are stored in `tasks.json` (single source of truth)
   - No special commands or modes needed

4. **MCP Integration** - Use Task Master MCP tools directly in Claude:
   - Configure Claude Code to use Task Master MCP
   - Ask Claude to create, update, and manage tasks
   - All changes update the same `tasks.json` file

## Setup

### Option 1: Environment Variable (Recommended)

1. **Create a `.env` file with Claude Code mode:**

```bash
# Create or edit your .env file
echo "CLAUDE_CODE_MODE=true" > .env
echo "ANTHROPIC_API_KEY=your_api_key_here" >> .env

# Initialize your project
task-master init
```

2. **Configure in `~/.claude.json`:**
   
```json
{
    "mcpServers": {
        "taskmaster-ai": {
            "command": "npx",
            "args": [
                "-y", 
                "--package=task-master-ai", 
                "task-master-mcp"
            ],
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

3. **Start Claude Code in your project directory:**
```bash
claude-code
```

4. **Manage tasks through Claude:**
```
User: Create a new task to "Implement user authentication" with high priority.
User: What tasks do I have pending?
User: Mark the authentication task as in progress.
```

### Option 2: Manual Setup

For manual setup without environment variables:

1. **Create CLAUDE.md with placeholder:**
```bash
echo "# CLAUDE.md

<task-master-dynamic-content></task-master-dynamic-content>" > CLAUDE.md
```

2. **Copy the plugin to `.claude` directory:**
```bash
mkdir -p .claude
cp node_modules/task-master-ai/claude-code-integration/taskMasterPlugin.mjs .claude/
```

3. **Configure Claude Code as in Option 1, step 2.**

## Example CLAUDE.md Format

```markdown
# CLAUDE.md

<task-master-dynamic-content>
# Task Master - Task List

## Status Overview
- Pending: 1
- In Progress: 1
- Completed: 1
- Deferred: 0

## Tasks
🔄 Task 2: Implement authentication [high]
  Dependencies: 1
  Subtasks: 1/3 completed

⏳ Task 3: Add database integration [medium]
  Dependencies: 1, 2

✅ Task 1: Initialize project [high]
  Subtasks: 2/2 completed

# GitHub Copilot Windsurf Rules
```
# Task Master Development Workflow Rules

# Task creation and management
Write descriptive task names and add detailed descriptions for complex tasks
Use consistent priority levels: high, medium, low
Mark in_progress tasks when starting work, and complete when done

# Code quality
Include tests for new functionality
Update documentation when making significant changes
Follow project code style guidelines
```
</task-master-dynamic-content>
```

## Troubleshooting

- **Tasks not appearing in Claude Code**: 
  - Ensure `CLAUDE.md` exists with the placeholder tags
  - Check that tasks.json exists and has valid content
  - Verify Claude Code is configured to use the taskMasterPlugin

- **Can't find MCP tools in Claude Code**:
  - Check your `~/.claude.json` configuration
  - Ensure Task Master MCP server is properly configured

- **Windsurf rules not appearing**:
  - Make sure `.windsurfrules` file exists in the root directory
  - Verify the file has content and is readable
  - Check file permissions

## How to Contribute

Contributions are welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.