#!/usr/bin/env node

/**
 * test.js
 * Test script to verify Task Master integration with Claude Code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeClaudeCodeIntegration } from './initializeClaudeIntegration.js';

// Set up environment
process.env.CLAUDE_CODE_MODE = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a temporary test directory
const TEST_DIR = path.join(process.cwd(), 'temp-test-claude');
const CLAUDE_MD_PATH = path.join(TEST_DIR, 'CLAUDE.md');
const CLAUDE_DIR_PATH = path.join(TEST_DIR, '.claude');
const TASKS_DIR = path.join(TEST_DIR, 'tasks');
const TASKS_JSON_PATH = path.join(TASKS_DIR, 'tasks.json');
const WINDSURF_RULES_FILE = path.join(TEST_DIR, '.windsurfrules');

// Sample tasks for testing
const SAMPLE_TASKS = [
  {
    id: '1',
    title: 'Initialize project',
    description: 'Set up the initial project structure',
    status: 'completed',
    priority: 'high',
    subtasks: [
      {
        id: '1.1',
        title: 'Create directory structure',
        status: 'completed'
      },
      {
        id: '1.2',
        title: 'Initialize package.json',
        status: 'completed'
      }
    ]
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Set up user authentication system',
    status: 'in_progress',
    priority: 'high',
    dependencies: ['1'],
    subtasks: [
      {
        id: '2.1',
        title: 'Create login form',
        status: 'completed'
      },
      {
        id: '2.2',
        title: 'Implement JWT authentication',
        status: 'in_progress'
      },
      {
        id: '2.3',
        title: 'Add password reset functionality',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    title: 'Add database integration',
    description: 'Connect to database and create models',
    status: 'pending',
    priority: 'medium',
    dependencies: ['1', '2']
  }
];

// Sample cursor rule
const SAMPLE_RULE = {
  "name": "Project Conventions",
  "description": "Ensure code follows project conventions",
  "patterns": [
    {
      "pattern": "\\.js$",
      "conventions": [
        {
          "name": "Use strict mode",
          "description": "All JavaScript files should use strict mode",
          "regex": "^'use strict';"
        }
      ]
    }
  ]
};

/**
 * Create a modified plugin that reads from the test directory
 */
