import { TaskStatus, TaskStatusEnum } from '@domain/value-objects';

describe('TaskStatus', () => {
  describe('factory methods', () => {
    it('should create TODO status', () => {
      const status = TaskStatus.todo();
      expect(status.value).toBe(TaskStatusEnum.TODO);
    });

    it('should create IN_PROGRESS status', () => {
      const status = TaskStatus.inProgress();
      expect(status.value).toBe(TaskStatusEnum.IN_PROGRESS);
    });

    it('should create DONE status', () => {
      const status = TaskStatus.done();
      expect(status.value).toBe(TaskStatusEnum.DONE);
    });
  });

  describe('fromString()', () => {
    it('should create status from lowercase string', () => {
      const status = TaskStatus.fromString('todo');
      expect(status.value).toBe(TaskStatusEnum.TODO);
    });

    it('should create status from uppercase string', () => {
      const status = TaskStatus.fromString('DONE');
      expect(status.value).toBe(TaskStatusEnum.DONE);
    });

    it('should create status from mixed case string', () => {
      const status = TaskStatus.fromString('In-Progress');
      expect(status.value).toBe(TaskStatusEnum.IN_PROGRESS);
    });

    it('should throw error for invalid status', () => {
      expect(() => TaskStatus.fromString('invalid')).toThrow(
        'Invalid task status'
      );
    });

    it('should throw error for empty status', () => {
      expect(() => TaskStatus.fromString('')).toThrow('Invalid task status');
    });

    it('should handle all valid statuses', () => {
      expect(TaskStatus.fromString('todo').value).toBe(TaskStatusEnum.TODO);
      expect(TaskStatus.fromString('in-progress').value).toBe(
        TaskStatusEnum.IN_PROGRESS
      );
      expect(TaskStatus.fromString('done').value).toBe(TaskStatusEnum.DONE);
    });
  });

  describe('status check methods', () => {
    it('isTodo() should return true for TODO status', () => {
      const status = TaskStatus.todo();
      expect(status.isTodo()).toBe(true);
      expect(status.isInProgress()).toBe(false);
      expect(status.isDone()).toBe(false);
    });

    it('isInProgress() should return true for IN_PROGRESS status', () => {
      const status = TaskStatus.inProgress();
      expect(status.isInProgress()).toBe(true);
      expect(status.isTodo()).toBe(false);
      expect(status.isDone()).toBe(false);
    });

    it('isDone() should return true for DONE status', () => {
      const status = TaskStatus.done();
      expect(status.isDone()).toBe(true);
      expect(status.isTodo()).toBe(false);
      expect(status.isInProgress()).toBe(false);
    });
  });

  describe('equals()', () => {
    it('should return true for same statuses', () => {
      const status1 = TaskStatus.todo();
      const status2 = TaskStatus.todo();
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = TaskStatus.todo();
      const status2 = TaskStatus.done();
      expect(status1.equals(status2)).toBe(false);
    });
  });
});
