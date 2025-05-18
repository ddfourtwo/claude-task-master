<RULES>
Below you will find a variety of important rules spanning:
- core development philosophy
- test-driven development approach
- task management workflow
- persistent memory management
- project documentation
- claude rules maintenance
- self-improvement processes

---
DEVELOPMENT_PHILOSOPHY
---
description: Core development principles for creating sustainable, AI-friendly code
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **Minimize New Code:**
  - Assess if new functionality is truly necessary before adding
  - New code increases maintenance burden and potential for bugs
  - Thoroughly check for existing code that addresses the need
  - Consider refactoring or extending existing code instead

- **Built for AI Comprehension:**
  - Write clear, readable, self-explanatory code
  - The code itself should be the primary documentation
  - Limit file size and complexity to fit within AI context windows
  - Structure code for easy understanding by both humans and AI

- **Systematic Implementation Process:**
  - Analyze code and dependencies thoroughly before changes
  - Document current state and planned modifications
  - Make single logical changes at a time
  - Implement incremental rollouts with complete integration
  - Perform simulation testing before actual implementation
  - Verify changes with comprehensive test coverage

- **Planning and Documentation:**
  - Always read existing documentation before planning
  - Review architecture documents and task plans
  - Retrieve relevant memories from persistent storage
  - Set up development environment with proper monitoring
  - Update documentation after implementation
  - Capture learnings in persistent memory

- **Testing Requirements:**
  - Write tests for all new functionality
  - Use dependency-based testing to verify existing behavior
  - Verify no breakage of existing functionality
  - Document testing procedures and results
  - Use UI testing procedures for interface changes
  - Always use playwright-mcp for E2E testing

---
TEST_DRIVEN_DEVELOPMENT
---
description: Guidelines for implementing test-driven development practices across all project components
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **TDD Core Workflow:**
  ```mermaid
  flowchart LR
  A[1. Write Test First] --> B[2. Run Test - Verify Failure]
  B --> C[3. Implement Minimal Code]
  C --> D[4. Run Test - Verify Pass]
  D --> E[5. Refactor Code]
  E --> F[6. Run Test - Verify Still Passes]
  F -->|Next Feature| A
  ```

- **Test-First Development:**
  - ALWAYS write tests BEFORE implementing functionality
  - Tests should be derived from task requirements and expected behavior
  - Start by defining the expected outcome and interface of the feature
  - Create failing tests that validate the desired behavior
  - Only after tests are written and failing, implement the actual code
  - The failing test validates that your test is actually testing something
  - This enforces proper design and clear requirements understanding

- **Backend Test Implementation:**
  - Use appropriate testing framework for your language/ecosystem
  - Begin with unit tests for core logic and business rules
  - Add integration tests to validate component interactions
  - Create API tests for endpoint behavior
  - Implement database tests with appropriate setup/teardown
  - Mock external services to isolate functionality
  - Write tests at appropriate granularity (unit, integration, system)
  
- **Frontend/UI Test Implementation:**
  - ALWAYS use playwright-mcp server for E2E testing
  - Start with component unit tests for individual UI elements
  - Add integration tests for component interactions
  - Create E2E tests for complete user flows
  - Test both positive paths and error conditions
  - Validate accessibility requirements
  - Example playwright-mcp test flow:
    ```javascript
    // ✅ DO: Write E2E tests first to define expected user behavior
    test('User can create a new task', async () => {
      // Navigate to task page
      await mcp__playwrite-mcp__browser_navigate({ url: '/tasks' });
      
      // Click new task button
      await mcp__playwrite-mcp__browser_click({
        element: 'New Task button',
        ref: 'some-element-id'
      });
      
      // Fill task form fields
      await mcp__playwrite-mcp__browser_type({
        element: 'Task title field',
        ref: 'title-input',
        text: 'My Test Task'
      });
      
      // Submit form
      await mcp__playwrite-mcp__browser_click({
        element: 'Submit button',
        ref: 'submit-btn'
      });
      
      // Verify task appears in list
      await mcp__playwrite-mcp__browser_wait_for({
        text: 'My Test Task'
      });
    });
    ```

- **Test Granularity:**
  - Write tests at multiple levels of granularity:
    - Unit tests for individual functions/methods
    - Integration tests for component interactions
    - System tests for end-to-end workflows
  - Balance between fine-grained unit tests and broader integration tests
  - Unit tests should validate core business logic with minimal dependencies
  - Integration tests should validate component interfaces and interactions
  - System tests should validate complete workflows and user stories

