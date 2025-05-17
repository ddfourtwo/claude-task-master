# Local Development Installation

This guide explains how to set up Task Master for local development.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/eyaltoledano/claude-task-master.git
cd claude-task-master

# Run the installation script
./install.sh
```

This will:
- Install npm dependencies
- Create executable links in ~/.local/bin
- Set up npx support
- Add ~/.local/bin to your PATH
- Provide MCP configuration options

## What Gets Installed

The script creates these commands:
- `task-master` - The main CLI
- `npx task-master` - NPX version of the CLI
- `npx task-master-ai` - MCP server for your editor
- Direct executable at `~/.local/bin/task-master-mcp`

## MCP Configuration Options

After installation, you can use any of these configurations in your editor:

### Option 1: Direct Path (Fastest)
```json
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "/home/[username]/.local/bin/task-master-mcp",
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

### Option 2: Node Command
```json
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "node",
      "args": ["/path/to/claude-task-master/mcp-server/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

### Option 3: NPX (From Project Directory)
```json
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "npx",
      "args": ["task-master-ai"],
      "cwd": "/path/to/claude-task-master",
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

## Development Workflow

1. Make changes to the code
2. Changes are reflected immediately (no reinstall needed)
3. Restart the MCP server to see changes
4. Test with `task-master` or `npx task-master`

## Uninstalling

To remove the local installation:

```bash
# Remove symlinks
rm ~/.local/bin/task-master*

# Remove PATH from shell config
# Edit ~/.bashrc or ~/.zshrc and remove the line:
# export PATH="$HOME/.local/bin:$PATH"
```