/**
 * CLI App
 * Main CLI application that wires up all dependencies and commands
 */
import { Command } from 'commander';
import { JsonDatabase, FileSystemTaskRepository } from '../../infrastructure/persistence';
import { Logger } from './utils/Logger';
import {
  CreateCommand,
  ListCommand,
  UpdateCommand,
  DeleteCommand,
  SearchCommand,
  StatsCommand,
  ExportCommand,
} from './commands';

export class App {
  private program: Command;
  private database: JsonDatabase;
  private repository: FileSystemTaskRepository;

  constructor() {
    this.program = new Command();
    this.database = new JsonDatabase();
    this.repository = new FileSystemTaskRepository(this.database);
  }

  /**
   * Initialize the app
   */
  async initialize(): Promise<void> {
    try {
      await this.repository.initialize();
      Logger.debug('Repository initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize repository');
      throw error;
    }
  }

  /**
   * Configure the CLI program
   */
  private configureCLI(): void {
    this.program
      .name('task-cli')
      .description('A powerful task management CLI application')
      .version('1.0.0')
      .helpOption('-h, --help', 'display help for command');

    // Add global options
    this.program.option('-d, --debug', 'Enable debug output');

    // Wire up all commands
    this.program.addCommand(CreateCommand.create(this.repository));
    this.program.addCommand(ListCommand.create(this.repository));
    this.program.addCommand(UpdateCommand.create(this.repository));
    this.program.addCommand(DeleteCommand.create(this.repository));
    this.program.addCommand(SearchCommand.create(this.repository));
    this.program.addCommand(StatsCommand.create(this.repository));
    this.program.addCommand(ExportCommand.create(this.repository));

    // Add help command
    this.program.addCommand(
      this.program.createCommand('help')
        .description('Show help information')
        .action(() => {
          this.program.outputHelp();
        }),
    );
  }

  /**
   * Run the CLI app
   */
  async run(args?: string[]): Promise<void> {
    try {
      this.configureCLI();
      await this.program.parseAsync(args || process.argv);
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message);
      } else {
        Logger.error('An unknown error occurred');
      }
      process.exit(1);
    }
  }
}
