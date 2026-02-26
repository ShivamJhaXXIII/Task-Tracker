/**
 * Create Task DTO
 * Data Transfer Object for creating a new task
 * Used to transfer data from the presentation layer to the application layer
 */
export interface CreateTaskDTO {
  /**
   * Task description text
   */
  description: string;

  /**
   * Task priority level
   * Valid values: 'low', 'medium', 'high'
   * Default: 'medium'
   */
  priority?: string;

  /**
   * Optional due date for the task
   * Should be a valid date
   */
  dueDate?: Date;

  /**
   * Optional array of tags for categorization
   * Default: empty array
   */
  tags?: string[];
}
