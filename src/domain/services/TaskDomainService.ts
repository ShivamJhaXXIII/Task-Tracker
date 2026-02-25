import { Task } from '../entities';
import { TaskStatus, TaskPriority } from '../value-objects';

/**
 * Domain service providing business logic operations on task collections.
 * Handles queries and calculations that span multiple tasks or don't fit naturally into a single entity.
 */
export class TaskDomainService {
  /**
   * Filters tasks by a specific status value.
   * @param tasks - Array of tasks to filter
   * @param status - Status to match
   * @returns Array of tasks with the specified status
   */
  public static getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter((task) => task.getStatus().equals(status));
  }

  /**
   * Filters tasks by a specific priority level.
   * @param tasks - Array of tasks to filter
   * @param priority - Priority level to match
   * @returns Array of tasks with the specified priority
   */
  public static getTasksByPriority(tasks: Task[], priority: TaskPriority): Task[] {
    return tasks.filter((task) => task.getPriority().equals(priority));
  }

  /**
   * Filters tasks that have passed their due date.
   * @param tasks - Array of tasks to check
   * @returns Array of tasks that are overdue
   */
  public static getOverdueTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => task.isOverdue());
  }

  /**
   * Calculates statistics about tasks including counts by status and overdue status.
   * @param tasks - Array of tasks to analyze
   * @returns Object containing total, completed, inProgress, todo, and overdue counts
   */
  public static getTaskStats(
    tasks: Task[]
  ): {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
  } {
    const stats = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
    };

    for (const task of tasks) {
      if (task.isDone()) {
        stats.completed += 1;
      } else if (task.isInProgress()) {
        stats.inProgress += 1;
      } else if (task.isTodo()) {
        stats.todo += 1;
      }

      if (task.isOverdue()) {
        stats.overdue += 1;
      }
    }

    return stats;
  }

  /**
   * Ranks and sorts tasks by urgency: first by priority (high to low), then by due date (soonest first).
   * @param tasks - Array of tasks to rank
   * @returns Sorted array of tasks by urgency
   */
  public static rankByUrgency(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // First, compare by priority (higher priority first)
      const priorityCompare =
        b.getPriority().toNumeric() - a.getPriority().toNumeric();
      if (priorityCompare !== 0) {
        return priorityCompare;
      }

      // If same priority, compare by due date (sooner first)
      const aDueDate = a.getDueDate();
      const bDueDate = b.getDueDate();

      if (aDueDate && bDueDate) {
        return aDueDate.value.getTime() - bDueDate.value.getTime();
      }

      // No due date tasks come after tasks with due dates
      if (aDueDate && !bDueDate) return -1;
      if (!aDueDate && bDueDate) return 1;

      return 0;
    });
  }

  /**
   * Validates if a status transition between two states is allowed by business rules.
   * Currently permits all transitions; extend with specific rules as needed.
   * @param fromStatus - Current task status
   * @param toStatus - Desired task status
   * @returns True if the transition is allowed
   */
  public static isValidStatusTransition(
    _fromStatus: TaskStatus,
    _toStatus: TaskStatus
  ): boolean {
    // Add business logic here if needed
    // For example:
    // if (fromStatus.isDone() && !toStatus.isDone()) {
    //   return false; // Cannot reopen completed tasks
    // }

    // Currently all transitions are allowed
    return true;
  }
}
