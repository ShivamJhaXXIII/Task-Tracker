import { ITaskRepository } from '../../domain/repositories';

/**
 * Delete Task Use Case
 * Handles deletion of a task
 */
export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to delete a task
   * @param id - ID of the task to delete
   * @returns Promise resolving when task is deleted
   * @throws TaskNotFoundError if task doesn't exist
   */
  async execute(id: string): Promise<void> {
    // Verify task exists before deleting
    await this.taskRepository.findById(id);

    // Delete the task
    await this.taskRepository.delete(id);
  }
}
