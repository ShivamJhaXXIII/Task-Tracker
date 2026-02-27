/**
 * CreateCommand
 * Command to create a new task
 */
import { Command, Option } from 'commander';
import {
  CreateTaskUseCase,
  CreateTaskDTO,
  ApplicationError,
  type TaskResponseDTO,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class CreateCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new CreateTaskUseCase(repository);

    return new Command('create')
      .alias('add')
      .description('Create a new task')
      .argument('<description>', 'Task description')
      .addOption(
        new Option('-p, --priority <priority>', 'Task priority')
          .choices(['low', 'medium', 'high'])
          .default('medium'),
      )
      .option(
        '-d, --due <date>',
        'Due date (YYYY-MM-DD format)',
      )
      .option(
        '-t, --tags <tags>',
        'Comma-separated tags (e.g., work,urgent)',
      )
      .addHelpText(
        'after',
        '\nExamples:\n  $ task-cli add "Prepare sprint demo" --priority high --tags work,demo\n  $ task-cli create "Buy groceries" --due 2026-03-15',
      )
      .action(
        async (
          description: string,
          options: { priority: string; due?: string; tags?: string },
        ) => {
          try {
            const dto: CreateTaskDTO = {
              description,
              priority: options.priority as 'low' | 'medium' | 'high',
              dueDate: options.due ? new Date(options.due) : undefined,
              tags: options.tags
                ? options.tags.split(',').map((t) => t.trim())
                : undefined,
            };

            const task: TaskResponseDTO = await useCase.execute(dto);
            Logger.success(`Task created with ID: ${task.id}`);
            Logger.empty();
            Logger.log(Formatter.formatTask(task));
          } catch (error) {
            if (error instanceof ApplicationError) {
              Formatter.formatError(
                'Failed to create task',
                error.message,
                'Check that all inputs are valid',
              );
              process.exit(1);
            }
            throw error;
          }
        },
      );
  }
}
