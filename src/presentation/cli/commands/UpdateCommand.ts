/**
 * UpdateCommand
 * Command to update a task
 */
import { Command, Option } from 'commander';
import {
  UpdateTaskUseCase,
  UpdateTaskDTO,
  ApplicationError,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class UpdateCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new UpdateTaskUseCase(repository);

    return new Command('update')
      .alias('edit')
      .description('Update a task')
      .argument('<id>', 'Task ID')
      .option(
        '--description <description>',
        'New task description',
      )
      .addOption(
        new Option('--status <status>', 'New status')
          .choices(['todo', 'in-progress', 'done']),
      )
      .addOption(
        new Option('--priority <priority>', 'New priority')
          .choices(['low', 'medium', 'high']),
      )
      .option(
        '--due <date>',
        'New due date (YYYY-MM-DD format or empty to remove)',
      )
      .option(
        '--tags <tags>',
        'New comma-separated tags (or empty to remove)',
      )
      .addHelpText(
        'after',
        '\nExamples:\n  $ task-cli update <id> --status in-progress\n  $ task-cli edit <id> --priority high --tags work,urgent\n  $ task-cli update <id> --description "Updated task title"',
      )
      .action(
        async (
          id: string,
          options: {
            description?: string;
            status?: string;
            priority?: string;
            due?: string;
            tags?: string;
          },
        ) => {
          try {
            const dto: UpdateTaskDTO = {
              id,
              description: options.description,
              status: options.status as any,
              priority: options.priority as any,
              dueDate: options.due
                ? options.due === ''
                  ? null
                  : new Date(options.due)
                : undefined,
              tags: options.tags
                ? options.tags === ''
                  ? []
                  : options.tags.split(',').map((t) => t.trim())
                : undefined,
            };

            const task = await useCase.execute(dto);
            Logger.success('Task updated successfully');
            Logger.empty();
            Logger.log(Formatter.formatTask(task));
          } catch (error) {
            if (
              error instanceof ApplicationError
            ) {
              Formatter.formatError(
                'Failed to update task',
                error.message,
                'Check that the task ID exists and inputs are valid',
              );
              process.exit(1);
            }
            throw error;
          }
        },
      );
  }
}
