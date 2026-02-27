/**
 * Logger
 * Provides colored console output for CLI operations
 */
import chalk from 'chalk';

export class Logger {
  /**
   * Log an info message (blue)
   */
  static info(message: string): void {
    console.log(chalk.blue(`ℹ  ${message}`));
  }

  /**
   * Log a success message (green)
   */
  static success(message: string): void {
    console.log(chalk.green(`✓ ${message}`));
  }

  /**
   * Log a warning message (yellow)
   */
  static warning(message: string): void {
    console.log(chalk.yellow(`⚠ ${message}`));
  }

  /**
   * Log an error message (red)
   */
  static error(message: string): void {
    console.error(chalk.red(`✗ ${message}`));
  }

  /**
   * Log a debug message (gray) - only shown if DEBUG=true
   */
  static debug(message: string): void {
    if (process.env['DEBUG'] === 'true') {
      console.log(chalk.gray(`► ${message}`));
    }
  }

  /**
   * Log a generic message without formatting
   */
  static log(message: string): void {
    console.log(message);
  }

  /**
   * Print an empty line
   */
  static empty(): void {
    console.log();
  }

  /**
   * Print a section header
   */
  static section(title: string): void {
    console.log();
    console.log(chalk.bold.cyan(`━━━ ${title} ━━━`));
    console.log();
  }
}
