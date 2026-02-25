import { Task } from '../entities';

/**
 * Repository interface defining the contract for task data access operations.
 * Separates domain logic from data persistence implementation (Clean Architecture principle).
 * Implementations handle task storage, retrieval, and deletion.
 */
export interface ITaskRepository {
  /**
   * Saves a new task to the repository.
   * @param task - Task entity to save
   * @returns Promise resolving to the saved task
   * @throws Error if task already exists or save operation fails
   */
  save(task: Task): Promise<Task>;

  /**
   * Retrieves a task by its ID.
   * @param id - Unique task identifier
   * @returns Promise resolving to the task entity
   * @throws Error if task not found
   */
  findById(id: string): Promise<Task>;

  /**
   * Retrieves all tasks from the repository.
   * @returns Promise resolving to an array of all task entities
   */
  findAll(): Promise<Task[]>;

  /**
   * Updates an existing task in the repository.
   * @param task - Task entity with updated values
   * @returns Promise resolving to the updated task
   * @throws Error if task not found or update operation fails
   */
  update(task: Task): Promise<Task>;

  /**
   * Deletes a task from the repository.
   * @param id - Unique task identifier
   * @throws Error if task not found or delete operation fails
   */
  delete(id: string): Promise<void>;

  /**
   * Retrieves all tasks matching a specific status.
   * @param status - Task status to filter by
   * @returns Promise resolving to an array of matching tasks
   */
  findByStatus(status: string): Promise<Task[]>;

  /**
   * Retrieves all tasks matching a specific priority level.
   * @param priority - Task priority to filter by
   * @returns Promise resolving to an array of matching tasks
   */
  findByPriority(priority: string): Promise<Task[]>;

  /**
   * Retrieves all tasks containing a specific tag.
   * @param tag - Tag to search for in tasks
   * @returns Promise resolving to an array of matching tasks
   */
  findByTags(tag: string): Promise<Task[]>;
}
