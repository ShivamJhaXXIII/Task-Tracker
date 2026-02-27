/**
 * StatsCommand
 * Command to show task statistics
 */
import { Command } from 'commander';
import {
  GetStatisticsUseCase,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';
import { Formatter } from '../utils/Formatter';

export class StatsCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new GetStatisticsUseCase(repository);

    return new Command('stats')
      .alias('statistics')
      .description('Show task statistics')
      .action(async () => {
        try {
          const stats = await useCase.execute();
          Logger.empty();
          Logger.log(Formatter.formatStatistics(stats));
          Logger.empty();
        } catch (error) {
          Logger.error('Failed to calculate statistics');
          throw error;
        }
      });
  }
}
