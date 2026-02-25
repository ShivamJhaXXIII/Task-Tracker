import { TaskNotFoundError } from '@domain/errors';

describe('TaskNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with task ID', () => {
      const taskId = 'task-123';
      const error = new TaskNotFoundError(taskId);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('task-123');
      expect(error.message).toContain('not found');
    });

    it('should have proper message format', () => {
      const taskId = 'task-456';
      const error = new TaskNotFoundError(taskId);
      expect(error.message).toBe(`Task with ID '${taskId}' was not found`);
    });
  });

  describe('getCode()', () => {
    it('should return TASK_NOT_FOUND code', () => {
      const error = new TaskNotFoundError('task-123');
      expect(error.getCode()).toBe('TASK_NOT_FOUND');
    });
  });

  describe('isOfType()', () => {
    it('should return true for TASK_NOT_FOUND code', () => {
      const error = new TaskNotFoundError('task-123');
      expect(error.isOfType('TASK_NOT_FOUND')).toBe(true);
    });

    it('should return false for other codes', () => {
      const error = new TaskNotFoundError('task-123');
      expect(error.isOfType('INVALID_TASK')).toBe(false);
      expect(error.isOfType('TASK_ALREADY_EXISTS')).toBe(false);
    });
  });

  describe('getTaskId()', () => {
    it('should return the task ID', () => {
      const taskId = 'task-789';
      const error = new TaskNotFoundError(taskId);
      expect(error.getTaskId()).toBe(taskId);
    });
  });

  describe('error handling', () => {
    it('should work with instanceof Error', () => {
      const error = new TaskNotFoundError('task-123');
      expect(error instanceof Error).toBe(true);
    });

    it('should be throwable and catchable', () => {
      const taskId = 'task-999';
      expect(() => {
        throw new TaskNotFoundError(taskId);
      }).toThrow(TaskNotFoundError);
    });

    it('should be catchable as Error', () => {
      expect(() => {
        throw new TaskNotFoundError('task-111');
      }).toThrow(Error);
    });
  });
});
