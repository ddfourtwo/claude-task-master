import { initializeProject } from '../../../../scripts/init.js'; // Import core function and its logger if needed separately
import {
	enableSilentMode,
	disableSilentMode
	// isSilentMode // Not used directly here
} from '../../../../scripts/modules/utils.js';
import os from 'os'; // Import os module for home directory check

/**
 * Direct function wrapper for initializing a project.
 * Derives target directory from session, sets CWD, and calls core init logic.
 * @param {object} args - Arguments containing initialization options (addAliases, skipInstall, yes, projectRoot)
 * @param {object} log - The FastMCP logger instance.
 * @param {object} context - The context object, must contain { session }.
 * @returns {Promise<{success: boolean, data?: any, error?: {code: string, message: string}}>} - Standard result object.
 */
export async function initializeProjectDirect(args, log, context = {}) {
	const { session } = context; // Keep session if core logic needs it
	const homeDir = os.homedir();

	log.info(`Args received in direct function: ${JSON.stringify(args)}`);

	// --- Determine Target Directory ---
	// TRUST the projectRoot passed from the tool layer via args
	// The HOF in the tool layer already normalized and validated it came from a reliable source (args or session)
	const targetDirectory = args.projectRoot;

	// --- Validate the targetDirectory (basic sanity checks) ---
	if (
		!targetDirectory ||
		typeof targetDirectory !== 'string' || // Ensure it's a string
		targetDirectory === '/' ||
		targetDirectory === homeDir
	) {
		log.error(
			`Invalid target directory received from tool layer: '${targetDirectory}'`
		);
		return {
			success: false,
			error: {
				code: 'INVALID_TARGET_DIRECTORY',
				message: `Cannot initialize project: Invalid target directory '${targetDirectory}' received. Please ensure a valid workspace/folder is open or specified.`,
				details: `Received args.projectRoot: ${args.projectRoot}` // Show what was received
			},
			fromCache: false
		};
	}

	// --- Proceed with validated targetDirectory ---
	log.info(`Validated target directory for initialization: ${targetDirectory}`);

	const originalCwd = process.cwd();
	let resultData;
	let success = false;
	let errorResult = null;

	log.info(
		`Temporarily changing CWD to ${targetDirectory} for initialization.`
	);
	process.chdir(targetDirectory); // Change CWD to the HOF-provided root

	enableSilentMode();
	try {
		// First check for command-line args in the MCP server invoke command
		// Look for --claude-code-mode in args array or from args.claudeCodeMode
		const hasClaudeCodeFlagInArgs = args.claudeCodeMode === true;
		const hasClaudeCodeFlagInArgv = process.argv && process.argv.some(arg => 
			arg === '--claude-code-mode' || arg === '--claude-code'
		);
		
		// Also check environment variable as fallback
		const envClaudeCodeMode = process.env.CLAUDE_CODE_MODE === 'true';
		
		// Use flag if present, otherwise use env var
		const isClaudeCodeMode = hasClaudeCodeFlagInArgs || hasClaudeCodeFlagInArgv || envClaudeCodeMode;
		
		log.info(`Reading Claude Code Mode:
		- From args.claudeCodeMode: ${hasClaudeCodeFlagInArgs}
		- From command-line flag: ${hasClaudeCodeFlagInArgv}
		- From environment variable: ${envClaudeCodeMode}
		- Final decision: ${isClaudeCodeMode}
		- process.argv: ${JSON.stringify(process.argv)}`);
		
		// Set environment variable for any subprocess that might be spawned
		if (isClaudeCodeMode) {
			process.env.CLAUDE_CODE_MODE = 'true';
			log.info('Setting process.env.CLAUDE_CODE_MODE = true for initialization');
		}

		// Construct options ONLY from the relevant flags in args
		// The core initializeProject operates in the current CWD, which we just set
		const options = {
			aliases: args.addAliases,
			skipInstall: args.skipInstall,
			yes: true, // Force yes mode
			invocationCwd: targetDirectory,
			// Pass through the Claude Code mode setting
			claudeCodeMode: isClaudeCodeMode
		};

		log.info(`Initializing project with options: ${JSON.stringify(options)}`);
		
		// Set environment variable based on the detected value 
		if (isClaudeCodeMode) {
			process.env.CLAUDE_CODE_MODE = 'true';
			log.info(`Set process.env.CLAUDE_CODE_MODE = 'true' for initialization`);
		}
		
		const result = await initializeProject(options); // Call core logic

		resultData = {
			message: 'Project initialized successfully.',
			claude_code_mode: isClaudeCodeMode, // Reflect actual mode
			next_step:
				'Now that the project is initialized, the next step is to create the tasks by parsing a PRD. This will create the tasks folder and the initial task files (tasks folder will be created when parse-prd is run). The parse-prd tool will require a prd.md file as input (typically found in the project root directory). You can create a prd.md file by asking the user about their idea, and then using the example_prd.md file as a template to genrate a prd.md file. You may skip all of this if the user already has a prd.md file. You can THEN use the parse-prd tool to create the tasks. So: step 1 after initialization is to create a prd.md file in prd.md or confirm the user already has one. Step 2 is to use the parse-prd tool to create the tasks. Do not bother looking for tasks after initialization, just use the parse-prd tool to create the tasks after creating a prd.md from which to parse the tasks. You do NOT need to reinitialize the project to parse-prd.',
			...result
		};
		success = true;
		log.info(
			`Project initialization completed successfully in ${targetDirectory}.`
		);
	} catch (error) {
		log.error(`Core initializeProject failed: ${error.message}`);
		errorResult = {
			code: 'INITIALIZATION_FAILED',
			message: `Core project initialization failed: ${error.message}`,
			details: error.stack
		};
		success = false;
	} finally {
		disableSilentMode();
		log.info(`Restoring original CWD: ${originalCwd}`);
		process.chdir(originalCwd);
	}

	if (success) {
		return { success: true, data: resultData, fromCache: false };
	} else {
		return { success: false, error: errorResult, fromCache: false };
	}
}