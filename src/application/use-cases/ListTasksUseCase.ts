import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';
import { TaskResponseDTO } from '../dtos';

/**
 * List Tasks Use Case
 * Retrieves all tasks from the repository
 */
export class ListTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to list all tasks
   * @returns Promise resolving to array of TaskResponseDTO
   */
  async execute(): Promise<TaskResponseDTO[]> {
    // Fetch all tasks from repository
    const tasks = await this.taskRepository.findAll();

    // Convert to DTOs and return
    return tasks.map((task) => this.toResponseDTO(task));
  }

  /**
   * Convert Task domain entity to TaskResponseDTO
   */
  private toResponseDTO(task: Task): TaskResponseDTO {
    const primitive = task.toPrimitive();
    return {
      id: primitive.id,
      description: primitive.description,
      status: primitive.status,
      priority: primitive.priority,
      dueDate: primitive.dueDate,
      tags: primitive.tags,
      createdAt: primitive.createdAt,
      updatedAt: primitive.updatedAt,
      isOverdue: task.isOverdue(),
      isDone: task.isDone(),
    };
  }
}
