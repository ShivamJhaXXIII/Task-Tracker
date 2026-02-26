import { join } from 'path';
import { homedir } from 'os';

/**
 * Configuration for application paths
 * Handles data directory, database file, and config file locations
 */

const DEFAULT_DATA_DIR = join(homedir(), '.task-tracker');
const DEFAULT_DB_FILE = 'tasks.json';

export const paths = {
  /**
   * Get the data directory for storing task files
   * Uses environment variable DATA_DIR or defaults to ~/.task-tracker
   */
  getDataDirectory: (): string => {
    return process.env['DATA_DIR'] || DEFAULT_DATA_DIR;
  },

  /**
   * Get the full path to the tasks database file
   */
  getTasksDatabasePath: (): string => {
    const dataDir = paths.getDataDirectory();
    const dbFileName = process.env['DB_FILE_NAME'] || DEFAULT_DB_FILE;
    return join(dataDir, dbFileName);
  },

  /**
   * Get the config directory path
   */
  getConfigDirectory: (): string => {
    return process.env['CONFIG_DIR'] || join(paths.getDataDirectory(), 'config');
  },

  /**
   * Get the logs directory path
   */
  getLogsDirectory: (): string => {
    return process.env['LOGS_DIR'] || join(paths.getDataDirectory(), 'logs');
  },

  /**
   * Ensure a directory and its parents exist
   * This is a utility function to be used with fsPromises
   */
  ensureDirectoriesExist: async (dirPath: string): Promise<void> => {
    const fs = await import('fs/promises');
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }
  },
} as const;

export type Paths = typeof paths;
