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

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    
    # Check if nvm is installed
    if [ -f "$HOME/.nvm/nvm.sh" ] || [ -f "/usr/local/opt/nvm/nvm.sh" ]; then
        echo -e "${YELLOW}nvm is installed but Node.js is not active${NC}"
        echo -e "${YELLOW}Run: nvm install --lts${NC}"
        echo -e "${YELLOW}Then: nvm use --lts${NC}"
    else
        echo -e "${YELLOW}We recommend installing Node.js with nvm (Node Version Manager)${NC}"
        echo -e "${YELLOW}To install nvm:${NC}"
        echo -e "${CYAN}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
        echo -e "${YELLOW}Then restart your terminal and run:${NC}"
        echo -e "${CYAN}nvm install --lts${NC}"
        echo -e "${CYAN}nvm use --lts${NC}"
    fi
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    echo -e "${YELLOW}npm should come with Node.js. Please ensure Node.js is properly installed${NC}"
    exit 1
fi

# Display Node.js and npm versions
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} detected${NC}"
echo -e "${GREEN}✓ npm ${NPM_VERSION} detected${NC}"

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

echo -e "\n${YELLOW}Step 4: Installing mem0-mcp...${NC}"
MEM0_DIR="$HOME/.mem0-mcp"

# Clone or update mem0-mcp
if [ -d "$MEM0_DIR" ]; then
    echo -e "  Updating existing mem0-mcp installation..."
    cd "$MEM0_DIR"
    git pull
else
    echo -e "  Cloning mem0-mcp..."
    git clone https://github.com/ddfourtwo/mem0-mcp.git "$MEM0_DIR"
    cd "$MEM0_DIR"
fi

# Install mem0-mcp dependencies and build
echo -e "  Installing mem0-mcp dependencies..."
cd "$MEM0_DIR/node/mem0"
npm install
npm run build

# Link globally to make npx available
echo -e "  Linking mem0-mcp globally..."
npm link

# Create local symlink as well
ln -sf "$MEM0_DIR/node/mem0/dist/index.js" "$USER_BIN/mem0-mcp"

# Return to original directory
cd "$PROJECT_DIR"

echo -e "\n${YELLOW}Step 5: Installing playwright-mcp...${NC}"
# Install playwright-mcp globally for local development
echo -e "  Installing @playwright/mcp globally..."
npm install -g @playwright/mcp@latest

# Create symlink for playwright-mcp
ln -sf "$(npm root -g)/@playwright/mcp/bin/mcp.js" "$USER_BIN/playwright-mcp"

# Create npx support in local node_modules
echo -e "  Setting up npx support..."
mkdir -p node_modules/.bin

# Create wrapper scripts for npx that will use the local version
cat > node_modules/.bin/task-master << 'EOF'
#!/usr/bin/env node
import('$PROJECT_DIR/bin/task-master.js').catch(err => {
    console.error(err);
    process.exit(1);
});
EOF
# Replace $PROJECT_DIR with actual path
sed -i.bak "s|\$PROJECT_DIR|$PROJECT_DIR|g" node_modules/.bin/task-master
rm node_modules/.bin/task-master.bak
chmod +x node_modules/.bin/task-master

cat > node_modules/.bin/task-master-ai << 'EOF'
#!/usr/bin/env node
import('$PROJECT_DIR/mcp-server/server.js').catch(err => {
    console.error(err);
    process.exit(1);
});
EOF
# Replace $PROJECT_DIR with actual path
sed -i.bak "s|\$PROJECT_DIR|$PROJECT_DIR|g" node_modules/.bin/task-master-ai
rm node_modules/.bin/task-master-ai.bak
chmod +x node_modules/.bin/task-master-ai

# Also create task-master-mcp alias for consistency
ln -sf node_modules/.bin/task-master-ai node_modules/.bin/task-master-mcp

# task-master-mcp is already created as a symlink above

