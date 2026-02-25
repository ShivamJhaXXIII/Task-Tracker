import { randomUUID } from 'crypto';
import { ValueObject } from './ValueObject';

/**
 * TaskId Value Object
 * Represents a unique identifier for a task
 */
export class TaskId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Create a new TaskId with a generated UUID
   */
  public static create(): TaskId {
    return new TaskId(randomUUID());
  }

  /**
   * Restore a TaskId from a persisted value
   */
  public static of(id: string): TaskId {
    if (!id || id.trim() === '') {
      throw new Error('TaskId cannot be empty');
    }
    return new TaskId(id);
  }

  protected isEqual(value: string): boolean {
    return this._value === value;
  }
}
