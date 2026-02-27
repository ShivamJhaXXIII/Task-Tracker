/**
 * ExportCommand
 * Command to export tasks to different formats
 */
import { Command, Option } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {
  ExportTasksUseCase,
  type ExportFormat,
  type ExportOptions,
} from '../../../application';
import { ITaskRepository } from '../../../domain';
import { Logger } from '../utils/Logger';

export class ExportCommand {
  static create(repository: ITaskRepository): Command {
    const useCase = new ExportTasksUseCase(repository);

    return new Command('export')
      .description('Export tasks to a file')
      .addOption(
        new Option('-f, --format <format>', 'Export format')
          .choices(['json', 'csv'])
          .default('json'),
      )
      .option(
        '-o, --output <filepath>',
        'Output file path (defaults to tasks-{timestamp}.{format})',
      )
      .option(
        '--pretty',
        'Pretty print JSON output',
      )
      .action(
        async (options: {
          format: string;
          output?: string;
          pretty?: boolean;
        }) => {
          try {
            const exportOptions: ExportOptions = {
              format: options.format as ExportFormat,
              prettyPrint: options.pretty ?? true,
            };

            const data = await useCase.execute(exportOptions);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename =
              options.output || `tasks-${timestamp}.${options.format}`;
            const filepath = path.resolve(filename);

            fs.writeFileSync(filepath, data);
            Logger.success(
              `Tasks exported to ${filepath}`,
            );
            Logger.info(`Format: ${options.format}`);
            Logger.info(`Size: ${data.length} bytes`);
          } catch (error) {
            Logger.error('Failed to export tasks');
            throw error;
          }
        },
      );
  }
}
