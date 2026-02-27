import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';

/**
 * Task Statistics DTO
 * Contains calculated statistics about tasks
 */
export interface TaskStatistics {
  /**
   * Total number of tasks
   */
  totalTasks: number;

  /**
   * Count of tasks by status
   */
  byStatus: {
    todo: number;
    inProgress: number;
    done: number;
  };

  /**
   * Count of tasks by priority
   */
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };

  /**
   * Number of completed tasks
   */
  completedTasks: number;

  /**
   * Number of overdue tasks
   */
  overdueTasks: number;

  /**
   * Completion percentage (0-100)
   */
  completionPercentage: number;

  /**
   * All unique tags used across tasks
   */
  allTags: string[];

  /**
   * Count of tasks by tag
   */
  tagCounts: Record<string, number>;

  /**
   * Average number of tags per task
   */
  averageTagsPerTask: number;

  /**
   * Count of tasks with due dates
   */
  tasksWithDueDate: number;

  /**
   * Count of tasks without due dates
   */
  tasksWithoutDueDate: number;
}

/**
 * Get Statistics Use Case
 * Calculates and returns various statistics about all tasks
 */
export class GetStatisticsUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to get task statistics
   * @returns Promise resolving to TaskStatistics object
   */
  async execute(): Promise<TaskStatistics> {
    // Fetch all tasks
    const tasks = await this.taskRepository.findAll();

    // Calculate all statistics
    return this.calculateStatistics(tasks);
  }

  /**
   * Calculate all statistics from task list
   */
  private calculateStatistics(tasks: Task[]): TaskStatistics {
    const totalTasks = tasks.length;
    const byStatus = this.countByStatus(tasks);
    const byPriority = this.countByPriority(tasks);
    const completedTasks = byStatus.done;
    const overdueTasks = tasks.filter((t) => t.isOverdue()).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const { allTags, tagCounts } = this.collectTags(tasks);
    const averageTagsPerTask =
      totalTasks > 0
        ? Math.round(
            (Object.values(tagCounts).reduce((sum, count) => sum + count, 0) / totalTasks) * 10
          ) / 10
        : 0;

    const tasksWithDueDate = tasks.filter((t) => t.getDueDate()).length;
    const tasksWithoutDueDate = totalTasks - tasksWithDueDate;

    return {
      totalTasks,
      byStatus,
      byPriority,
      completedTasks,
      overdueTasks,
      completionPercentage,
      allTags,
      tagCounts,
      averageTagsPerTask,
      tasksWithDueDate,
      tasksWithoutDueDate,
    };
  }

  /**
   * Count tasks by status
   */
  private countByStatus(tasks: Task[]): TaskStatistics['byStatus'] {
    const counts = {
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    tasks.forEach((task) => {
      const status = task.getStatus().value;
      if (status === 'todo') {
        counts.todo++;
      } else if (status === 'in-progress') {
        counts.inProgress++;
      } else if (status === 'done') {
        counts.done++;
      }
    });

    return counts;
  }

  /**
   * Count tasks by priority
   */
  private countByPriority(tasks: Task[]): TaskStatistics['byPriority'] {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
    };

    tasks.forEach((task) => {
      const priority = task.getPriority().value;
      if (priority === 'low') {
        counts.low++;
      } else if (priority === 'medium') {
        counts.medium++;
      } else if (priority === 'high') {
        counts.high++;
      }
    });

    return counts;
  }

  /**
   * Collect all unique tags and count occurrences
   */
  private collectTags(tasks: Task[]): { allTags: string[]; tagCounts: Record<string, number> } {
    const tagCounts: Record<string, number> = {};

    tasks.forEach((task) => {
      const tags = task.getTags().toArray();
      tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const allTags = Object.keys(tagCounts).sort();

    return { allTags, tagCounts };
  }
}
