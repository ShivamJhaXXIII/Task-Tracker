import { DomainError } from './DomainError';

/**
 * Error thrown when task data is invalid or violates business rules.
 * Generic error for validation failures across all task properties.
 */
export class InvalidTaskError extends DomainError {
  private readonly reason: string;

  /**
   * Constructor stores the reason for the invalid task.
   * @param reason - Description of what validation rule was violated
   */
  public constructor(reason: string) {
    super(`Invalid task: ${reason}`);
    this.reason = reason;
    Object.setPrototypeOf(this, InvalidTaskError.prototype);
  }

  /**
   * Returns the error code for programmatic error identification.
   * @returns The error code 'INVALID_TASK'
   */
  public getCode(): string {
    return 'INVALID_TASK';
  }

  /**
   * Checks if a given error code matches this error type.
   * @param code - Error code to compare
   * @returns True if the code matches this error type
   */
  public isOfType(code: string): boolean {
    return code === 'INVALID_TASK';
  }

  /**
   * Returns the reason why the task is invalid.
   * @returns Description of the validation failure
   */
  public getReason(): string {
    return this.reason;
  }
}
