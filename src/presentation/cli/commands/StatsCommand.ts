/**
 * StatsCommand
 * Command to show task statistics
 */
import { Command } from 'commander';
import { GetStatisticsUseCase } from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class StatsCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new GetStatisticsUseCase(repository);

    return new Command('stats')
      .alias('statistics')
      .description('Show task statistics')
      .addHelpText('after', '\nExamples:\n  $ task-cli stats\n  $ task-cli statistics')
      .action(async () => {
        try {
          const stats = await useCase.execute();
          Logger.empty();
          Logger.log(Formatter.formatStatistics(stats));
          Logger.empty();
        } catch (error) {
          Formatter.formatError(
            'Failed to calculate statistics',
            error instanceof Error ? error.message : 'Unknown error',
            'Make sure your task store is initialized and readable'
          );
          throw error;
        }
      });
  }
}