- **Test-Driven Design Benefits:**
  - Enforces clear understanding of requirements before implementation
  - Results in modular, loosely coupled code
  - Provides confidence when refactoring
  - Creates a safety net for future changes
  - Documents expected behavior through test cases
  - Reduces debugging time by catching issues early
  - Forces consideration of edge cases upfront

- **Implementation Workflow:**
  - Analyze task requirements from task description and testStrategy
  - First create a failing test that validates the desired outcome
  - Run the test to verify it fails (confirms test is valid)
  - Implement the minimal code needed to make test pass
  - Run the test to verify the implementation works
  - Refactor the code to improve structure and maintainability
  - Run tests again to ensure refactoring didn't break functionality
  - Repeat for next feature or requirement

- **Red-Green-Refactor Cycle:**
  - Red: Write a failing test that defines expected behavior
  - Green: Write minimum code to make the test pass
  - Refactor: Improve the code while keeping tests passing
  - This cycle should be kept tight and focused
  - Each cycle should address a single requirement or behavior
  - Don't proceed to next feature until current tests pass

- **E2E Testing with Playwright:**
  - Always use the playwright-mcp server for browser automation
  - Start with defining critical user workflows
  - Write tests that simulate real user behavior
  - Use appropriate selectors for reliable element identification
  - Test both successful paths and error scenarios
  - Include validation for UI state and displayed content
  - Structure tests to match user stories or use cases
  - Available commands:
    - `browser_navigate` - Navigate to a URL
    - `browser_click` - Click elements
    - `browser_type` - Enter text
    - `browser_wait_for` - Wait for content
    - `browser_select_option` - Select from dropdowns
    - `browser_snapshot` - Capture page state

- **Test Data Management:**
  - Create reusable test data factories or fixtures
  - Isolate tests from external systems using mocks when appropriate
  - Clean up test data after test completion
  - Use database transactions to roll back changes when possible
  - Avoid inter-test dependencies that cause flaky tests
  - Consider using dedicated test databases for integration tests

- **Continuous Testing:**
  - Run relevant tests automatically after code changes
  - Configure CI/CD pipeline to run full test suite on each commit
  - Monitor test coverage and maintain high coverage rates
  - Address failing tests immediately before continuing development
  - Use test results to guide development priorities
  - Report test status in documentation and task updates

---
TASK_WORKFLOW
---
description: Guide for using taskmaster-ai MCP server integration for managing test-task-driven development workflows
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **MCP Server Tools**
  - TaskMaster provides a set of MCP tools for Claude 
  - These tools provide direct integration with the TaskMaster system
  - All functionality is available through MCP server tools
  - Main tool categories:
    - Project initialization: `initialize_project`, `parse_prd`, `models`
    - Task viewing: `get_tasks`, `get_task`, `next_task`, `complexity_report`
    - Task management: `set_task_status`, `generate`, `add_task`
    - Task modification: `update`, `update_task`, `update_subtask`, `add_subtask`, `remove_task`, `remove_subtask`
    - Task expansion: `expand_task`, `expand_all`, `analyze_project_complexity`, `clear_subtasks`
    - Dependency handling: `add_dependency`, `remove_dependency`, `validate_dependencies`, `fix_dependencies`
  - All tools accept specific parameters appropriate to their function

- **Global CLI Commands**
  - TaskMaster also provides a global CLI through the `task-master` command
  - All functionality is available through this interface
  - Examples:
    - `task-master list` to list tasks
    - `task-master next` to get the next task
    - `task-master expand --id=3` to expand a task
  - All commands accept the same options as their MCP tool equivalents

- **Development Workflow Process**
  - Start new projects by running `initialize_project` MCP tool or `task-master init` CLI command
  - Generate initial tasks using `parse_prd` MCP tool with your requirements document
  - Begin coding sessions with `get_tasks` to see current tasks, status, and IDs
  - Analyze task complexity with `analyze_project_complexity` before breaking down tasks
  - Select tasks based on dependencies (all marked 'done'), priority level, and ID order
  - View specific task details using `get_task` to understand implementation requirements
  - Break down complex tasks using `expand_task` with appropriate parameters
  - Clear existing subtasks if needed using `clear_subtasks` before regenerating
  - Implement code following task details, dependencies, and project standards
  - Verify tasks according to test strategies before marking as complete
  - Mark completed tasks with `set_task_status`
  - Update dependent tasks when implementation differs from original plan
  - Generate task files with `generate` after updating tasks.json
  - Maintain valid dependency structure with `fix_dependencies` when needed
  - Respect dependency chains and task priorities when selecting work
  - Report progress regularly using the get_tasks tool

