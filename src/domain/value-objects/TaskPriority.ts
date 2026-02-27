import { ValueObject } from './ValueObject';

/**
 * Task Priority Enum
 */
export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * TaskPriority Value Object
 * Represents the priority level of a task
 */
export class TaskPriority extends ValueObject<TaskPriorityEnum> {
  private static readonly PRIORITY_NUMERIC_MAP: Record<TaskPriorityEnum, number> = {
    [TaskPriorityEnum.LOW]: 1,
    [TaskPriorityEnum.MEDIUM]: 2,
    [TaskPriorityEnum.HIGH]: 3,
  };

  private constructor(value: TaskPriorityEnum) {
    super(value);
  }

  /**
   * Create a LOW priority
   */
  public static low(): TaskPriority {
    return new TaskPriority(TaskPriorityEnum.LOW);
  }

  /**
   * Create a MEDIUM priority
   */
  public static medium(): TaskPriority {
    return new TaskPriority(TaskPriorityEnum.MEDIUM);
  }

  /**
   * Create a HIGH priority
   */
  public static high(): TaskPriority {
    return new TaskPriority(TaskPriorityEnum.HIGH);
  }

  /**
   * Create from string value
   */
  public static fromString(priority: string): TaskPriority {
    const normalized = priority.toLowerCase();
    switch (normalized) {
      case TaskPriorityEnum.LOW:
        return TaskPriority.low();
      case TaskPriorityEnum.MEDIUM:
        return TaskPriority.medium();
      case TaskPriorityEnum.HIGH:
        return TaskPriority.high();
      default:
        throw new Error(`Invalid task priority: ${priority}. Must be one of: low, medium, high`);
    }
  }

  /**
   * Get numeric value for sorting/comparison
   */
  public toNumeric(): number {
    return TaskPriority.PRIORITY_NUMERIC_MAP[this._value];
  }

  /**
   * Compare priorities (returns true if this priority is higher)
   */
  public isHigherThan(other: TaskPriority): boolean {
    return this.toNumeric() > other.toNumeric();
  }

  /**
   * Compare priorities (returns true if this priority is lower)
   */
  public isLowerThan(other: TaskPriority): boolean {
    return this.toNumeric() < other.toNumeric();
  }

  public isLow(): boolean {
    return this._value === TaskPriorityEnum.LOW;
  }

  public isMedium(): boolean {
    return this._value === TaskPriorityEnum.MEDIUM;
  }

  public isHigh(): boolean {
    return this._value === TaskPriorityEnum.HIGH;
  }

  protected isEqual(value: TaskPriorityEnum): boolean {
    return this._value === value;
  }
}
