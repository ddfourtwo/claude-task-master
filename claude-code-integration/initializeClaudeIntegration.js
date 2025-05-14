/**
 * initializeClaudeIntegration.js
 * Simple initialization for Claude Code integration - just creates CLAUDE.md if needed
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { log } from '../scripts/modules/utils.js';

// Configuration constants
const CLAUDE_MD_FILENAME = 'CLAUDE.md';
const CLAUDE_DIRECTORY = '.claude';
const PLACEHOLDER_TAG = 'task-master-dynamic-content';

/**
 * Creates CLAUDE.md file with task-master-dynamic-content placeholder if it doesn't exist
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<boolean>} - Success status
 */
export async function initializeClaudeCodeIntegration(projectRoot) {
  try {
    log('info', 'Initializing Claude Code integration');
    
    // Ensure projectRoot is valid
    if (!projectRoot || typeof projectRoot !== 'string') {
      projectRoot = process.cwd();
    }
    
    // Create CLAUDE.md if it doesn't exist
    const claudeMdPath = path.join(projectRoot, CLAUDE_MD_FILENAME);
    if (!existsSync(claudeMdPath)) {
      log('info', 'Creating CLAUDE.md with task-master-dynamic-content placeholder');
      const claudeMdContent = `# Task Master with Claude Code

This file contains dynamic content that will be updated by the Task Master router plugin.

<${PLACEHOLDER_TAG}>
No task information available yet. Initialize Task Master to create tasks.
</${PLACEHOLDER_TAG}>
`;
      await fs.writeFile(claudeMdPath, claudeMdContent, 'utf8');
      log('info', `Created ${claudeMdPath}`);
    } else {
      log('info', 'CLAUDE.md already exists, checking for placeholder');
      
      // Check if placeholder exists and add it if it doesn't
      const content = await fs.readFile(claudeMdPath, 'utf8');
      if (!content.includes(`<${PLACEHOLDER_TAG}>`)) {
        log('info', 'Adding placeholder to existing CLAUDE.md');
        const updatedContent = `${content.trim()}\n\n<${PLACEHOLDER_TAG}>\nNo task information available yet. Initialize Task Master to create tasks.\n</${PLACEHOLDER_TAG}>\n`;
        await fs.writeFile(claudeMdPath, updatedContent, 'utf8');
        log('info', `Updated ${claudeMdPath} with placeholder`);
      } else {
        log('info', 'CLAUDE.md already contains the placeholder tag');
      }
    }
    
    // Ensure .claude directory exists
    const claudeDir = path.join(projectRoot, CLAUDE_DIRECTORY);
    if (!existsSync(claudeDir)) {
      log('info', 'Creating .claude directory');
      await fs.mkdir(claudeDir, { recursive: true });
      log('info', `Created ${claudeDir}`);
    }
    
    log('info', 'Claude Code integration initialized successfully');
    log('info', 'Tasks and Windsurf rules will be processed by the router plugin');
    return true;
  } catch (error) {
    log('error', `Error initializing Claude Code integration: ${error.message}`);
    console.error(error);
    return false;
  }
}

export default { initializeClaudeCodeIntegration };