/**
 * Application Error
 * Base class for application layer errors
 * Represents errors that occur during business logic execution
 */
export class ApplicationError extends Error {
  override readonly name = 'ApplicationError';

  constructor(
    message: string,
    readonly code: string = 'APPLICATION_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  /**
   * Get error code
   */
  getCode(): string {
    return this.code;
  }

  /**
   * Check if error matches a specific code
   */
  isOfType(code: string): boolean {
    return this.code === code;
  }

  /**
   * Check if an error is an ApplicationError
   */
  static isApplicationError(error: unknown): error is ApplicationError {
    return error instanceof ApplicationError;
  }

  /**
   * Get error details as object
   */
  toJSON(): {
    name: string;
    message: string;
    code: string;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
    };
  }
}