# Check/Update PATH
if [[ ":$PATH:" != *":$USER_BIN:"* ]]; then
    echo -e "\n${YELLOW}Step 6: Updating PATH...${NC}"
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
if [ -f "$USER_BIN/mem0-mcp" ]; then
    echo -e "${GREEN}✓ mem0-mcp installed${NC}"
fi
if [ -f "$USER_BIN/playwright-mcp" ]; then
    echo -e "${GREEN}✓ playwright-mcp installed${NC}"
fi

# Configure API Keys
echo -e "\n${YELLOW}Step 7: Configuring API Keys...${NC}"
ENV_FILE="$PROJECT_DIR/.env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "  Creating .env file..."
    touch "$ENV_FILE"
fi

# Ask about Claude Code mode
echo -e "\nAre you using Claude Code (Claude.ai desktop app)?"
echo -e "${CYAN}This will configure Task Master for optimal Claude Code integration.${NC}"
read -p "Enable Claude Code mode? (Y/n): " claude_code_mode

# Set Claude Code mode based on user input
if [[ "$claude_code_mode" != "n" && "$claude_code_mode" != "N" ]]; then
    if ! grep -q "^CLAUDE_CODE_MODE=" "$ENV_FILE"; then
        echo "CLAUDE_CODE_MODE=true" >> "$ENV_FILE"
        echo -e "${GREEN}✓${NC} Claude Code mode enabled"
    fi
else
    if ! grep -q "^CLAUDE_CODE_MODE=" "$ENV_FILE"; then
        echo "CLAUDE_CODE_MODE=false" >> "$ENV_FILE"
        echo -e "${GREEN}✓${NC} Claude Code mode disabled"
    fi
fi

# Ask if user wants to configure API keys now
echo -e "\nWould you like to configure API keys now?"
echo -e "${CYAN}You can skip this and add them later to the .env file.${NC}"
read -p "Configure API keys now? (Y/n): " configure_keys

if [[ "$configure_keys" == "n" || "$configure_keys" == "N" ]]; then
    echo -e "\n${YELLOW}Skipping API key configuration. Add them later to:${NC}"
    echo -e "${YELLOW}$ENV_FILE${NC}"
else

# Function to prompt for API key
prompt_api_key() {
    local key_name=$1
    local description=$2
    local required=$3
    
    # Check if key already exists in .env
    if grep -q "^${key_name}=" "$ENV_FILE"; then
        echo -e "  ${GREEN}✓${NC} $key_name already configured"
        return
    fi
    
    if [ "$required" = "true" ]; then
        echo -e "\n${YELLOW}$description (required)${NC}"
    else
        echo -e "\n${CYAN}$description (optional - press Enter to skip)${NC}"
    fi
    
    read -p "Enter your $key_name: " api_key
    
    if [ -n "$api_key" ]; then
        echo "${key_name}=${api_key}" >> "$ENV_FILE"
        echo -e "  ${GREEN}✓${NC} $key_name saved"
    elif [ "$required" = "true" ]; then
        echo "${key_name}=YOUR_${key_name}_HERE" >> "$ENV_FILE"
        echo -e "  ${YELLOW}⚠️${NC} $key_name saved with placeholder - update it later"
    fi
}

echo -e "\nTask Master requires API keys for various AI services."
echo -e "You can skip optional keys and add them later to the .env file.\n"

# Required API keys
prompt_api_key "ANTHROPIC_API_KEY" "Anthropic API key for Claude" "true"

# Optional API keys
prompt_api_key "PERPLEXITY_API_KEY" "Perplexity API key for web search" "false"
prompt_api_key "MEM0_API_KEY" "Mem0 API key for memory management" "false"
prompt_api_key "OPENAI_API_KEY" "OpenAI API key" "false"
prompt_api_key "GOOGLE_API_KEY" "Google AI API key" "false"
prompt_api_key "MISTRAL_API_KEY" "Mistral API key" "false"
prompt_api_key "OPENROUTER_API_KEY" "OpenRouter API key" "false"
prompt_api_key "XAI_API_KEY" "xAI API key for Grok" "false"
prompt_api_key "AZURE_OPENAI_API_KEY" "Azure OpenAI API key" "false"

    echo -e "\n${GREEN}API keys configured in $ENV_FILE${NC}"
