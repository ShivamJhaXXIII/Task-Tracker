import { promises as fs } from 'fs';
import { paths } from '../config/paths';

/**
 * Represents the raw task data structure stored in the JSON database
 */
export interface TaskRecord {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO 8601 format
  tags: string[];
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

/**
 * JSON Database
 * Handles reading and writing tasks to a JSON file
 * Provides a simple file-based persistence layer
 */
export class JsonDatabase {
  private filePath: string;
  private initialized: boolean = false;

  constructor(filePath?: string) {
    this.filePath = filePath || paths.getTasksDatabasePath();
  }

  /**
   * Initialize the database
   * Creates the data directory and database file if they don't exist
   */
  async initialize(): Promise<void> {
    try {
      const dirPath = this.filePath.substring(
        0,
        this.filePath.lastIndexOf('/') !== -1
          ? this.filePath.lastIndexOf('/')
          : this.filePath.lastIndexOf('\\')
      );

      // Ensure directory exists
      await paths.ensureDirectoriesExist(dirPath);

      // Check if file exists
      try {
        await fs.access(this.filePath);
      } catch {
        // File doesn't exist, create it with empty array
        await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
      }

      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Failed to initialize JSON database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Read all tasks from the database
   * @returns Array of TaskRecord objects
   */
  async readAll(): Promise<TaskRecord[]> {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      let tasks: unknown;

      try {
        tasks = JSON.parse(data);
      } catch {
        tasks = [];
      }

      // Validate that tasks is an array
      if (!Array.isArray(tasks)) {
        throw new Error('Database file contains invalid data (not an array)');
      }

      return tasks as TaskRecord[];
    } catch (error) {
      throw new Error(
        `Failed to read from database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Write all tasks to the database
   * @param tasks Array of TaskRecord objects to write
   */
  async writeAll(tasks: TaskRecord[]): Promise<void> {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      if (!Array.isArray(tasks)) {
        throw new Error('Invalid input: tasks must be an array');
      }

      const data = JSON.stringify(tasks, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to write to database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clear all tasks from the database
   * Writes an empty array to the file
   */
  async clear(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      await this.writeAll([]);
    } catch (error) {
      throw new Error(
        `Failed to clear database: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the file path of the database
   */
  getFilePath(): string {
    return this.filePath;
  }

  /**
   * Check if the database has been initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}
