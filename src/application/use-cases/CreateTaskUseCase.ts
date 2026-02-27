import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';
import { CreateTaskDTO, TaskResponseDTO } from '../dtos';

/**
 * Create Task Use Case
 * Handles the creation of new tasks
 */
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to create a new task
   * @param dto - Data for creating the task
   * @returns Promise resolving to the created task as TaskResponseDTO
   */
  async execute(dto: CreateTaskDTO): Promise<TaskResponseDTO> {
    // Create domain entity using factory method
    const task = Task.create(
      dto.description,
      dto.priority || 'medium',
      dto.dueDate,
      dto.tags || []
    );

    // Save to repository
    const savedTask = await this.taskRepository.save(task);

    // Convert to DTO and return
    return this.toResponseDTO(savedTask);
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