fi # End of configure_keys conditional

# Uninstall any globally installed npm version to avoid conflicts
echo -e "\n${BLUE}Checking for existing global installations...${NC}"
if npm list -g task-master-ai 2>/dev/null | grep -v "$PROJECT_DIR" | grep -q "task-master-ai"; then
    echo -e "  Found global npm installation, removing..."
    npm uninstall -g task-master-ai
fi

# Link the package globally to make task-master command available
echo -e "\n${BLUE}Linking task-master command globally...${NC}"
npm link

# Force npm to recognize the local version for npx
echo -e "\n${BLUE}Configuring npm to prioritize local version...${NC}"
# Create a .npmrc file to prefer local packages
echo "prefer-local=true" > "$PROJECT_DIR/.npmrc"

# Show completion message
echo -e "\n${GREEN}═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}   ✅ Installation Complete!                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}Available commands:${NC}"
echo -e "  ${YELLOW}task-master${NC}     - Direct CLI usage"
echo -e "  ${YELLOW}npx task-master${NC} - NPX usage (from project directory)"
echo -e "  ${YELLOW}npx task-master-ai${NC} - MCP server"
echo -e "  ${YELLOW}mem0-mcp${NC}        - Memory MCP server"
echo -e "  ${YELLOW}playwright-mcp${NC}  - Playwright automation MCP server"

echo -e "\n${GREEN}Getting Started:${NC}"
echo -e "  1. Run ${YELLOW}task-master init${NC} in your project directory"
echo -e "  2. This will create ${YELLOW}.mcp.json${NC} with all necessary configurations"
echo -e "  3. Your API keys from ${YELLOW}.env${NC} will be automatically used"

echo -e "\n${GREEN}Development tips:${NC}"
echo -e "  • API keys are stored in ${YELLOW}$PROJECT_DIR/.env${NC}"
echo -e "  • Changes to code are reflected immediately"
echo -e "  • No need to reinstall after code changes"
echo -e "  • Run ${YELLOW}npm test${NC} to test your changes"
echo -e "  • Run ${YELLOW}npm run inspector${NC} for MCP debugging"

# Check if task-master is in PATH
if ! command -v task-master &> /dev/null; then
    echo -e "\n${YELLOW}⚠️  Task-master command not found in PATH${NC}"
    echo -e "Try one of these solutions:"
    echo -e "  1. Close and reopen your terminal"
    echo -e "  2. Run: ${YELLOW}source ~/.zshrc${NC} (for zsh) or ${YELLOW}source ~/.bashrc${NC} (for bash)"
    echo -e "  3. Use npx: ${YELLOW}cd /path/to/your/project && npx task-master init${NC}"
    echo -e "  4. Add npm bin to PATH: ${YELLOW}export PATH=\"$(npm config get prefix)/bin:\$PATH\"${NC}"
else
    echo -e "\n${GREEN}✅ Task-master command is ready to use!${NC}"
fi

# Verify installation
echo -e "\n${BLUE}Verifying installation...${NC}"
INSTALLED_VERSION=$($PROJECT_DIR/bin/task-master.js --version 2>/dev/null || echo "Unknown")
echo -e "  Local version: ${GREEN}$INSTALLED_VERSION${NC}"

# Check if npx works correctly
NPX_VERSION=$(cd "$PROJECT_DIR" && npx task-master --version 2>/dev/null || echo "Failed")
if [ "$NPX_VERSION" = "$INSTALLED_VERSION" ]; then
    echo -e "  npx command: ${GREEN}✓ Working correctly${NC}"
else
    echo -e "  npx command: ${RED}✗ Not working (got: $NPX_VERSION)${NC}"
fi

echo