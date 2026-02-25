import { DomainError } from './DomainError';

/**
 * Error thrown when attempting to create or save a task with an ID that already exists.
 * Prevents duplicate tasks in the system.
 */
export class TaskAlreadyExistsError extends DomainError {
  private readonly taskId: string;

  /**
   * Constructor stores the ID of the conflicting task.
   * @param taskId - ID of the task that already exists
   */
  public constructor(taskId: string) {
    super(`Task with ID '${taskId}' already exists`);
    this.taskId = taskId;
    Object.setPrototypeOf(this, TaskAlreadyExistsError.prototype);
  }

  /**
   * Returns the error code for programmatic error identification.
   * @returns The error code 'TASK_ALREADY_EXISTS'
   */
  public getCode(): string {
    return 'TASK_ALREADY_EXISTS';
  }

  /**
   * Checks if a given error code matches this error type.
   * @param code - Error code to compare
   * @returns True if the code matches this error type
   */
  public isOfType(code: string): boolean {
    return code === 'TASK_ALREADY_EXISTS';
  }

  /**
   * Returns the ID of the task that caused the conflict.
   * @returns The conflicting task ID
   */
  public getTaskId(): string {
    return this.taskId;
  }
}
