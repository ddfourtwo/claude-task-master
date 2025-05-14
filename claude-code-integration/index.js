/**
 * Claude Code integration for Task Master
 * 
 * This module provides a simple integration with Claude Code by:
 * 1. Creating CLAUDE.md file with placeholder during initialization
 * 2. Making the task information available to Claude Code through the router plugin
 */

import { initializeClaudeCodeIntegration } from './initializeClaudeIntegration.js';
import { initializeProjectDirect as originalInit } from '../mcp-server/src/core/direct-functions/initialize-project.js';

/**
 * Checks if Claude Code integration is enabled
 * @returns {boolean} - Whether integration is enabled
 */
export function isClaudeCodeIntegrationEnabled() {
  return process.env.CLAUDE_CODE_MODE === 'true';
}

/**
 * Export initialization function
 */
export {
  initializeClaudeCodeIntegration
};

/**
 * Custom initialization function that calls the original and then sets up Claude Code if enabled
 */
export async function initializeProjectDirect(args, log, context = {}) {
  // Call the original function first
  const result = await originalInit(args, log, context);
  
  // If Claude Code mode is enabled, create CLAUDE.md with placeholder
  if (isClaudeCodeIntegrationEnabled()) {
    await initializeClaudeCodeIntegration(args.projectRoot || process.cwd());
  }
  
  return result;
}

// Export the initialization function for direct use in scripts/init.js
export default { initializeProjectDirect };