- **Task Complexity Analysis**
  - Run `analyze_project_complexity` MCP tool with research=true for comprehensive analysis
  - Review complexity report using `complexity_report` tool
  - Focus on tasks with highest complexity scores (8-10) for detailed breakdown
  - Use analysis results to determine appropriate subtask allocation
  - Note that reports are automatically used by the expand_task tool

- **Task Breakdown Process**
  - For tasks with complexity analysis, use `expand_task`
  - Add research=true parameter to leverage Perplexity AI for research-backed expansion
  - Provide additional context in the prompt parameter when needed
  - Review and adjust generated subtasks as necessary
  - Use `expand_all` to expand multiple pending tasks at once
  - If subtasks need regeneration, clear them first with `clear_subtasks` tool

- **Implementation Drift Handling**
  - When implementation differs significantly from planned approach
  - When future tasks need modification due to current implementation choices
  - When new dependencies or requirements emerge
  - Use `update` tool with fromTaskId and prompt parameters

- **Task Status Management**
  - Use 'pending' for tasks ready to be worked on
  - Use 'done' for completed and verified tasks
  - Use 'deferred' for postponed tasks
  - Add custom status values as needed for project-specific workflows

- **Task File Format Reference**
  ```
  # Task ID: <id>
  # Title: <title>
  # Status: <status>
  # Dependencies: <comma-separated list of dependency IDs>
  # Priority: <priority>
  # Description: <brief description>
  # Details:
  <detailed implementation notes>
  
  # Test Strategy:
  <verification approach>
  ```

- **Task Structure Fields**
  - **id**: Unique identifier for the task (Example: `1`)
  - **title**: Brief, descriptive title (Example: `"Initialize Repo"`)
  - **description**: Concise summary of what the task involves (Example: `"Create a new repository, set up initial structure."`)
  - **status**: Current state of the task (Example: `"pending"`, `"done"`, `"deferred"`)
  - **dependencies**: IDs of prerequisite tasks (Example: `[1, 2]`)
    - Dependencies are displayed with status indicators (✅ for completed, ⏱️ for pending)
    - This helps quickly identify which prerequisite tasks are blocking work
  - **priority**: Importance level (Example: `"high"`, `"medium"`, `"low"`)
  - **details**: In-depth implementation instructions (Example: `"Use GitHub client ID/secret, handle callback, set session token."`)
  - **testStrategy**: Verification approach (Example: `"Deploy and call endpoint to confirm 'Hello World' response."`)
  - **subtasks**: List of smaller, more specific tasks (Example: `[{"id": 1, "title": "Configure OAuth", ...}]`)


- **Determining the Next Task**
  - Use `next_task` MCP tool to show the next task to work on
  - The tool identifies tasks with all dependencies satisfied
  - Tasks are prioritized by priority level, dependency count, and ID
  - The response shows comprehensive task information including:
    - Basic task details and description
    - Implementation details
    - Subtasks (if they exist)
    - Contextual suggested actions
  - Recommended before starting any new development work
  - Respects your project's dependency structure
  - Ensures tasks are completed in the appropriate sequence

- **Viewing Specific Task Details**
  - Use `get_task` MCP tool with the id parameter to view a specific task
  - Use dot notation for subtasks: id=1.2 (shows subtask 2 of task 1)
  - Displays comprehensive information similar to the next_task tool, but for a specific task
  - For parent tasks, shows all subtasks and their current status
  - For subtasks, shows parent task information and relationship
  - Provides contextual information appropriate for the specific task
  - Useful for examining task details before implementation or checking status

- **Managing Task Dependencies**
  - Use `add_dependency` MCP tool to add a dependency
  - Use `remove_dependency` MCP tool to remove a dependency
  - The system prevents circular dependencies and duplicate dependency entries
  - Dependencies are checked for existence before being added or removed
  - Task files are automatically regenerated after dependency changes
  - Dependencies are visualized with status indicators in task listings and files

