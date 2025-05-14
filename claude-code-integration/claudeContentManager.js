/**
 * claudeContentManager.js
 * Manages the dynamic content in CLAUDE.md for Task Master integration with Claude Code
 */

import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { log } from '../scripts/modules/utils.js';

// Configuration constants
const CLAUDE_MD_PATH = path.join(process.cwd(), 'CLAUDE.md');
const PLACEHOLDER_TAG = 'task-master-dynamic-content';

/**
 * Updates the Task Master dynamic content in CLAUDE.md
 * @param {string} content - New content for the dynamic section
 * @returns {Promise<boolean>} - Success status
 */
export async function updateDynamicContent(content) {
  try {
    // Check if CLAUDE.md exists
    if (!existsSync(CLAUDE_MD_PATH)) {
      log('warn', `CLAUDE.md not found at ${CLAUDE_MD_PATH}`);
      return false;
    }
    
    // Read existing content
    const claudeContent = await fs.readFile(CLAUDE_MD_PATH, 'utf8');
    
    // Replace content between tags
    const regex = new RegExp(`<${PLACEHOLDER_TAG}>(.*?)</${PLACEHOLDER_TAG}>`, 's');
    
    if (regex.test(claudeContent)) {
      const updatedContent = claudeContent.replace(
        regex,
        `<${PLACEHOLDER_TAG}>\n${content}\n</${PLACEHOLDER_TAG}>`
      );
      
      // Write the updated content back
      await fs.writeFile(CLAUDE_MD_PATH, updatedContent, 'utf8');
      log('info', 'Updated Task Master dynamic content in CLAUDE.md');
      return true;
    } else {
      log('warn', `CLAUDE.md exists but doesn't contain the ${PLACEHOLDER_TAG} placeholder`);
      return false;
    }
  } catch (error) {
    log('error', `Error updating dynamic content in CLAUDE.md: ${error.message}`);
    return false;
  }
}

/**
 * Checks if Claude Code integration is enabled
 * @returns {boolean} - Whether integration is enabled
 */
export function isClaudeCodeIntegrationEnabled() {
  return process.env.CLAUDE_CODE_MODE === 'true';
}

/**
 * Formats task list for display in CLAUDE.md
 * @param {Array} tasks - Array of task objects
 * @returns {string} - Formatted text representation of tasks
 */
export function formatTasksForClaudeDisplay(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 'No tasks available.';
  }
  
  const lines = ['# Task Master - Task List'];
  
  // Add task status counts
  const statuses = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in_progress': tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done' || t.status === 'completed').length,
    deferred: tasks.filter(t => t.status === 'deferred').length,
  };
  
  lines.push(
    '## Status Overview',
    `- Pending: ${statuses.pending}`,
    `- In Progress: ${statuses['in_progress']}`,
    `- Completed: ${statuses.done}`,
    `- Deferred: ${statuses.deferred}`,
    ''
  );
  
  // Display top-level tasks sorted by status priority and id
  lines.push('## Tasks');
  
  // Sort tasks by status priority and id
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in_progress': 0, pending: 1, deferred: 2, done: 3, completed: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.id - b.id;
  });
  
  // Format tasks with compact representation
  sortedTasks.forEach(task => {
    const statusSymbol = {
      pending: '⏳',
      'in_progress': '🔄',
      done: '✅',
      completed: '✅',
      deferred: '⏱️',
    }[task.status] || '•';
    
    lines.push(`${statusSymbol} Task ${task.id}: ${task.title} [${task.priority}]`);
    
    // Add dependency info if present
    if (task.dependencies && task.dependencies.length > 0) {
      lines.push(`  Dependencies: ${task.dependencies.join(', ')}`);
    }
    
    // Add subtask summary if present
    if (task.subtasks && task.subtasks.length > 0) {
      const subtaskStatuses = {
        pending: task.subtasks.filter(st => st.status === 'pending').length,
        'in_progress': task.subtasks.filter(st => st.status === 'in_progress').length,
        done: task.subtasks.filter(st => st.status === 'done' || st.status === 'completed').length,
      };
      
      lines.push(`  Subtasks: ${subtaskStatuses.done}/${task.subtasks.length} completed`);
    }
    
    lines.push(''); // Add space between tasks
  });
  
  lines.push('Use Task Master MCP tools to manage tasks.');
  
  return lines.join('\n');
}

export default {
  updateDynamicContent,
  isClaudeCodeIntegrationEnabled,
  formatTasksForClaudeDisplay,
};