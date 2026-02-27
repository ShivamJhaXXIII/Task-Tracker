import { TaskDueDate } from '@domain/value-objects';

describe('TaskDueDate', () => {
  describe('create()', () => {
    it('should create a TaskDueDate from valid Date object', () => {
      const date = new Date('2025-12-31');
      const dueDate = TaskDueDate.create(date);
      expect(dueDate.value.getTime()).toBe(date.getTime());
    });

    it('should throw error for invalid Date', () => {
      expect(() => TaskDueDate.create(new Date('invalid'))).toThrow('Invalid date provided');
    });

    it('should throw error for null date', () => {
      expect(() => TaskDueDate.create(null as any)).toThrow('Invalid date provided');
    });

    it('should accept Date objects created in different ways', () => {
      const date1 = new Date('2025-12-31');
      const date2 = new Date(2025, 11, 31);
      expect(() => TaskDueDate.create(date1)).not.toThrow();
      expect(() => TaskDueDate.create(date2)).not.toThrow();
    });
  });

  describe('fromString()', () => {
    it('should create TaskDueDate from ISO date string', () => {
      const dateString = '2025-12-31T00:00:00Z';
      const dueDate = TaskDueDate.fromString(dateString);
      expect(dueDate).toBeDefined();
    });

    it('should create TaskDueDate from date-only string', () => {
      const dateString = '2025-12-31';
      const dueDate = TaskDueDate.fromString(dateString);
      expect(dueDate).toBeDefined();
    });

    it('should throw error for invalid date string', () => {
      expect(() => TaskDueDate.fromString('invalid-date')).toThrow();
    });
  });

  describe('isOverdue()', () => {
    it('should return true for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dueDate = TaskDueDate.create(yesterday);
      expect(dueDate.isOverdue()).toBe(true);
    });

    it('should return false for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = TaskDueDate.create(tomorrow);
      expect(dueDate.isOverdue()).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      const dueDate = TaskDueDate.create(today);
      expect(dueDate.isOverdue()).toBe(false);
    });

    it('should handle reference date parameter', () => {
      const taskDate = new Date('2025-01-15');
      const referenceDate = new Date('2025-01-20');
      const dueDate = TaskDueDate.create(taskDate);
      expect(dueDate.isOverdue(referenceDate)).toBe(true);
    });

    it('should compare dates at start of day', () => {
      const taskDate = new Date('2025-01-15T23:59:59Z');
      const referenceDate = new Date('2025-01-15T00:00:00Z');
      const dueDate = TaskDueDate.create(taskDate);
      expect(dueDate.isOverdue(referenceDate)).toBe(false);
    });
  });

  describe('isDueToday()', () => {
    it('should return true if due date is today', () => {
      const today = new Date();
      const dueDate = TaskDueDate.create(today);
      expect(dueDate.isDueToday()).toBe(true);
    });

    it('should return false if due date is tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = TaskDueDate.create(tomorrow);
      expect(dueDate.isDueToday()).toBe(false);
    });

    it('should return false if due date is yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dueDate = TaskDueDate.create(yesterday);
      expect(dueDate.isDueToday()).toBe(false);
    });

    it('should handle reference date parameter', () => {
      const taskDate = new Date('2025-01-15');
      const referenceDate = new Date('2025-01-15');
      const dueDate = TaskDueDate.create(taskDate);
      expect(dueDate.isDueToday(referenceDate)).toBe(true);
    });
  });

  describe('daysUntilDue()', () => {
    it('should return positive value for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      const dueDate = TaskDueDate.create(future);
      expect(dueDate.daysUntilDue()).toBeGreaterThan(0);
    });

    it('should return negative value for past dates', () => {
      const past = new Date();
      past.setDate(past.getDate() - 5);
      const dueDate = TaskDueDate.create(past);
      expect(dueDate.daysUntilDue()).toBeLessThan(0);
    });

    it('should return 0 for today', () => {
      const today = new Date();
      const dueDate = TaskDueDate.create(today);
      expect(dueDate.daysUntilDue()).toBe(0);
    });

    it('should correctly calculate days difference', () => {
      const taskDate = new Date('2025-01-20');
      const referenceDate = new Date('2025-01-15');
      const dueDate = TaskDueDate.create(taskDate);
      expect(dueDate.daysUntilDue(referenceDate)).toBe(5);
    });
  });

  describe('toISOString()', () => {
    it('should return ISO string format', () => {
      const date = new Date('2025-12-31T12:00:00Z');
      const dueDate = TaskDueDate.create(date);
      const isoString = dueDate.toISOString();
      expect(isoString).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('toDateString()', () => {
    it('should return YYYY-MM-DD format', () => {
      const date = new Date('2025-12-31');
      const dueDate = TaskDueDate.create(date);
      const dateString = dueDate.toDateString();
      expect(dateString).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('equals()', () => {
    it('should return true for same dates', () => {
      const date = new Date('2025-12-31');
      const dueDate1 = TaskDueDate.create(date);
      const dueDate2 = TaskDueDate.create(new Date(date.getTime()));
      expect(dueDate1.equals(dueDate2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const dueDate1 = TaskDueDate.create(new Date('2025-12-31'));
      const dueDate2 = TaskDueDate.create(new Date('2025-12-30'));
      expect(dueDate1.equals(dueDate2)).toBe(false);
    });
  });
});
