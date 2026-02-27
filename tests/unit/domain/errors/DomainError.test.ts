import { TaskNotFoundError, InvalidTaskError } from '@domain/errors';

describe('DomainError (base class)', () => {
  describe('inheritance', () => {
    it('should be instanceof Error for all subclasses', () => {
      const error1 = new TaskNotFoundError('task-1');
      const error2 = new InvalidTaskError('reason');

      expect(error1 instanceof Error).toBe(true);
      expect(error2 instanceof Error).toBe(true);
    });

    it('should maintain proper prototype chain', () => {
      const error = new TaskNotFoundError('task-1');
      expect(error).toBeInstanceOf(TaskNotFoundError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('abstract methods implementation', () => {
    it('all subclasses should implement getCode()', () => {
      const error1 = new TaskNotFoundError('task-1');
      const error2 = new InvalidTaskError('reason');

      expect(typeof error1.getCode()).toBe('string');
      expect(typeof error2.getCode()).toBe('string');
      expect(error1.getCode()).not.toBe(error2.getCode());
    });

    it('all subclasses should implement isOfType()', () => {
      const error1 = new TaskNotFoundError('task-1');
      const error2 = new InvalidTaskError('reason');

      expect(typeof error1.isOfType('TASK_NOT_FOUND')).toBe('boolean');
      expect(typeof error2.isOfType('INVALID_TASK')).toBe('boolean');
    });
  });

  describe('error message preservation', () => {
    it('should preserve error messages', () => {
      const msg1 = `Task with ID 'task-123' was not found`;
      const error1 = new TaskNotFoundError('task-123');
      expect(error1.message).toBe(msg1);

      const msg2 = 'Invalid task: some reason';
      const error2 = new InvalidTaskError('some reason');
      expect(error2.message).toBe(msg2);
    });
  });

  describe('error catching patterns', () => {
    it('should be catchable by specific error type', () => {
      let caught = false;
      try {
        throw new TaskNotFoundError('task-1');
      } catch (error) {
        if (error instanceof TaskNotFoundError) {
          caught = true;
        }
      }
      expect(caught).toBe(true);
    });

    it('should be catchable by code checking', () => {
      let codeMatched = false;
      try {
        throw new InvalidTaskError('some reason');
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'isOfType' in error &&
          (error as any).isOfType('INVALID_TASK')
        ) {
          codeMatched = true;
        }
      }
      expect(codeMatched).toBe(true);
    });

    it('should support error code discrimination', () => {
      const errors = [new TaskNotFoundError('task-1'), new InvalidTaskError('reason')];

      const errorCodes = errors
        .filter((e) => {
          return e.isOfType('TASK_NOT_FOUND');
        })
        .map((e) => e.getCode());

      expect(errorCodes).toEqual(['TASK_NOT_FOUND']);
    });
  });
});
