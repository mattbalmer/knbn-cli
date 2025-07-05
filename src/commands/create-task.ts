import { Command } from 'commander';
import * as TaskActions from 'knbn-core/actions/task';
import { ensureBoardFile } from '../utils/board';

export const attachCreateTask = (program: Command) =>
  program
    .command('create-task <title>')
    .description('Create a new task')
    .option('-f, --file <path>', 'Specify a board file to use')
    .option('--column <column>', 'Provide the task column')
    .option('--description <text>', 'Provide the task description')
    .option('--priority <number>', 'Provide the task priority')
    .option('--skip-prompt', 'Skip prompts for board creation', false)
    .action(async (title, options: {
      file?: string;
      column?: string;
      description?: string;
      priority?: string;
      skipPrompt?: boolean;
    }) => {
      const boardFile = await ensureBoardFile(options.file, options.skipPrompt);

      try {
        const extras = {
          column: options.column,
          description: options.description,
          priority: options.priority ? parseInt(options.priority, 10) : undefined,
        };

        const { task } = TaskActions.createTask(boardFile, {
          title,
          ...extras,
        });

        if (task) {
          console.log(`Created task #${task.id}: ${task.title}`);
          console.log(`Column: ${task.column}`);
        }
      } catch (error) {
        console.error(`Failed to create task: ${error}`);
        process.exit(1);
      }
    });