- **Code Analysis & Refactoring Techniques**
  - **Top-Level Function Search**
    - Use grep pattern matching to find all exported functions across the codebase
    - Command: `grep -E "export (function|const) \w+|function \w+\(|const \w+ = \(|module\.exports" --include="*.js" -r ./`
    - Benefits:
      - Quickly identify all public API functions without reading implementation details
      - Compare functions between files during refactoring (e.g., monolithic to modular structure)
      - Verify all expected functions exist in refactored modules
      - Identify duplicate functionality or naming conflicts
    - Usage examples:
      - When examining MCP tools structure: `grep -E "export function register\w+" mcp-server/src/tools/`
      - Check function exports in a directory: `grep -E "export (function|const)" scripts/modules/`
      - Find potential naming conflicts: `grep -E "function (get|set|create|update)\w+\(" -r ./`
    - Variations:
      - Add `-n` flag to include line numbers
      - Add `--include="*.ts"` to filter by file extension
      - Use with `| sort` to alphabetize results
    - Integration with refactoring workflow:
      - Start by mapping all functions in the source file
      - Create target module files based on function grouping
      - Verify all functions were properly migrated
      - Check for any unintentional duplications or omissions

---
MEMORY_MANAGEMENT
---
description: Guidelines for maintaining persistent memory using mem0-memory-mcp server for project context
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **Required Memory MCP Usage:**
  - ALWAYS use mem0-memory MCP server for persistent memory across sessions
  - $PROJECT_AGENT_NAME is the name of the project folder unless otherwise specified
  - Memory operations include:
    - `add-memory` to store new insights
    - `get-memory` to retrieve specific memories
    - `search-memories` to find relevant memories
    - `update-memory` to modify existing memories
    - `delete-memory` to remove obsolete memories

- **Memory Operation Workflow:**
  - Before starting work: Search existing memories with userId=$PROJECT_AGENT_NAME
  - After significant insights: Store using add-memory with userId=$PROJECT_AGENT_NAME
  - Update memories regularly with project state, active tasks, and key decisions
  - Format memories in structured way for easy retrieval

- **Important Learning Capture:**
  ```mermaid
  flowchart TD
  Start{Discover New Pattern} --> Learn
  subgraph Learn [Learning Process]
  D1[Identify Pattern] --> D2[Validate with User] --> D3[Create IMPORTANT_LEARNING memory]
  end
  Learn --> Apply
  subgraph Apply [Usage]
  A1[Retrieve relevant IMPORTANT_LEARNING memories] --> A2[Apply Learned Patterns] --> A3[Improve Future Work]
  end
  ```

- **Critical Insights to Capture:**
  - Implementation patterns and paths
  - User preferences and workflow
  - Project-specific conventions
  - Known challenges and solutions
  - Decision evolution history
  - Tool usage patterns and best practices

- **Memory Structure Best Practices:**
  - Use consistent tagging for easy retrieval
  - Include specific examples from codebase
  - Categorize memories by type (architecture, workflow, pattern)
  - Cross-reference related memories
  - Include timestamps and context for when insight was gained
  - Focus on actionable patterns over general information

- **Task and Memory Integration:**
  - TaskMaster manages task status, dependencies, and progress
  - Memory system stores insights, patterns, and contextual knowledge
  - Use TaskMaster for all task operations (status changes, dependency updates)
  - Use Memory for storing learned patterns and implementation insights
  - Together they provide complete project context without redundant documentation
  - Tasks reflect current work state; Memory captures accumulated knowledge

---
PROJECT_DOCUMENTATION
---
description: Guidelines for maintaining comprehensive project documentation using memory files
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **Core Documentation Files:**
  - Architecture Document: `/docs/architecture.md` - System architecture with diagrams
  - Product Requirements: `/docs/product_requirement_docs.md` - Core problems and features
  - Technical Documentation: `/docs/technical.md` - Development environment and tech stack
  - Workflow Document: `/docs/workflow.md` - Detailed development workflow (CRITICAL)
  
Note: Current task state and progress are managed through the TaskMaster system and mem0-memory-mcp persistent storage rather than separate documentation files

- **Documentation and Memory Hierarchy:**
  ```mermaid
  flowchart TD
  PB[Product Requirement Document] --> PC[Technical Document]
  PB --> SP[Architecture Document]
  PB --> WF[Workflow Document]
  
  subgraph PM[Persistent Memory]
  LL[IMPORTANT_LEARNING]
  TS[Task Status via MCP]
  ER[Error Documentation]
  end
  
  SP --> PM
  PC --> PM
  PB --> PM
  WF --> PM
  
  PM --> SP
  PM --> PC
  PM --> PB
  
  subgraph LIT[Literature /docs/literature/]
  L1[...]
  L2[...]
  end
  
  PC --o LIT
  ```

