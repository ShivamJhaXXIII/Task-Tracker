/**
 * File System Error
 * Thrown when file system operations fail
 */
export class FileSystemError extends Error {
  override readonly name = 'FileSystemError';

  constructor(
    message: string,
    readonly code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, FileSystemError.prototype);
  }

  /**
   * Create a FileSystemError from a standard Error
   */
  static fromError(error: Error, context?: string): FileSystemError {
    const message = context ? `${context}: ${error.message}` : error.message;

    const nodeError = error as NodeJS.ErrnoException;
    return new FileSystemError(message, nodeError.code);
  }

  /**
   * Check if an error is a FileSystemError
   */
  static isFileSystemError(error: unknown): error is FileSystemError {
    return error instanceof FileSystemError;
  }
}
