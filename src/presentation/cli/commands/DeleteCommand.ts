/**
 * DeleteCommand
 * Command to delete a task
 */
import { Command } from 'commander';
import {
  DeleteTaskUseCase,
  ApplicationError,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class DeleteCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new DeleteTaskUseCase(repository);

    return new Command('delete')
      .alias('rm')
      .description('Delete a task')
      .argument('<id>', 'Task ID')
      .addHelpText(
        'after',
        '\nExamples:\n  $ task-cli delete <id>\n  $ task-cli rm <id>',
      )
      .action(async (id: string) => {
        try {
          // In a real CLI, we might prompt for confirmation here
          // For now, we'll just delete
          await useCase.execute(id);
          Logger.success(`Task ${id} deleted successfully`);
        } catch (error) {
          if (
            error instanceof ApplicationError
          ) {
            Formatter.formatError(
              'Failed to delete task',
              error.message,
              'Check that the task ID exists',
            );
            process.exit(1);
          }
          throw error;
        }
      });
  }
}
