import { Command } from 'commander';
import { promptForBoardCreation } from '../utils/board';
import { extractFilenameFromPath, getFilepathForBoardFile, pcwd } from 'knbn-core/utils/files';
import { findBoardFiles } from 'knbn-core/actions/board';
import { loadBoard, loadBoardFields } from 'knbn-core/utils/board-files';

export const attachGetBoard = (program: Command) =>
  program
    .command('get-board [filename]')
    .description('Get board file')
    .option('--skip-prompt', 'Skip prompts for board creation')
    .action(async (name, options: {
      skipPrompt?: boolean;
    }) => {
      const filename = name || '.knbn';
      const filepath = getFilepathForBoardFile(filename);
      const board = loadBoard(filepath);
      console.log(`${filename}:`);
      console.log(`Name: ${board.name}`);
      if (board.description) {
        console.log(`Description: ${board.description}`);
      }
      console.log(`Columns: ${board.columns.map(c => c.name).join(', ')}`);
      console.log(`Tasks: ${Object.values(board.tasks).length}`);
      console.log(`Labels: ${board.labels?.map(l => l.name).join(', ') ?? 'none'}`);
      console.log(`Sprints: ${board.sprints?.map(s => s.name).join(', ') ?? 'none'}`);
      console.log(`Board version: ${board.metadata.version}`);
      console.log(`Created At: ${board.dates.created}`);
      console.log(`Last Updated: ${board.dates.updated}`);
    });
