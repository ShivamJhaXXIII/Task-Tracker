import { ValueObject } from './ValueObject';

/**
 * TaskDescription Value Object
 * Represents a task's description with validation rules
 */
export class TaskDescription extends ValueObject<string> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 500;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Create a new TaskDescription with validation
   */
  public static create(description: string): TaskDescription {
    const trimmed = description.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new Error('Task description cannot be empty');
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new Error(`Task description cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return new TaskDescription(trimmed);
  }

  protected isEqual(value: string): boolean {
    return this._value === value;
  }
}
