/**
 * taskContentHook.js
 * Hooks into task operations to update CLAUDE.md dynamic content
 */

import { readJSON } from '../scripts/modules/utils.js';
import path from 'path';
import { 
  isClaudeCodeIntegrationEnabled, 
  updateDynamicContent,
  formatTasksForClaudeDisplay
} from './claudeContentManager.js';

/**
 * Updates the dynamic content in CLAUDE.md with the current task state
 * @param {string} tasksPath - Path to tasks.json
 */
export async function updateTaskContentInClaudeMd(tasksPath) {
  // Skip if Claude Code integration is not enabled
  if (!isClaudeCodeIntegrationEnabled()) {
    return;
  }
  
  try {
    // Read current tasks
    const tasks = readJSON(tasksPath);
    
    if (!tasks || !Array.isArray(tasks)) {
      return;
    }
    
    // Format tasks for display
    const formattedContent = formatTasksForClaudeDisplay(tasks);
    
    // Update dynamic content
    await updateDynamicContent(formattedContent);
  } catch (error) {
    console.error(`Error updating task content in CLAUDE.md: ${error.message}`);
  }
}

/**
 * Create a wrapper function that updates Claude MD after the original function completes
 * @param {Function} originalFn - Original function to wrap
 * @param {Function} tasksPathFn - Function that returns the tasks.json path
 * @returns {Function} - Wrapped function
 */
export function createTaskHookWrapper(originalFn, tasksPathFn) {
  return async function(...args) {
    // Call the original function first
    const result = await originalFn.apply(this, args);
    
    // If Claude Code integration is enabled, update the dynamic content
    if (isClaudeCodeIntegrationEnabled()) {
      try {
        // Get the tasks.json path
        const tasksPath = tasksPathFn(...args);
        
        // Update dynamic content in CLAUDE.md
        await updateTaskContentInClaudeMd(tasksPath);
      } catch (error) {
        console.error(`Error in task hook wrapper: ${error.message}`);
      }
    }
    
    // Return the original result
    return result;
  };
}

export default {
  updateTaskContentInClaudeMd,
  createTaskHookWrapper
};