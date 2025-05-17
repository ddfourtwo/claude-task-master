#!/bin/bash

# Task Master Development Installation Script
# Complete setup for local development and testing

set -e

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}   Task Master Development Installation        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════${NC}"

# Check if we're in the project directory
if [ ! -f "package.json" ] || [ ! -d "scripts" ] || [ ! -d "mcp-server" ]; then
    echo -e "${RED}Error: Must run from the task-master root directory${NC}"
    exit 1
fi

# Get the project directory
PROJECT_DIR=$(pwd)
USER_BIN="$HOME/.local/bin"

echo -e "\n${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo -e "\n${YELLOW}Step 2: Setting executable permissions...${NC}"
npm run prepare

echo -e "\n${YELLOW}Step 3: Creating local development environment...${NC}"

# Create user bin directory
mkdir -p "$USER_BIN"

# Create direct executable links
echo -e "  Creating executable links..."
ln -sf "$PROJECT_DIR/bin/task-master.js" "$USER_BIN/task-master"
ln -sf "$PROJECT_DIR/mcp-server/server.js" "$USER_BIN/task-master-mcp"

# Create npx support in local node_modules
echo -e "  Setting up npx support..."
mkdir -p node_modules/.bin

# Create wrapper scripts for npx
cat > node_modules/.bin/task-master << EOF
#!/usr/bin/env node
import('$PROJECT_DIR/bin/task-master.js');
EOF
chmod +x node_modules/.bin/task-master

cat > node_modules/.bin/task-master-ai << EOF
#!/usr/bin/env node
import('$PROJECT_DIR/mcp-server/server.js');
EOF
chmod +x node_modules/.bin/task-master-ai

cat > node_modules/.bin/task-master-mcp << EOF
#!/usr/bin/env node
import('$PROJECT_DIR/mcp-server/server.js');
EOF
chmod +x node_modules/.bin/task-master-mcp

# Check/Update PATH
if [[ ":$PATH:" != *":$USER_BIN:"* ]]; then
    echo -e "\n${YELLOW}Step 4: Updating PATH...${NC}"
    SHELL_RC=""
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    fi
    
    if [ -n "$SHELL_RC" ]; then
        echo "" >> "$SHELL_RC"
        echo "# Task Master local development" >> "$SHELL_RC"
        echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_RC"
        echo -e "${GREEN}Added to $SHELL_RC${NC}"
    fi
fi

# Test installation
echo -e "\n${YELLOW}Testing installation...${NC}"
export PATH="$HOME/.local/bin:$PATH"
if command -v task-master &> /dev/null; then
    VERSION=$(task-master --version)
    echo -e "${GREEN}✓ task-master installed (version: $VERSION)${NC}"
fi
if npx task-master --version &> /dev/null; then
    echo -e "${GREEN}✓ npx task-master working${NC}"
fi

# Show completion message
echo -e "\n${GREEN}═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}   ✅ Installation Complete!                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}Available commands:${NC}"
echo -e "  ${YELLOW}task-master${NC}     - Direct CLI usage"
echo -e "  ${YELLOW}npx task-master${NC} - NPX usage (from project directory)"
echo -e "  ${YELLOW}npx task-master-ai${NC} - MCP server"

echo -e "\n${GREEN}MCP Configuration Options:${NC}"
echo -e "\n${BLUE}Option 1 - Direct path (fastest):${NC}"
cat << EOF
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "$USER_BIN/task-master-mcp",
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
EOF

echo -e "\n${BLUE}Option 2 - Node command:${NC}"
cat << EOF
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "node",
      "args": ["$PROJECT_DIR/mcp-server/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
EOF

echo -e "\n${BLUE}Option 3 - NPX (from project directory):${NC}"
cat << EOF
{
  "mcpServers": {
    "taskmaster-dev": {
      "command": "npx",
      "args": ["task-master-ai"],
      "cwd": "$PROJECT_DIR",
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY"
      }
    }
  }
}
EOF

echo -e "\n${GREEN}Development tips:${NC}"
echo -e "  • Changes to code are reflected immediately"
echo -e "  • No need to reinstall after code changes"
echo -e "  • Run ${YELLOW}npm test${NC} to test your changes"
echo -e "  • Run ${YELLOW}npm run inspector${NC} for MCP debugging"

if [[ ":$PATH:" != *":$USER_BIN:"* ]]; then
    echo -e "\n${YELLOW}⚠️  Action required:${NC}"
    echo -e "  Run: ${YELLOW}source ~/.bashrc${NC}"
    echo -e "  Or: ${YELLOW}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
fi

echo