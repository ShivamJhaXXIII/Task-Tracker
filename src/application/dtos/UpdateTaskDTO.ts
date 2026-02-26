/**
 * Update Task DTO
 * Data Transfer Object for updating an existing task
 * All fields are optional except the task ID
 */
export interface UpdateTaskDTO {
  /**
   * The ID of the task to update
   * Required field
   */
  id: string;

  /**
   * New task description
   * Optional - only update if provided
   */
  description?: string;

  /**
   * New task status
   * Valid values: 'todo', 'in-progress', 'done'
   * Optional - only update if provided
   */
  status?: string;

  /**
   * New task priority
   * Valid values: 'low', 'medium', 'high'
   * Optional - only update if provided
   */
  priority?: string;

  /**
   * New due date
   * Set to null to remove due date
   * Optional - only update if provided
   */
  dueDate?: Date | null;

  /**
   * New tags array
   * Replaces existing tags completely
   * Optional - only update if provided
   */
  tags?: string[];
}
