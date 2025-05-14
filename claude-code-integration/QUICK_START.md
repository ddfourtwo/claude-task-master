# Task Master - Claude Code Integration: Quick Start

## 1. Install & Setup

```bash
# Install Task Master globally
npm install -g task-master-ai

# In your project directory
cd your-project

# Initialize Task Master
task-master init

# Install the integration
npm install --save-dev /path/to/claude-task-master/claude-code-integration
```

## 2. Add the Filter to Claude Code Router

```javascript
// In your router configuration
import { filterMessages } from '@claude-code/task-master-integration/integrationWithFilter.js';

// Add to your message processing
router.use(filterMessages);
```

## 3. Start Using Task Master

```bash
# Add some tasks
task-master add "Implement user authentication" --priority high
task-master add "Set up database schema" --priority medium
task-master add "Create API endpoints" --dependencies 1,2

# Mark a task as in progress
task-master set-status 1 in_progress
```

## 4. Talk to Claude

Start a conversation with Claude using your Claude Code setup. You'll see:

- Magenta logs showing task content being injected
- Claude will be aware of your tasks and can reference them
- Each time you update a task, Claude will see the updates in your next message

## Example Conversation

You: "What should I work on next for this project?"

Claude: [Sees your task list and responds with suggestions based on task priorities and dependencies]

## Troubleshooting

- Ensure CLAUDE.md exists in your working directory
- Check that you're running Claude Code from your project directory
- Look for the magenta logs to confirm task content injection