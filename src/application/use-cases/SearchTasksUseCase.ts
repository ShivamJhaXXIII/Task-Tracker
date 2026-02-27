import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';
import { TaskResponseDTO } from '../dtos';

/**
 * Search Criteria for filtering tasks
 */
export interface SearchCriteria {
  /**
   * Filter by task status
   */
  status?: string;

  /**
   * Filter by task priority
   */
  priority?: string;

  /**
   * Filter by tags - matches tasks containing any of these tags
   */
  tags?: string[];

  /**
   * Search by keyword in description
   */
  keyword?: string;

  /**
   * Filter by overdue status
   */
  isOverdue?: boolean;

  /**
   * Filter by completion status
   */
  isDone?: boolean;

  /**
   * Sort by field: 'priority', 'dueDate', 'createdAt', 'updatedAt'
   */
  sortBy?: 'priority' | 'dueDate' | 'createdAt' | 'updatedAt' | 'description';

  /**
   * Sort order: 'asc' or 'desc'
   */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search Tasks Use Case
 * Handles searching and filtering tasks with multiple criteria
 */
export class SearchTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to search tasks
   * @param criteria - Search and filter criteria
   * @returns Promise resolving to filtered and sorted tasks as TaskResponseDTO array
   */
  async execute(criteria: SearchCriteria): Promise<TaskResponseDTO[]> {
    // Get all tasks
    let tasks = await this.taskRepository.findAll();

    // Apply filters
    tasks = this.applyFilters(tasks, criteria);

    // Apply sorting
    tasks = this.applySorting(tasks, criteria);

    // Convert to DTOs and return
    return tasks.map((task) => this.toResponseDTO(task));
  }

  /**
   * Apply all filters to the task list
   */
  private applyFilters(tasks: Task[], criteria: SearchCriteria): Task[] {
    let filtered = tasks;

    // Filter by status
    if (criteria.status) {
      filtered = filtered.filter(
        (t) => t.getStatus().value === criteria.status,
      );
    }

    // Filter by priority
    if (criteria.priority) {
      filtered = filtered.filter(
        (t) => t.getPriority().value === criteria.priority,
      );
    }

    // Filter by tags (match any tag)
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter((t) => {
        const taskTags = t.getTags().toArray();
        return criteria.tags!.some((tag) => taskTags.includes(tag));
      });
    }

    // Filter by keyword in description
    if (criteria.keyword) {
      const lowerKeyword = criteria.keyword.toLowerCase();
      filtered = filtered.filter((t) =>
        t.getDescription().value.toLowerCase().includes(lowerKeyword),
      );
    }

    // Filter by overdue status
    if (criteria.isOverdue !== undefined) {
      filtered = filtered.filter((t) => t.isOverdue() === criteria.isOverdue);
    }

    // Filter by completion status
    if (criteria.isDone !== undefined) {
      filtered = filtered.filter((t) => t.isDone() === criteria.isDone);
    }

    return filtered;
  }

  /**
   * Apply sorting to the task list
   */
  private applySorting(
    tasks: Task[],
    criteria: SearchCriteria,
  ): Task[] {
    if (!criteria.sortBy) {
      return tasks;
    }

    const sortOrder = criteria.sortOrder === 'desc' ? -1 : 1;
    const sorted = [...tasks];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (criteria.sortBy) {
        case 'priority':
          compareValue =
            a.getPriority().toNumeric() - b.getPriority().toNumeric();
          break;

        case 'dueDate': {
          const aDate = a.getDueDate();
          const bDate = b.getDueDate();

          if (!aDate && !bDate) compareValue = 0;
          else if (!aDate) compareValue = 1; // Tasks without due date go last
          else if (!bDate) compareValue = -1;
          else {
            compareValue =
              aDate.value.getTime() - bDate.value.getTime();
          }
          break;
        }

        case 'createdAt':
          compareValue =
            a.getCreatedAt().getTime() - b.getCreatedAt().getTime();
          break;

        case 'updatedAt':
          compareValue =
            a.getUpdatedAt().getTime() - b.getUpdatedAt().getTime();
          break;

        case 'description':
          compareValue = a
            .getDescription()
            .value.localeCompare(b.getDescription().value);
          break;
      }

      return compareValue * sortOrder;
    });

    return sorted;
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
