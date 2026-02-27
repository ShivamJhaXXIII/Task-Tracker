/**
 * SearchCommand
 * Command to search for tasks with filtering and sorting
 */
import { Command, Option } from 'commander';
import {
  SearchTasksUseCase,
  type SearchCriteria,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class SearchCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new SearchTasksUseCase(repository);

    return new Command('search')
      .description('Search for tasks with filters')
      .argument('[query]', 'Keyword to search for')
      .addOption(
        new Option('-s, --status <status>', 'Filter by status')
          .choices(['todo', 'in-progress', 'done']),
      )
      .addOption(
        new Option('-p, --priority <priority>', 'Filter by priority')
          .choices(['low', 'medium', 'high']),
      )
      .option(
        '-t, --tags <tags>',
        'Filter by comma-separated tags',
      )
      .option(
        '--overdue',
        'Only show overdue tasks',
      )
      .option(
        '--done',
        'Only show done tasks',
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
        async (
          query: string | undefined,
          options: {
            status?: string;
            priority?: string;
            tags?: string;
            overdue?: boolean;
            done?: boolean;
            sort: string;
            order: string;
          },
        ) => {
          try {
            const criteria: SearchCriteria = {
              keyword: query,
              status: options.status as any,
              priority: options.priority as any,
              tags: options.tags
                ? options.tags.split(',').map((t) => t.trim())
                : undefined,
              isOverdue: options.overdue,
              isDone: options.done,
              sortBy: options.sort as any,
              sortOrder: options.order as any,
            };

            const results = await useCase.execute(criteria);

            if (results.length === 0) {
              Logger.info('No tasks found matching the criteria');
              return;
            }

            Logger.section(`Search Results (${results.length})`);
            Logger.log(Formatter.formatTaskTable(results));
          } catch (error) {
            Logger.error('Search failed');
            throw error;
          }
        },
      );
  }
}
