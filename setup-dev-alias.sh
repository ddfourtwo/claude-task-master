#!/bin/bash

# Make task-master.js executable
chmod +x ~/Documents/GitHub/claude-task-master/bin/task-master.js

# Determine which shell configuration file to use
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    CONFIG_FILE="$HOME/.zshrc"
    echo "Using ZSH configuration file: $CONFIG_FILE"
elif [ -n "$BASH_VERSION" ] || [ -f "$HOME/.bashrc" ]; then
    CONFIG_FILE="$HOME/.bashrc"
    echo "Using Bash configuration file: $CONFIG_FILE"
else
    echo "Could not determine shell type. Please add the alias manually."
    exit 1
fi

# Check if alias already exists
if grep -q "alias task-master=" "$CONFIG_FILE"; then
    echo "task-master alias already exists in $CONFIG_FILE"
else
    # Add the alias
    echo "" >> "$CONFIG_FILE"
    echo "# Task Master development alias" >> "$CONFIG_FILE"
    echo "alias task-master='~/Documents/GitHub/claude-task-master/bin/task-master.js'" >> "$CONFIG_FILE"
    echo "Added task-master alias to $CONFIG_FILE"
fi

echo "To use the alias in the current terminal session, run:"
echo "source $CONFIG_FILE"