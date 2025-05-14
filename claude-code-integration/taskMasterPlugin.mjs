/**
 * taskMasterPlugin.mjs
 * Claude Code Router plugin to integrate Task Master with Claude Code
 */

import fs from 'fs/promises';
import path from 'path';

// Configuration constants
const CLAUDE_RULES_PATH = path.join(process.cwd(), '.clauderules');
const TASKS_JSON_PATH = path.join(process.cwd(), 'tasks/tasks.json');

let dynamicTaskMasterContent = '';

/**
 * Task Master Plugin for Claude Code Router
 * - Generates dynamic content from .clauderules and tasks/tasks.json
 */
export default {
  name: 'taskMasterPlugin',
  version: '1.0.0',

  /**
   * Initialize the plugin
   * Reads .clauderules and tasks/tasks.json and generates dynamic content
   */
  async initialize() {
    // console.log('Initializing Task Master Plugin for Claude Code');

    try {
      let claudeRulesContent = '';
      let tasksJsonContent = '';

      // Read .clauderules
      try {
        claudeRulesContent = await fs.readFile(CLAUDE_RULES_PATH, 'utf8');
        // Replace 'windsurf' with 'claude' in the content
        // console.log('.clauderules read and processed successfully.');
      } catch (error) {
        console.warn(`Warning: Could not read or process .clauderules at ${CLAUDE_RULES_PATH}: ${error.message}`);
        claudeRulesContent = 'Error reading or processing .clauderules.';
      }

      // Read tasks/tasks.json
      try {
        tasksJsonContent = await fs.readFile(TASKS_JSON_PATH, 'utf8');
        // console.log('tasks/tasks.json read successfully.');
      } catch (error) {
        console.warn(`Warning: Could not read tasks/tasks.json at ${TASKS_JSON_PATH}: ${error.message}`);
        tasksJsonContent = 'Error reading tasks/tasks.json.';
      }

      // Combine content
      dynamicTaskMasterContent = `## Claude Rules\n\n\`\`\`\n${claudeRulesContent}\n\`\`\`\n\n## Tasks\n\n\`\`\`json\n${tasksJsonContent}\n\`\`\``;

      // console.log('Task Master Plugin initialized successfully. Dynamic content generated.');
    } catch (error) {
      console.error('Error initializing Task Master Plugin:', error);
      dynamicTaskMasterContent = 'Error generating Task Master dynamic content.';
    }
  },

  /**
   * Provides access to the generated dynamic content.
   */
  getDynamicContent() {
    return dynamicTaskMasterContent;
  },

  /**
   * No processing needed for outgoing or incoming messages here.
   * Message filtering handles injection.
   */
  async processOutgoingMessage(message) {
    return message;
  },

  async processIncomingMessage(message) {
    return message;
  }
};
