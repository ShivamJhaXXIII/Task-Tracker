/**
 * Formatter
 * Provides formatted output for tasks in CLI
 */
import chalk from 'chalk';
import Table from 'cli-table3';
import { TaskResponseDTO, type TaskStatistics } from '../../../application';
import { Logger } from './Logger';

export class Formatter {
  /**
   * Format a single task for display
   */
  static formatTask(task: TaskResponseDTO): string {
    const lines: string[] = [];

    lines.push(chalk.bold(`Task: ${task.description}`));
    lines.push(`  ${chalk.gray('ID:')} ${task.id}`);
    lines.push(`  ${chalk.gray('Status:')} ${this.formatStatus(task.status)}`);
    lines.push(`  ${chalk.gray('Priority:')} ${this.formatPriority(task.priority)}`);

    if (task.dueDate) {
      const dueDateStr = new Date(task.dueDate).toLocaleDateString();
      const dueStatus = task.isOverdue ? chalk.red('(OVERDUE)') : chalk.green('(upcoming)');
      lines.push(`  ${chalk.gray('Due Date:')} ${dueDateStr} ${dueStatus}`);
    }

    if (task.tags && task.tags.length > 0) {
      const tagsStr = task.tags.map((tag) => chalk.cyan(`#${tag}`)).join(' ');
      lines.push(`  ${chalk.gray('Tags:')} ${tagsStr}`);
    }

    lines.push(`  ${chalk.gray('Created:')} ${new Date(task.createdAt).toLocaleDateString()}`);
    lines.push(`  ${chalk.gray('Updated:')} ${new Date(task.updatedAt).toLocaleDateString()}`);

    return lines.join('\n');
  }

  /**
   * Format multiple tasks as a table
   */
  static formatTaskTable(tasks: TaskResponseDTO[]): string {
    const table = new Table({
      head: [
        chalk.bold.cyan('Description'),
        chalk.bold.cyan('Status'),
        chalk.bold.cyan('Priority'),
        chalk.bold.cyan('Due Date'),
        chalk.bold.cyan('Tags'),
      ],
      style: {
        head: [],
        border: ['cyan'],
        compact: false,
      },
      wordWrap: true,
      colWidths: [30, 15, 12, 15, 20],
    });

    for (const task of tasks) {
      table.push([
        this.truncate(task.description, 28),
        this.formatStatus(task.status),
        this.formatPriority(task.priority),
        this.formatDueDate(task),
        this.formatTags(task.tags),
      ]);
    }

    return table.toString();
  }

  /**
   * Format task status with color
   */
  private static formatStatus(status: string): string {
    switch (status) {
      case 'done':
        return chalk.green('✓ Done');
      case 'in-progress':
        return chalk.yellow('→ In Progress');
      case 'todo':
        return chalk.gray('○ To Do');
      default:
        return status;
    }
  }

  /**
   * Format task priority with color
   */
  private static formatPriority(priority: string): string {
    switch (priority) {
      case 'high':
        return chalk.red('⬆ High');
      case 'medium':
        return chalk.yellow('→ Medium');
      case 'low':
        return chalk.green('⬇ Low');
      default:
        return priority;
    }
  }

  /**
   * Format due date
   */
  private static formatDueDate(task: TaskResponseDTO): string {
    if (!task.dueDate) {
      return chalk.gray('—');
    }

    const date = new Date(task.dueDate);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (task.isOverdue) {
      return chalk.red(`${dateStr} ⚠`);
    }

    return dateStr;
  }

  /**
   * Format tags
   */
  private static formatTags(tags?: string[]): string {
    if (!tags || tags.length === 0) {
      return chalk.gray('—');
    }

    return tags.map((tag) => chalk.cyan(`#${tag}`)).join(' ');
  }

  /**
   * Truncate text to a maximum length
   */
  private static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Format statistics for display
   */
  static formatStatistics(stats: TaskStatistics): string {
    const lines: string[] = [];

    lines.push(chalk.bold.cyan('📊 Task Statistics'));
    lines.push('');

    lines.push(chalk.bold('Overview:'));
    lines.push(`  ${chalk.gray('Total Tasks:')} ${chalk.yellow(stats.totalTasks)}`);
    lines.push(
      `  ${chalk.gray('Completion Rate:')} ${chalk.green(stats.completionPercentage.toFixed(1))}%`
    );
    lines.push('');

    lines.push(chalk.bold('By Status:'));
    lines.push(`  ${chalk.gray('To Do:')} ${chalk.gray(stats.byStatus.todo ?? 0)}`);
    lines.push(`  ${chalk.gray('In Progress:')} ${chalk.yellow(stats.byStatus.inProgress ?? 0)}`);
    lines.push(`  ${chalk.gray('Done:')} ${chalk.green(stats.byStatus.done ?? 0)}`);
    lines.push('');

    lines.push(chalk.bold('By Priority:'));
    lines.push(`  ${chalk.gray('High:')} ${chalk.red(stats.byPriority.high ?? 0)}`);
    lines.push(`  ${chalk.gray('Medium:')} ${chalk.yellow(stats.byPriority.medium ?? 0)}`);
    lines.push(`  ${chalk.gray('Low:')} ${chalk.green(stats.byPriority.low ?? 0)}`);
    lines.push('');

    lines.push(chalk.bold('Due Dates:'));
    lines.push(`  ${chalk.gray('With Due Date:')} ${stats.tasksWithDueDate}`);
    lines.push(`  ${chalk.gray('No Due Date:')} ${stats.tasksWithoutDueDate}`);
    lines.push(`  ${chalk.gray('Overdue:')} ${chalk.red(stats.overdueTasks)}`);
    lines.push('');

    if (stats.tagCounts && Object.keys(stats.tagCounts).length > 0) {
      lines.push(chalk.bold('Top Tags:'));
      const topTags = Object.entries(stats.tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => `  ${chalk.cyan(`#${tag}`)} (${count})`);
      lines.push(...topTags);
    }

    return lines.join('\n');
  }

  /**
   * Format error message with context
   */
  static formatError(title: string, message: string, hint?: string): void {
    Logger.error(title);
    Logger.log(`  ${message}`);
    if (hint) {
      Logger.info(`  Hint: ${hint}`);
    }
  }
}
