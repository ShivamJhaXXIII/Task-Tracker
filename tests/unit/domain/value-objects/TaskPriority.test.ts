import { TaskPriority, TaskPriorityEnum } from '@domain/value-objects';

describe('TaskPriority', () => {
  describe('factory methods', () => {
    it('should create LOW priority', () => {
      const priority = TaskPriority.low();
      expect(priority.value).toBe(TaskPriorityEnum.LOW);
    });

    it('should create MEDIUM priority', () => {
      const priority = TaskPriority.medium();
      expect(priority.value).toBe(TaskPriorityEnum.MEDIUM);
    });

    it('should create HIGH priority', () => {
      const priority = TaskPriority.high();
      expect(priority.value).toBe(TaskPriorityEnum.HIGH);
    });
  });

  describe('fromString()', () => {
    it('should create priority from lowercase string', () => {
      const priority = TaskPriority.fromString('high');
      expect(priority.value).toBe(TaskPriorityEnum.HIGH);
    });

    it('should create priority from uppercase string', () => {
      const priority = TaskPriority.fromString('LOW');
      expect(priority.value).toBe(TaskPriorityEnum.LOW);
    });

    it('should create priority from mixed case string', () => {
      const priority = TaskPriority.fromString('MeDiUm');
      expect(priority.value).toBe(TaskPriorityEnum.MEDIUM);
    });

    it('should throw error for invalid priority', () => {
      expect(() => TaskPriority.fromString('critical')).toThrow(
        'Invalid task priority'
      );
    });

    it('should throw error for empty priority', () => {
      expect(() => TaskPriority.fromString('')).toThrow('Invalid task priority');
    });
  });

  describe('priority check methods', () => {
    it('isLow() should return true for LOW priority', () => {
      const priority = TaskPriority.low();
      expect(priority.isLow()).toBe(true);
      expect(priority.isMedium()).toBe(false);
      expect(priority.isHigh()).toBe(false);
    });

    it('isMedium() should return true for MEDIUM priority', () => {
      const priority = TaskPriority.medium();
      expect(priority.isMedium()).toBe(true);
      expect(priority.isLow()).toBe(false);
      expect(priority.isHigh()).toBe(false);
    });

    it('isHigh() should return true for HIGH priority', () => {
      const priority = TaskPriority.high();
      expect(priority.isHigh()).toBe(true);
      expect(priority.isLow()).toBe(false);
      expect(priority.isMedium()).toBe(false);
    });
  });

  describe('toNumeric()', () => {
    it('should return correct numeric values', () => {
      expect(TaskPriority.low().toNumeric()).toBe(1);
      expect(TaskPriority.medium().toNumeric()).toBe(2);
      expect(TaskPriority.high().toNumeric()).toBe(3);
    });
  });

  describe('isHigherThan()', () => {
    it('should return true when priority is higher', () => {
      const high = TaskPriority.high();
      const medium = TaskPriority.medium();
      const low = TaskPriority.low();

      expect(high.isHigherThan(medium)).toBe(true);
      expect(high.isHigherThan(low)).toBe(true);
      expect(medium.isHigherThan(low)).toBe(true);
    });

    it('should return false when priority is not higher', () => {
      const high = TaskPriority.high();
      const medium = TaskPriority.medium();
      const low = TaskPriority.low();

      expect(low.isHigherThan(high)).toBe(false);
      expect(low.isHigherThan(medium)).toBe(false);
      expect(medium.isHigherThan(high)).toBe(false);
    });

    it('should return false when priorities are equal', () => {
      const priority1 = TaskPriority.high();
      const priority2 = TaskPriority.high();
      expect(priority1.isHigherThan(priority2)).toBe(false);
    });
  });

  describe('isLowerThan()', () => {
    it('should return true when priority is lower', () => {
      const high = TaskPriority.high();
      const medium = TaskPriority.medium();
      const low = TaskPriority.low();

      expect(low.isLowerThan(medium)).toBe(true);
      expect(low.isLowerThan(high)).toBe(true);
      expect(medium.isLowerThan(high)).toBe(true);
    });

    it('should return false when priority is not lower', () => {
      const high = TaskPriority.high();
      const medium = TaskPriority.medium();
      const low = TaskPriority.low();

      expect(high.isLowerThan(low)).toBe(false);
      expect(high.isLowerThan(medium)).toBe(false);
      expect(medium.isLowerThan(low)).toBe(false);
    });

    it('should return false when priorities are equal', () => {
      const priority1 = TaskPriority.low();
      const priority2 = TaskPriority.low();
      expect(priority1.isLowerThan(priority2)).toBe(false);
    });
  });

  describe('equals()', () => {
    it('should return true for same priorities', () => {
      const priority1 = TaskPriority.high();
      const priority2 = TaskPriority.high();
      expect(priority1.equals(priority2)).toBe(true);
    });

    it('should return false for different priorities', () => {
      const priority1 = TaskPriority.high();
      const priority2 = TaskPriority.low();
      expect(priority1.equals(priority2)).toBe(false);
    });
  });
});
