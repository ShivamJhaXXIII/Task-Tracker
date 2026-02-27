import { Task } from '../../domain/entities';
import { ITaskRepository } from '../../domain/repositories';
import { TaskNotFoundError, TaskAlreadyExistsError } from '../../domain/errors';
import { JsonDatabase, TaskRecord } from './JsonDatabase';
import { FileSystemError } from '../errors';

/**
 * File System Task Repository
 * Implements the ITaskRepository interface using JsonDatabase for persistence
 * Handles conversion between Task domain entities and TaskRecord persistence records
 */
export class FileSystemTaskRepository implements ITaskRepository {
  constructor(private database: JsonDatabase) {}

  /**
   * Initialize the repository by initializing the database
   */
  async initialize(): Promise<void> {
    try {
      await this.database.initialize();
    } catch (error) {
      throw FileSystemError.fromError(error as Error, 'Failed to initialize repository');
    }
  }

  /**
   * Save a new task to the repository
   * Throws TaskAlreadyExistsError if a task with the same ID already exists
   */
  async save(task: Task): Promise<Task> {
    try {
      const tasks = await this.database.readAll();

      // Check if task already exists
      if (tasks.some((t) => t.id === task.getId().value)) {
        throw new TaskAlreadyExistsError(`Task with id ${task.getId().value} already exists`);
      }

      // Add the new task
      const taskRecord = this.taskToPersistent(task);
      tasks.push(taskRecord);

      // Write back to database
      await this.database.writeAll(tasks);

      return task;
    } catch (error) {
      if (error instanceof TaskAlreadyExistsError || error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to save task');
    }
  }

  /**
   * Find a task by its ID
   * Throws TaskNotFoundError if the task doesn't exist
   */
  async findById(id: string): Promise<Task> {
    try {
      const tasks = await this.database.readAll();
      const record = tasks.find((t) => t.id === id);

      if (!record) {
        throw new TaskNotFoundError(`Task with id ${id} not found`);
      }

      return this.persistentToTask(record);
    } catch (error) {
      if (error instanceof TaskNotFoundError || error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to find task by id');
    }
  }

  /**
   * Find all tasks in the repository
   */
  async findAll(): Promise<Task[]> {
    try {
      const records = await this.database.readAll();
      return records.map((record) => this.persistentToTask(record));
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to find all tasks');
    }
  }

  /**
   * Update an existing task
   * Throws TaskNotFoundError if the task doesn't exist
   */
  async update(task: Task): Promise<Task> {
    try {
      const tasks = await this.database.readAll();
      const index = tasks.findIndex((t) => t.id === task.getId().value);

      if (index === -1) {
        throw new TaskNotFoundError(`Task with id ${task.getId().value} not found`);
      }

      // Replace the task
      const taskRecord = this.taskToPersistent(task);
      tasks[index] = taskRecord;

      // Write back to database
      await this.database.writeAll(tasks);

      return task;
    } catch (error) {
      if (error instanceof TaskNotFoundError || error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to update task');
    }
  }

  /**
   * Delete a task by its ID
   * Throws TaskNotFoundError if the task doesn't exist
   */
  async delete(id: string): Promise<void> {
    try {
      const tasks = await this.database.readAll();
      const index = tasks.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new TaskNotFoundError(`Task with id ${id} not found`);
      }

      // Remove the task
      tasks.splice(index, 1);

      // Write back to database
      await this.database.writeAll(tasks);
    } catch (error) {
      if (error instanceof TaskNotFoundError || error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to delete task');
    }
  }

  /**
   * Find all tasks with a specific status
   */
  async findByStatus(status: string): Promise<Task[]> {
    try {
      const tasks = await this.database.readAll();
      const records = tasks.filter((t) => t.status === status);
      return records.map((record) => this.persistentToTask(record));
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to find tasks by status');
    }
  }

  /**
   * Find all tasks with a specific priority
   */
  async findByPriority(priority: string): Promise<Task[]> {
    try {
      const tasks = await this.database.readAll();
      const records = tasks.filter((t) => t.priority === priority);
      return records.map((record) => this.persistentToTask(record));
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to find tasks by priority');
    }
  }

  /**
   * Find all tasks containing a specific tag
   */
  async findByTags(tag: string): Promise<Task[]> {
    try {
      const tasks = await this.database.readAll();
      const records = tasks.filter((t) => t.tags.includes(tag));
      return records.map((record) => this.persistentToTask(record));
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw FileSystemError.fromError(error as Error, 'Failed to find tasks by tags');
    }
  }

  /**
   * Convert a Task domain entity to a TaskRecord persistence record
   */
  private taskToPersistent(task: Task): TaskRecord {
    const primitive = task.toPrimitive();
    return {
      id: primitive.id,
      description: primitive.description,
      status: primitive.status as 'todo' | 'in-progress' | 'done',
      priority: primitive.priority as 'low' | 'medium' | 'high',
      dueDate: primitive.dueDate || undefined,
      tags: primitive.tags,
      createdAt: primitive.createdAt,
      updatedAt: primitive.updatedAt,
    };
  }

  /**
   * Convert a TaskRecord persistence record to a Task domain entity
   */
  private persistentToTask(record: TaskRecord): Task {
    const dueDate = record.dueDate ? new Date(record.dueDate) : null;
    const createdAt = new Date(record.createdAt);
    const updatedAt = new Date(record.updatedAt);

    return Task.restoreFromPersistence(
      record.id,
      record.description,
      record.status,
      record.priority,
      dueDate,
      record.tags,
      createdAt,
      updatedAt
    );
  }
}
