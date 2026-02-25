import { TaskDescription } from '@domain/value-objects';

describe('TaskDescription', () => {
  describe('create()', () => {
    it('should create a TaskDescription with valid text', () => {
      const description = TaskDescription.create('Buy groceries');
      expect(description.value).toBe('Buy groceries');
    });

    it('should trim whitespace from input', () => {
      const description = TaskDescription.create('  Buy groceries  ');
      expect(description.value).toBe('Buy groceries');
    });

    it('should allow minimum length description (1 character)', () => {
      const description = TaskDescription.create('A');
      expect(description.value).toBe('A');
    });

    it('should allow maximum length description (500 characters)', () => {
      const longText = 'a'.repeat(500);
      const description = TaskDescription.create(longText);
      expect(description.value).toBe(longText);
    });

    it('should throw error for empty string', () => {
      expect(() => TaskDescription.create('')).toThrow(
        'Task description cannot be empty'
      );
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => TaskDescription.create('   ')).toThrow(
        'Task description cannot be empty'
      );
    });

    it('should throw error when exceeding max length (500 characters)', () => {
      const longText = 'a'.repeat(501);
      expect(() => TaskDescription.create(longText)).toThrow(
        'Task description cannot exceed 500 characters'
      );
    });
  });

  describe('equals()', () => {
    it('should return true for same descriptions', () => {
      const desc1 = TaskDescription.create('Buy groceries');
      const desc2 = TaskDescription.create('Buy groceries');
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const desc1 = TaskDescription.create('Buy groceries');
      const desc2 = TaskDescription.create('Wash car');
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const desc1 = TaskDescription.create('Buy groceries');
      const desc2 = TaskDescription.create('buy groceries');
      expect(desc1.equals(desc2)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the description text', () => {
      const text = 'Buy groceries';
      const description = TaskDescription.create(text);
      expect(description.toString()).toBe(text);
    });
  });
});