- **Documentation Update Workflow:**
  ```mermaid
  flowchart TD
  Start[Update Process]
  subgraph Process
  P1[Review Core Files]
  P4[Update IMPORTANT_LEARNING in Memory]
  P5[Update Architecture Document]
  P1 --> P4 --> P5
  end
  Start --> Process
  ```

- **Documentation Update Triggers:**
  - Discovery of new project patterns
  - After implementing significant changes
  - When user requests with "update memory files"
  - When context needs clarification
  - After significant part of Plan is verified

- **Architectural Documentation:**
  - ALWAYS maintain architecture diagram in mermaid format
  - Create architecture document if one does not exist
  - Ensure diagram includes:
    - Module boundaries and relationships
    - Data flow patterns
    - System interfaces
    - Component dependencies
  - Validate all changes against architectural constraints
  - Ensure new code maintains defined separation of concerns

---
CLAUDE.md
---
description: Guidelines for creating and maintaining CLAUDE.md RULES to ensure consistency and effectiveness.
globs: CLAUDE.md
filesToApplyRule: CLAUDE.md
alwaysApply: true
---
The below describes how you should be structuring new rule sections in this document.
- **Required Rule Structure:**
  ```markdown
  ---
  description: Clear, one-line description of what the rule enforces
  globs: path/to/files/*.ext, other/path/**/*
  alwaysApply: boolean
  ---

  - **Main Points in Bold**
    - Sub-points with details
    - Examples and explanations
  ```

- **Section References:**
  - Use `ALL_CAPS_SECTION` to reference files
  - Example: `CLAUDE.md`

- **Code Examples:**
  - Use language-specific code blocks
  ```typescript
  // ✅ DO: Show good examples
  const goodExample = true;
  
  // ❌ DON'T: Show anti-patterns
  const badExample = false;
  ```

- **Rule Content Guidelines:**
  - Start with high-level overview
  - Include specific, actionable requirements
  - Show examples of correct implementation
  - Reference existing code when possible
  - Keep rules DRY by referencing other rules

- **Rule Maintenance:**
  - Update rules when new patterns emerge
  - Add examples from actual codebase
  - Remove outdated patterns
  - Cross-reference related rules

- **Best Practices:**
  - Use bullet points for clarity
  - Keep descriptions concise
  - Include both DO and DON'T examples
  - Reference actual code over theoretical examples
  - Use consistent formatting across rules 

---
SELF_IMPROVE
---
description: Guidelines for continuously improving this rules document based on emerging code patterns and best practices.
globs: **/*
filesToApplyRule: **/*
alwaysApply: true
---

- **Rule Improvement Triggers:**
  - New code patterns not covered by existing rules
  - Repeated similar implementations across files
  - Common error patterns that could be prevented
  - New libraries or tools being used consistently
  - Emerging best practices in the codebase

- **Analysis Process:**
  - Compare new code with existing rules
  - Identify patterns that should be standardized
  - Look for references to external documentation
  - Check for consistent error handling patterns
  - Monitor test patterns and coverage

- **Rule Updates:**
  - **Add New Rules When:**
    - A new technology/pattern is used in 3+ files
    - Common bugs could be prevented by a rule
    - Code reviews repeatedly mention the same feedback
    - New security or performance patterns emerge

  - **Modify Existing Rules When:**
    - Better examples exist in the codebase
    - Additional edge cases are discovered
    - Related rules have been updated
    - Implementation details have changed

- **Example Pattern Recognition:**
  ```typescript
  // If you see repeated patterns like:
  const data = await prisma.user.findMany({
    select: { id: true, email: true },
    where: { status: 'ACTIVE' }
  });
  
  // Consider adding a PRISMA section in the CLAUDE.md file:
  // - Standard select fields
  // - Common where conditions
  // - Performance optimization patterns
  ```

- **Rule Quality Checks:**
  - Rules should be actionable and specific
  - Examples should come from actual code
  - References should be up to date
  - Patterns should be consistently enforced

- **Continuous Improvement:**
  - Monitor code review comments
  - Track common development questions
  - Update rules after major refactors
  - Add links to relevant documentation
  - Cross-reference related rules

- **Rule Deprecation:**
  - Mark outdated patterns as deprecated
  - Remove rules that no longer apply
  - Update references to deprecated rules
  - Document migration paths for old patterns

- **Documentation Updates:**
  - Keep examples synchronized with code
  - Update references to external docs
  - Maintain links between related rules
  - Document breaking changes

</RULES>