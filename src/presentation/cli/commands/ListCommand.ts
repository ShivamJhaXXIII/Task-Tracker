/**
 * ListCommand
 * Command to list all tasks
 */
import { Command, Option } from 'commander';
import {
  ListTasksUseCase,
  type TaskResponseDTO,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class ListCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new ListTasksUseCase(repository);

    return new Command('list')
      .alias('ls')
      .description('List all tasks')
      .addOption(
        new Option('-s, --status <status>', 'Filter by status')
          .choices(['todo', 'in-progress', 'done']),
      )
      .addOption(
        new Option('-p, --priority <priority>', 'Filter by priority')
          .choices(['low', 'medium', 'high']),
      )
      .addOption(
        new Option('--sort <field>', 'Sort field')
          .choices(['priority', 'dueDate', 'createdAt', 'updatedAt', 'description'])
          .default('createdAt'),
      )
      .addOption(
        new Option('--order <order>', 'Sort order')
          .choices(['asc', 'desc'])
          .default('asc'),
      )
      .action(
        async (options: {
          status?: string;
          priority?: string;
          sort: string;
          order: string;
        }) => {
          try {
            let tasks: TaskResponseDTO[] = await useCase.execute();

            // Filter by status
            if (options.status) {
              tasks = tasks.filter((t) => t.status === options.status);
            }

            // Filter by priority
            if (options.priority) {
              tasks = tasks.filter((t) => t.priority === options.priority);
            }

            // Sort
            tasks.sort((a, b) => {
              const field = options.sort as keyof TaskResponseDTO;
              const aVal = a[field];
              const bVal = b[field];

              let comparison = 0;
              if (aVal === undefined || aVal === null) {
                comparison = 1;
              } else if (bVal === undefined || bVal === null) {
                comparison = -1;
              } else if (typeof aVal === 'string' && typeof bVal === 'string') {
                comparison = aVal.localeCompare(bVal);
              } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
              } else if (aVal instanceof Date && bVal instanceof Date) {
                comparison = aVal.getTime() - bVal.getTime();
              }

              return options.order === 'desc' ? -comparison : comparison;
            });

            if (tasks.length === 0) {
              Logger.info('No tasks found');
              return;
            }

            Logger.section(`Tasks (${tasks.length})`);
            Logger.log(Formatter.formatTaskTable(tasks));
          } catch (error) {
            Logger.error('Failed to list tasks');
            throw error;
          }
        },
      );
  }
}
