import { TaskId } from '@domain/value-objects';

describe('TaskId', () => {
  describe('create()', () => {
    it('should create a new TaskId with a generated UUID', () => {
      const taskId = TaskId.create();
      expect(taskId).toBeDefined();
      expect(taskId.value).toBeDefined();
      expect(typeof taskId.value).toBe('string');
    });

    it('should generate unique IDs for each creation', () => {
      const taskId1 = TaskId.create();
      const taskId2 = TaskId.create();
      expect(taskId1.value).not.toBe(taskId2.value);
    });

    it('should generate UUIDs with proper format', () => {
      const taskId = TaskId.create();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(taskId.value)).toBe(true);
    });
  });

  describe('of()', () => {
    it('should restore a TaskId from a valid string', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const taskId = TaskId.of(id);
      expect(taskId.value).toBe(id);
    });

    it('should throw error for empty string', () => {
      expect(() => TaskId.of('')).toThrow('TaskId cannot be empty');
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => TaskId.of('   ')).toThrow('TaskId cannot be empty');
    });

    it('should throw error for null/undefined', () => {
      expect(() => TaskId.of('')).toThrow();
    });
  });

  describe('equals()', () => {
    it('should return true for same IDs', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const taskId1 = TaskId.of(id);
      const taskId2 = TaskId.of(id);
      expect(taskId1.equals(taskId2)).toBe(true);
    });

    it('should return false for different IDs', () => {
      const taskId1 = TaskId.create();
      const taskId2 = TaskId.create();
      expect(taskId1.equals(taskId2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const taskId = TaskId.create();
      expect(taskId.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const taskId = TaskId.create();
      expect(taskId.equals(undefined as any)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string value', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const taskId = TaskId.of(id);
      expect(taskId.toString()).toBe(id);
    });
  });
});