function createTestPlugin() {
  const pluginContent = fs.readFileSync(path.join(__dirname, 'taskMasterPlugin.mjs'), 'utf8');
  
  // Replace process.cwd() with TEST_DIR
  const modifiedContent = pluginContent
    .replace(/process\.cwd\(\)/g, `"${TEST_DIR.replace(/\\/g, '\\\\')}"`)
    .replace(/console\.log\(/g, 'console.info('); // Change log level to avoid confusion in test output
  
  const testPluginPath = path.join(CLAUDE_DIR_PATH, 'taskMasterPlugin.mjs');
  fs.writeFileSync(testPluginPath, modifiedContent, 'utf8');
  
  return testPluginPath;
}

/**
 * Setup test environment
 */
async function setup() {
  console.log('Setting up test environment...');
  
  // Create test directory
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  
  // Create tasks directory and sample tasks.json
  if (!fs.existsSync(TASKS_DIR)) {
    fs.mkdirSync(TASKS_DIR, { recursive: true });
  }
  
  // Write sample tasks
  fs.writeFileSync(TASKS_JSON_PATH, JSON.stringify(SAMPLE_TASKS, null, 2), 'utf8');
  
  // Create and write the Windsurf rules file
  fs.writeFileSync(
    WINDSURF_RULES_FILE,
    `# Task Master Development Workflow Rules

# Task creation and management
Write descriptive task names and add detailed descriptions for complex tasks
Use consistent priority levels: high, medium, low
Mark in_progress tasks when starting work, and complete when done

# Code quality
Include tests for new functionality
Update documentation when making significant changes
Follow project code style guidelines
`,
    'utf8'
  );
  
  // Create modified plugin for the test
  if (!fs.existsSync(CLAUDE_DIR_PATH)) {
    fs.mkdirSync(CLAUDE_DIR_PATH, { recursive: true });
  }
  
  createTestPlugin();
  
  console.log('Test environment set up successfully.');
}

/**
 * Clean up test environment
 */
function cleanup() {
  console.log('Cleaning up test environment...');
  
  // Delete test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  
  console.log('Test environment cleaned up successfully.');
}

/**
 * Test Claude Code integration initialization
 */
async function testInitialization() {
  console.log('\nTesting initialization...');
  
  // Initialize Claude Code integration
  const success = await initializeClaudeCodeIntegration(TEST_DIR);
  
  // Check if initialization was successful
  if (!success) {
    console.error('  ❌ Initialization failed');
    return false;
  }
  
  // Check if CLAUDE.md was created
  if (!fs.existsSync(CLAUDE_MD_PATH)) {
    console.error('  ❌ CLAUDE.md was not created');
    return false;
  } else {
    console.log('  ✅ CLAUDE.md was created');
  }
  
  // Check if placeholder exists in CLAUDE.md
  const claudeContent = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
  if (!claudeContent.includes('<task-master-dynamic-content>')) {
    console.error('  ❌ task-master-dynamic-content placeholder not found in CLAUDE.md');
    return false;
  } else {
    console.log('  ✅ task-master-dynamic-content placeholder found in CLAUDE.md');
  }
  
  console.log('Initialization test passed!');
  return true;
}

/**
 * Test router plugin functionality
 */
async function testRouterPlugin() {
  console.log('\nTesting router plugin...');
  
  try {
    // Import the plugin directly to test its functionality
    const pluginPath = path.join(CLAUDE_DIR_PATH, 'taskMasterPlugin.mjs');
    const urlPath = `file://${pluginPath.replace(/\\/g, '/')}`;
    
    // Force reimport by clearing cache
    if (global.gc) {
      global.gc();
    }
    
    const { default: taskMasterPlugin } = await import(urlPath + '?t=' + Date.now());
    
    if (typeof taskMasterPlugin !== 'function') {
      console.error('  ❌ Plugin not exported correctly');
      return false;
    }
    
    // Create a mock context with registerContentHook
    let registeredHook = null;
    const mockContext = {
      registerContentHook: (hook) => {
        registeredHook = hook;
        return mockContext;
      }
    };
    
    // Call the plugin
    const resultContext = taskMasterPlugin(mockContext);
    
    // Check if hook was registered
    if (!registeredHook) {
      console.error('  ❌ Content hook was not registered');
      return false;
    } else {
      console.log('  ✅ Content hook was registered');
    }
    
    // Test if tag matches
    if (registeredHook.tag !== 'task-master-dynamic-content') {
      console.error(`  ❌ Wrong tag registered: ${registeredHook.tag}`);
      return false;
    } else {
      console.log('  ✅ Correct tag was registered');
    }
    
    // Call the resolve function to get the content
    const content = registeredHook.resolve();
    console.log('\nGenerated content preview:');
    console.log('---------------------------');
    console.log(content.substring(0, 300) + '...');
    console.log('---------------------------');
    
    // Check if the content contains tasks
    if (!content.includes('Implement authentication')) {
      console.error('  ❌ Tasks not included in resolved content');
      return false;
    } else {
      console.log('  ✅ Tasks included in resolved content');
    }
    
    // Check if the content contains Windsurf rules
    if (!content.includes('Task Master Development Workflow Rules')) {
      console.error('  ❌ Windsurf rules not included in resolved content');
      return false;
    } else {
      console.log('  ✅ Windsurf rules included in resolved content');
    }
    
    console.log('Router plugin test passed!');
    return true;
  } catch (error) {
    console.error('  ❌ Error testing router plugin:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    // Setup
    await setup();
    
    let success = true;
    
    // Run tests
    success = await testInitialization() && success;
    success = await testRouterPlugin() && success;
    
    // Report results
    console.log('\n---------------------------------------');
    if (success) {
      console.log('✅ All tests passed! Claude Code integration is working correctly.');
    } else {
      console.error('❌ Some tests failed. See above for details.');
    }
    console.log('---------------------------------------\n');
    
    // Cleanup
    cleanup();
    
    return success;
  } catch (error) {
    console.error('Error running tests:', error);
    cleanup();
    return false;
  }
}

// Run tests if this script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTests();
}

export { runTests };