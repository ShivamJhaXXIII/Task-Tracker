import { DomainError } from './DomainError';

/**
 * Error thrown when a task is not found in the repository.
 * Used by operations that attempt to retrieve, update, or delete non-existent tasks.
 */
export class TaskNotFoundError extends DomainError {
  private readonly taskId: string;

  /**
   * Constructor stores the ID of the missing task.
   * @param taskId - ID of the task that was not found
   */
  public constructor(taskId: string) {
    super(`Task with ID '${taskId}' was not found`);
    this.taskId = taskId;
    Object.setPrototypeOf(this, TaskNotFoundError.prototype);
  }

  /**
   * Returns the error code for programmatic error identification.
   * @returns The error code 'TASK_NOT_FOUND'
   */
  public getCode(): string {
    return 'TASK_NOT_FOUND';
  }

  /**
   * Checks if a given error code matches this error type.
   * @param code - Error code to compare
   * @returns True if the code matches this error type
   */
  public isOfType(code: string): boolean {
    return code === 'TASK_NOT_FOUND';
  }

  /**
   * Returns the ID of the missing task.
   * @returns The task ID that was not found
   */
  public getTaskId(): string {
    return this.taskId;
  }
}
