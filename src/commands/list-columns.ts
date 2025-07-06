import { Command } from 'commander';
import * as ColumnActions from 'knbn-core/actions/column';
import { ensureBoardFile } from '../utils/board';

export const attachListColumns = (program: Command) =>
  program
    .command('list-columns')
    .description('List all columns in the board')
    .option('-f, --file <path>', 'Specify a board file to use')
    .option('--count', 'Show task count for each column', false)
    .option('--skip-prompt', 'Skip prompts for board creation', false)
    .action(async (options: {
      file?: string;
      count?: boolean;
      skipPrompt?: boolean;
    }) => {
      const boardFile = await ensureBoardFile(options.file, options.skipPrompt);

      try {
        const columns = ColumnActions.listColumns(boardFile);

        if (columns.length === 0) {
          console.log('No columns found.');
          return;
        }

        console.log(`Found ${columns.length} column(s):\n`);

        columns.forEach((column, index) => {
          console.log(`${index + 1}. ${column.name}`);
          
          if (options.count) {
            const taskCount = ColumnActions.getColumnTaskCount(boardFile, column.name);
            console.log(`   Tasks: ${taskCount}`);
          }
          
          console.log('');
        });

        // count tasks without a column
        if (options.count) {
          // @ts-ignore
          const unassignedTasks = ColumnActions.getTasksInColumn(boardFile, undefined);
          console.log(`Backlog: ${unassignedTasks.length}`);
        }

      } catch (error) {
        console.error(`Failed to list columns: ${error}`);
        process.exit(1);
      }
    });