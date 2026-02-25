import { TaskAlreadyExistsError } from '@domain/errors';

describe('TaskAlreadyExistsError', () => {
  describe('constructor', () => {
    it('should create error with task ID', () => {
      const taskId = 'task-123';
      const error = new TaskAlreadyExistsError(taskId);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain(taskId);
      expect(error.message).toContain('already exists');
    });

    it('should have proper message format', () => {
      const taskId = 'task-456';
      const error = new TaskAlreadyExistsError(taskId);
      expect(error.message).toBe(`Task with ID '${taskId}' already exists`);
    });
  });

  describe('getCode()', () => {
    it('should return TASK_ALREADY_EXISTS code', () => {
      const error = new TaskAlreadyExistsError('task-123');
      expect(error.getCode()).toBe('TASK_ALREADY_EXISTS');
    });
  });

  describe('isOfType()', () => {
    it('should return true for TASK_ALREADY_EXISTS code', () => {
      const error = new TaskAlreadyExistsError('task-123');
      expect(error.isOfType('TASK_ALREADY_EXISTS')).toBe(true);
    });

    it('should return false for other codes', () => {
      const error = new TaskAlreadyExistsError('task-123');
      expect(error.isOfType('TASK_NOT_FOUND')).toBe(false);
      expect(error.isOfType('INVALID_TASK')).toBe(false);
    });
  });

  describe('getTaskId()', () => {
    it('should return the task ID', () => {
      const taskId = 'task-789';
      const error = new TaskAlreadyExistsError(taskId);
      expect(error.getTaskId()).toBe(taskId);
    });
  });

  describe('error handling', () => {
    it('should work with instanceof Error', () => {
      const error = new TaskAlreadyExistsError('task-123');
      expect(error instanceof Error).toBe(true);
    });

    it('should be throwable and catchable', () => {
      const taskId = 'task-999';
      expect(() => {
        throw new TaskAlreadyExistsError(taskId);
      }).toThrow(TaskAlreadyExistsError);
    });

    it('should be catchable as Error', () => {
      expect(() => {
        throw new TaskAlreadyExistsError('task-111');
      }).toThrow(Error);
    });

    it('should preserve task ID through error propagation', () => {
      const taskId = 'task-xyz-123';
      let caught = false;
      try {
        throw new TaskAlreadyExistsError(taskId);
      } catch (error) {
        if (error instanceof TaskAlreadyExistsError) {
          expect(error.getTaskId()).toBe(taskId);
          caught = true;
        }
      }
      expect(caught).toBe(true);
    });
  });
});
