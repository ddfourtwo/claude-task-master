// Import the Task Master plugin
import taskMasterPlugin from './taskMasterPlugin.mjs';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

// Configuration constants
const CLAUDE_MD_PATH = path.join(process.cwd(), 'CLAUDE.md');
const PLACEHOLDER_TAG = 'task-master-dynamic-content';

/**
 * Message filter function that integrates the taskMasterPlugin
 * to inject task context into messages going to Claude
 */
export const filterMessages = async (messagesOrData, model) => {
  var dataObj = messagesOrData;
  const dataModel = model || dataObj.model;
  
  // Initialize taskMasterPlugin if needed
  await taskMasterPlugin.initialize();
  
  // Apply Task Master processing by injecting task context
  try {
    // Check if CLAUDE.md exists and has our content
    if (existsSync(CLAUDE_MD_PATH)) {
      const claudeContent = await fs.readFile(CLAUDE_MD_PATH, 'utf8');
      
      // Extract the current Task Master dynamic content
      const regex = new RegExp(`<${PLACEHOLDER_TAG}>(.*?)</${PLACEHOLDER_TAG}>`, 's');
      const match = regex.exec(claudeContent);
      
      if (match && match[1]) {
        const dynamicContent = match[1].trim();
        
        // Add the task context as a system message at the beginning if messages array exists
        if (dataObj.messages && Array.isArray(dataObj.messages)) {
          // Look for existing system message with task context
          const taskContextMsgIndex = dataObj.messages.findIndex(msg => 
            msg.role === 'system' && msg.content.includes('Task Master State'));
          
          const taskMasterContext = {
            role: 'system',
            content: `Current Task Master State:\n\`\`\`\n${dynamicContent}\n\`\`\``
          };
          
          if (taskContextMsgIndex >= 0) {
            // Update existing task context message
            dataObj.messages[taskContextMsgIndex] = taskMasterContext;
            console.log(chalk.magenta('💭 [Task Master] Updated task context in message stream'));
          } else {
            // Add new task context message at the beginning
            dataObj.messages.unshift(taskMasterContext);
            console.log(chalk.magentaBright('✨ [Task Master] Injected new task context into message stream'));
          }
          
          // Log a preview of the content injected
          const previewLines = dynamicContent.split('\n').slice(0, 3);
          const previewContent = previewLines.join('\n') + 
            (previewLines.length < dynamicContent.split('\n').length ? '\n...' : '');
          console.log(chalk.magenta('📋 [Task Master] Content preview:'));
          console.log(chalk.magenta(previewContent));
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('❌ [Task Master] Error injecting content:'), error);
  }
  
  // Then apply your existing filters
  dataObj = filterMessagesInternal(dataObj, dataModel, ['backgroundSummaries'], false);
  dataObj = filterMessagesInternal(dataObj, dataModel, ['gerundVerbs'], true);

  return dataObj;
};

// Original filterMessagesInternal function would go here