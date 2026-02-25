/**
 * Base abstract class for all domain-level errors.
 * All domain errors should extend this class to ensure consistent error handling.
 */
export abstract class DomainError extends Error {
  /**
   * Constructor for domain error.
   * @param message - Error message describing what went wrong
   */
  protected constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DomainError.prototype);
  }

  /**
   * Get the error code/name for error handling
   * This is useful for distinguishing different error types programmatically
   */
  public abstract getCode(): string;

  /**
   * Check if this error is of a specific type
   * Used for pattern matching in error handlers
   */
  public abstract isOfType(code: string): boolean;
}
