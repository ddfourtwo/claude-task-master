import { z } from 'zod';
import {
	createErrorResponse,
	handleApiResult,
	withNormalizedProjectRoot
} from './utils.js';
import { initializeProjectDirect } from '../core/task-master-core.js';

export function registerInitializeProjectTool(server) {
	server.addTool({
		name: 'initialize_project',
		description:
			'Initializes a new Task Master project structure by calling the core initialization logic. Creates necessary folders and configuration files for Task Master in the current directory.',
		parameters: z.object({
			skipInstall: z
				.boolean()
				.optional()
				.default(false)
				.describe(
					'Skip installing dependencies automatically. Never do this unless you are sure the project is already installed.'
				),
			addAliases: z
				.boolean()
				.optional()
				.default(false)
				.describe('Add shell aliases (tm, taskmaster) to shell config file.'),
			yes: z
				.boolean()
				.optional()
				.default(true)
				.describe(
					'Skip prompts and use default values. Always set to true for MCP tools.'
				),
			claudeCodeMode: z
				.boolean()
				.optional()
				.default(false)
				.describe(
					'Enable Claude Code mode for the project, which sets up Claude Code specific configurations.'
				),
			projectRoot: z
				.string()
				.describe(
					'The root directory for the project. ALWAYS SET THIS TO THE PROJECT ROOT DIRECTORY. IF NOT SET, THE TOOL WILL NOT WORK.'
				)
		}),
		execute: withNormalizedProjectRoot(async (args, context) => {
			const { log } = context;
			const session = context.session;

			try {
				// Log current environment settings and args
				log.info(`Environment CLAUDE_CODE_MODE: ${process.env.CLAUDE_CODE_MODE}`);
				log.info(`Received args.claudeCodeMode: ${args.claudeCodeMode}`);
				log.info(`process.argv: ${JSON.stringify(process.argv)}`);
				
				// If claudeCodeMode is explicitly set in args, make sure it's properly propagated
				if (args.claudeCodeMode === true) {
					log.info('Explicit claudeCodeMode=true detected in args, will be passed to direct function');
				}
				
				// Log full args for debugging
				log.info(
					`Executing initialize_project tool with args: ${JSON.stringify(args)}`
				);

				const result = await initializeProjectDirect(args, log, { session });

				return handleApiResult(result, log, 'Initialization failed');
			} catch (error) {
				const errorMessage = `Project initialization tool failed: ${error.message || 'Unknown error'}`;
				log.error(errorMessage, error);
				return createErrorResponse(errorMessage, { details: error.stack });
			}
		})
	});
}