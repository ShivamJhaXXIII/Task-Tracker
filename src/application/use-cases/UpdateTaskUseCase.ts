import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';
import { UpdateTaskDTO, TaskResponseDTO } from '../dtos';

/**
 * Update Task Use Case
 * Handles updating an existing task
 */
export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to update an existing task
   * @param dto - Data for updating the task
   * @returns Promise resolving to the updated task as TaskResponseDTO
   * @throws TaskNotFoundError if task doesn't exist
   */
  async execute(dto: UpdateTaskDTO): Promise<TaskResponseDTO> {
    // Find the existing task
    let task = await this.taskRepository.findById(dto.id);

    // Apply updates based on provided fields
    if (dto.description !== undefined) {
      task = task.updateDescription(dto.description);
    }

    if (dto.status !== undefined) {
      task = task.updateStatus(dto.status);
    }

    if (dto.priority !== undefined) {
      task = task.updatePriority(dto.priority);
    }

    if (dto.dueDate !== undefined) {
      task = task.updateDueDate(dto.dueDate);
    }

    if (dto.tags !== undefined) {
      task = task.updateTags(dto.tags);
    }

    // Save the updated task
    const updatedTask = await this.taskRepository.update(task);

    // Convert to DTO and return
    return this.toResponseDTO(updatedTask);
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
