import { ITaskRepository } from '../../domain/repositories';
import { Task } from '../../domain/entities';
import { TaskResponseDTO } from '../dtos';

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv';

/**
 * Export Options
 */
export interface ExportOptions {
  /**
   * Export format: 'json' or 'csv'
   */
  format: ExportFormat;

  /**
   * Pretty print JSON (only for JSON format)
   * Default: true
   */
  prettyPrint?: boolean;

  /**
   * Include headers in CSV (only for CSV format)
   * Default: true
   */
  includeHeaders?: boolean;
}

/**
 * Export Tasks Use Case
 * Handles exporting tasks to various formats (JSON, CSV)
 */
export class ExportTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Execute the use case to export tasks
   * @param options - Export options
   * @returns Promise resolving to exported data as string
   */
  async execute(options: ExportOptions): Promise<string> {
    // Fetch all tasks
    const tasks = await this.taskRepository.findAll();

    // Convert to DTOs
    const dtos = tasks.map((task) => this.toResponseDTO(task));

    // Export based on format
    if (options.format === 'json') {
      return this.exportAsJSON(dtos, options.prettyPrint !== false);
    } else if (options.format === 'csv') {
      return this.exportAsCSV(dtos, options.includeHeaders !== false);
    } else {
      throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export tasks as JSON
   */
  private exportAsJSON(dtos: TaskResponseDTO[], prettyPrint: boolean): string {
    if (prettyPrint) {
      return JSON.stringify(dtos, null, 2);
    } else {
      return JSON.stringify(dtos);
    }
  }

  /**
   * Export tasks as CSV
   */
  private exportAsCSV(
    dtos: TaskResponseDTO[],
    includeHeaders: boolean,
  ): string {
    const lines: string[] = [];

    // Add headers if requested
    if (includeHeaders) {
      const headers = [
        'ID',
        'Description',
        'Status',
        'Priority',
        'Due Date',
        'Tags',
        'Created At',
        'Updated At',
        'Is Overdue',
        'Is Done',
      ];
      lines.push(this.escapeCSVLine(headers));
    }

    // Add data rows
    dtos.forEach((dto) => {
      const row = [
        dto.id,
        dto.description,
        dto.status,
        dto.priority,
        dto.dueDate || '',
        dto.tags.join(';'),
        dto.createdAt,
        dto.updatedAt,
        dto.isOverdue ? 'true' : 'false',
        dto.isDone ? 'true' : 'false',
      ];
      lines.push(this.escapeCSVLine(row));
    });

    return lines.join('\n');
  }

  /**
   * Escape CSV line values
   * Wraps fields containing commas, quotes, or newlines in quotes
   * Escapes quotes by doubling them
   */
  private escapeCSVLine(values: string[]): string {
    return values
      .map((value) => {
        // If value contains comma, quote, or newline, wrap in quotes
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          // Escape quotes by doubling them
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',');
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
