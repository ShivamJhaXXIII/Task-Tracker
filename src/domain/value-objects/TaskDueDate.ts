import { ValueObject } from './ValueObject';

/**
 * TaskDueDate Value Object
 * Represents a task's due date with validation
 */
export class TaskDueDate extends ValueObject<Date> {
  private constructor(value: Date) {
    super(value);
  }

  /**
   * Create a TaskDueDate from a Date object
   */
  public static create(date: Date): TaskDueDate {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }
    return new TaskDueDate(date);
  }

  /**
   * Create a TaskDueDate from a string (ISO format recommended)
   */
  public static fromString(dateString: string): TaskDueDate {
    const date = new Date(dateString);
    return TaskDueDate.create(date);
  }

  /**
   * Check if the due date has passed
   */
  public isOverdue(referenceDate: Date = new Date()): boolean {
    // Set both dates to start of day for fair comparison
    const dueDate = new Date(
      this._value.getFullYear(),
      this._value.getMonth(),
      this._value.getDate()
    );
    const today = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate()
    );
    return dueDate < today;
  }

  /**
   * Check if due date is today
   */
  public isDueToday(referenceDate: Date = new Date()): boolean {
    return (
      this._value.getFullYear() === referenceDate.getFullYear() &&
      this._value.getMonth() === referenceDate.getMonth() &&
      this._value.getDate() === referenceDate.getDate()
    );
  }

  /**
   * Get days until due (negative if overdue)
   */
  public daysUntilDue(referenceDate: Date = new Date()): number {
    const dueDate = new Date(
      this._value.getFullYear(),
      this._value.getMonth(),
      this._value.getDate()
    );
    const today = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate()
    );
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get ISO string representation
   */
  public toISOString(): string {
    return this._value.toISOString();
  }

  /**
   * Get formatted date string (YYYY-MM-DD)
   */
  public toDateString(): string {
    return this._value.toISOString().split('T')[0] ?? '';
  }

  protected isEqual(value: Date): boolean {
    return this._value.getTime() === value.getTime();
  }
}
