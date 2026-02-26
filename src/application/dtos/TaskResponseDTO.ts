/**
 * Task Response DTO
 * Data Transfer Object for returning task data to the presentation layer
 * Contains all task information in a serializable format
 */
export interface TaskResponseDTO {
  /**
   * Unique task identifier
   */
  id: string;

  /**
   * Task description text
   */
  description: string;

  /**
   * Current task status
   * Values: 'todo', 'in-progress', 'done'
   */
  status: string;

  /**
   * Task priority level
   * Values: 'low', 'medium', 'high'
   */
  priority: string;

  /**
   * Due date in ISO 8601 format
   * null if no due date is set
   */
  dueDate: string | null;

  /**
   * Array of tags for categorization
   */
  tags: string[];

  /**
   * Task creation timestamp in ISO 8601 format
   */
  createdAt: string;

  /**
   * Last update timestamp in ISO 8601 format
   */
  updatedAt: string;

  /**
   * Whether the task is overdue
   */
  isOverdue: boolean;

  /**
   * Whether the task is completed (status is 'done')
   */
  isDone: boolean;
}
