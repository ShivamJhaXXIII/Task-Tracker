/**
 * Barrel export file for domain errors
 * This is similar to a Java interface or constants file that groups related errors
 * It allows importing all errors from one place:
 * import { DomainError, TaskNotFoundError, InvalidTaskError } from '@domain/errors'
 *
 * Without this, you'd need multiple imports like:
 * import { DomainError } from './DomainError'
 * import { TaskNotFoundError } from './TaskNotFoundError'
 * import { InvalidTaskError } from './InvalidTaskError'
 */
export { DomainError } from './DomainError';
export { TaskNotFoundError } from './TaskNotFoundError';
export { InvalidTaskError } from './InvalidTaskError';
export { TaskAlreadyExistsError } from './TaskStatusChangeError';
