import { InvalidTaskError } from '@domain/errors';

describe('InvalidTaskError', () => {
  describe('constructor', () => {
    it('should create error with reason', () => {
      const reason = 'Description cannot be empty';
      const error = new InvalidTaskError(reason);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('Invalid task');
      expect(error.message).toContain(reason);
    });

    it('should have proper message format', () => {
      const reason = 'Priority must be low, medium, or high';
      const error = new InvalidTaskError(reason);
      expect(error.message).toBe(`Invalid task: ${reason}`);
    });
  });

  describe('getCode()', () => {
    it('should return INVALID_TASK code', () => {
      const error = new InvalidTaskError('some reason');
      expect(error.getCode()).toBe('INVALID_TASK');
    });
  });

  describe('isOfType()', () => {
    it('should return true for INVALID_TASK code', () => {
      const error = new InvalidTaskError('some reason');
      expect(error.isOfType('INVALID_TASK')).toBe(true);
    });

    it('should return false for other codes', () => {
      const error = new InvalidTaskError('some reason');
      expect(error.isOfType('TASK_NOT_FOUND')).toBe(false);
      expect(error.isOfType('TASK_ALREADY_EXISTS')).toBe(false);
    });
  });

  describe('getReason()', () => {
    it('should return the reason for invalid task', () => {
      const reason = 'Due date cannot be in the past';
      const error = new InvalidTaskError(reason);
      expect(error.getReason()).toBe(reason);
    });

    it('should preserve exact reason text', () => {
      const reason =
        'Task descriptions must be between 1 and 500 characters';
      const error = new InvalidTaskError(reason);
      expect(error.getReason()).toBe(reason);
    });
  });

  describe('error handling', () => {
    it('should work with instanceof Error', () => {
      const error = new InvalidTaskError('some reason');
      expect(error instanceof Error).toBe(true);
    });

    it('should be throwable and catchable', () => {
      const reason = 'Invalid priority';
      expect(() => {
        throw new InvalidTaskError(reason);
      }).toThrow(InvalidTaskError);
    });

    it('should be catchable as Error', () => {
      expect(() => {
        throw new InvalidTaskError('some reason');
      }).toThrow(Error);
    });

    it('should preserve reason through error propagation', () => {
      const reason = 'Status must be todo, in-progress, or done';
      let caught = false;
      try {
        throw new InvalidTaskError(reason);
      } catch (error) {
        if (error instanceof InvalidTaskError) {
          expect(error.getReason()).toBe(reason);
          caught = true;
        }
      }
      expect(caught).toBe(true);
    });
  });
});
