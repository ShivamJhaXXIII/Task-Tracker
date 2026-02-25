import { ValueObject } from './ValueObject';

/**
 * Task Status Enum
 */
export enum TaskStatusEnum {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

/**
 * TaskStatus Value Object
 * Represents the current status of a task
 */
export class TaskStatus extends ValueObject<TaskStatusEnum> {
  private constructor(value: TaskStatusEnum) {
    super(value);
  }

  /**
   * Create a TODO status
   */
  public static todo(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.TODO);
  }

  /**
   * Create an IN_PROGRESS status
   */
  public static inProgress(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.IN_PROGRESS);
  }

  /**
   * Create a DONE status
   */
  public static done(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.DONE);
  }

  /**
   * Create from string value
   */
  public static fromString(status: string): TaskStatus {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case TaskStatusEnum.TODO:
        return TaskStatus.todo();
      case TaskStatusEnum.IN_PROGRESS:
        return TaskStatus.inProgress();
      case TaskStatusEnum.DONE:
        return TaskStatus.done();
      default:
        throw new Error(
          `Invalid task status: ${status}. Must be one of: todo, in-progress, done`
        );
    }
  }

  public isTodo(): boolean {
    return this._value === TaskStatusEnum.TODO;
  }

  public isInProgress(): boolean {
    return this._value === TaskStatusEnum.IN_PROGRESS;
  }

  public isDone(): boolean {
    return this._value === TaskStatusEnum.DONE;
  }

  protected isEqual(value: TaskStatusEnum): boolean {
    return this._value === value;
  }
}
