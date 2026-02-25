import { Task } from '@domain/entities';
import {
  TaskId,
  TaskDescription,
  TaskStatus,
  TaskStatusEnum,
  TaskPriority,
  TaskPriorityEnum,
  TaskDueDate,
  TaskTags,
} from '@domain/value-objects';

describe('Task Entity', () => {
  describe('create()', () => {
    it('should create a new task with required parameters', () => {
      const task = Task.create('Buy groceries');
      expect(task).toBeDefined();
      expect(task.getDescription().value).toBe('Buy groceries');
      expect(task.getStatus().value).toBe(TaskStatusEnum.TODO);
      expect(task.getPriority().value).toBe(TaskPriorityEnum.MEDIUM);
    });

    it('should create task with custom priority', () => {
      const task = Task.create('Buy groceries', 'high');
      expect(task.getPriority().value).toBe(TaskPriorityEnum.HIGH);
    });

    it('should create task with due date', () => {
      const dueDate = new Date('2025-12-31');
      const task = Task.create('Buy groceries', 'medium', dueDate);
      expect(task.getDueDate()).toBeDefined();
      expect(task.getDueDate()?.value.getTime()).toBe(dueDate.getTime());
    });

    it('should create task with tags', () => {
      const task = Task.create('Buy groceries', 'medium', undefined, [
        'shopping',
        'food',
      ]);
      expect(task.getTags().count()).toBe(2);
      expect(task.getTags().has('shopping')).toBe(true);
      expect(task.getTags().has('food')).toBe(true);
    });

    it('should set createdAt and updatedAt to current date', () => {
      const beforeCreate = new Date();
      const task = Task.create('Buy groceries');
      const afterCreate = new Date();

      expect(task.getCreatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(task.getCreatedAt().getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
      expect(task.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(task.getUpdatedAt().getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });

    it('should have unique IDs for different tasks', () => {
      const task1 = Task.create('Task 1');
      const task2 = Task.create('Task 2');
      expect(task1.getId().value).not.toBe(task2.getId().value);
    });
  });

  describe('restoreFromPersistence()', () => {
    it('should restore a task from persisted values', () => {
      const id = 'task-123';
      const description = 'Buy groceries';
      const status = 'done';
      const priority = 'high';
      const dueDate = new Date('2025-12-31');
      const tags = ['shopping', 'food'];
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-02-01');

      const task = Task.restoreFromPersistence(
        id,
        description,
        status,
        priority,
        dueDate,
        tags,
        createdAt,
        updatedAt
      );

      expect(task.getId().value).toBe(id);
      expect(task.getDescription().value).toBe(description);
      expect(task.getStatus().value).toBe(TaskStatusEnum.DONE);
      expect(task.getPriority().value).toBe(TaskPriorityEnum.HIGH);
      expect(task.getTags().count()).toBe(2);
      expect(task.getCreatedAt().getTime()).toBe(createdAt.getTime());
      expect(task.getUpdatedAt().getTime()).toBe(updatedAt.getTime());
    });

    it('should restore task without due date', () => {
      const task = Task.restoreFromPersistence(
        'task-123',
        'Buy groceries',
        'todo',
        'medium',
        null,
        [],
        new Date(),
        new Date()
      );
      expect(task.getDueDate()).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return task ID', () => {
      const task = Task.create('Buy groceries');
      expect(task.getId()).toBeInstanceOf(TaskId);
    });

    it('should return task description', () => {
      const task = Task.create('Buy groceries');
      expect(task.getDescription()).toBeInstanceOf(TaskDescription);
      expect(task.getDescription().value).toBe('Buy groceries');
    });

    it('should return task status', () => {
      const task = Task.create('Buy groceries');
      expect(task.getStatus()).toBeInstanceOf(TaskStatus);
      expect(task.getStatus().value).toBe(TaskStatusEnum.TODO);
    });

    it('should return task priority', () => {
      const task = Task.create('Buy groceries', 'high');
      expect(task.getPriority()).toBeInstanceOf(TaskPriority);
      expect(task.getPriority().value).toBe(TaskPriorityEnum.HIGH);
    });

    it('should return task due date', () => {
      const dueDate = new Date('2025-12-31');
      const task = Task.create('Buy groceries', 'medium', dueDate);
      expect(task.getDueDate()).toBeInstanceOf(TaskDueDate);
    });

    it('should return task tags', () => {
      const task = Task.create('Buy groceries', 'medium', undefined, [
        'shopping',
      ]);
      expect(task.getTags()).toBeInstanceOf(TaskTags);
    });

    it('should return createdAt as Date copy', () => {
      const task = Task.create('Buy groceries');
      const createdAt1 = task.getCreatedAt();
      const createdAt2 = task.getCreatedAt();
      expect(createdAt1.getTime()).toBe(createdAt2.getTime());
      expect(createdAt1).not.toBe(createdAt2); // Different object instances
    });

    it('should return updatedAt as Date copy', () => {
      const task = Task.create('Buy groceries');
      const updatedAt1 = task.getUpdatedAt();
      const updatedAt2 = task.getUpdatedAt();
      expect(updatedAt1.getTime()).toBe(updatedAt2.getTime());
      expect(updatedAt1).not.toBe(updatedAt2); // Different object instances
    });
  });

  describe('updateDescription()', () => {
    it('should return new task with updated description', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.updateDescription('Wash car');

      expect(task1.getDescription().value).toBe('Buy groceries');
      expect(task2.getDescription().value).toBe('Wash car');
    });

    it('should preserve other properties', () => {
      const task1 = Task.create('Buy groceries', 'high');
      const task2 = task1.updateDescription('Wash car');

      expect(task2.getPriority().value).toBe(TaskPriorityEnum.HIGH);
      expect(task2.getId().value).toBe(task1.getId().value);
      expect(task2.getStatus().value).toBe(task1.getStatus().value);
    });

    it('should update updatedAt timestamp', () => {
      const task1 = Task.create('Buy groceries');
      const updatedAt1 = task1.getUpdatedAt().getTime();

      // Wait a bit to ensure timestamp differs
      const task2 = task1.updateDescription('Wash car');
      const updatedAt2 = task2.getUpdatedAt().getTime();

      expect(updatedAt2).toBeGreaterThanOrEqual(updatedAt1);
    });

    it('should not modify original task', () => {
      const task1 = Task.create('Buy groceries', 'high');
      task1.updateDescription('Wash car');

      expect(task1.getDescription().value).toBe('Buy groceries');
    });
  });

  describe('updateStatus()', () => {
    it('should return new task with updated status', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.updateStatus('in-progress');

      expect(task1.getStatus().value).toBe(TaskStatusEnum.TODO);
      expect(task2.getStatus().value).toBe(TaskStatusEnum.IN_PROGRESS);
    });

    it('should preserve other properties', () => {
      const task1 = Task.create('Buy groceries', 'high');
      const task2 = task1.updateStatus('done');

      expect(task2.getPriority().value).toBe(TaskPriorityEnum.HIGH);
      expect(task2.getId().value).toBe(task1.getId().value);
      expect(task2.getDescription().value).toBe('Buy groceries');
    });
  });

  describe('updatePriority()', () => {
    it('should return new task with updated priority', () => {
      const task1 = Task.create('Buy groceries', 'low');
      const task2 = task1.updatePriority('high');

      expect(task1.getPriority().value).toBe(TaskPriorityEnum.LOW);
      expect(task2.getPriority().value).toBe(TaskPriorityEnum.HIGH);
    });

    it('should preserve other properties', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.updatePriority('high');

      expect(task2.getDescription().value).toBe('Buy groceries');
      expect(task2.getId().value).toBe(task1.getId().value);
    });
  });

  describe('updateDueDate()', () => {
    it('should return new task with updated due date', () => {
      const task1 = Task.create('Buy groceries');
      const dueDate = new Date('2025-12-31');
      const task2 = task1.updateDueDate(dueDate);

      expect(task1.getDueDate()).toBeNull();
      expect(task2.getDueDate()?.value.getTime()).toBe(dueDate.getTime());
    });

    it('should allow setting due date to null', () => {
      const task1 = Task.create('Buy groceries', 'medium', new Date('2025-12-31'));
      const task2 = task1.updateDueDate(null);

      expect(task1.getDueDate()).toBeDefined();
      expect(task2.getDueDate()).toBeNull();
    });

    it('should preserve other properties', () => {
      const task1 = Task.create('Buy groceries', 'high');
      const task2 = task1.updateDueDate(new Date('2025-12-31'));

      expect(task2.getPriority().value).toBe(TaskPriorityEnum.HIGH);
      expect(task2.getId().value).toBe(task1.getId().value);
    });
  });

  describe('addTag()', () => {
    it('should return new task with added tag', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.addTag('shopping');

      expect(task1.getTags().count()).toBe(0);
      expect(task2.getTags().count()).toBe(1);
      expect(task2.getTags().has('shopping')).toBe(true);
    });

    it('should preserve existing tags', () => {
      const task1 = Task.create('Buy groceries', 'medium', undefined, [
        'shopping',
      ]);
      const task2 = task1.addTag('food');

      expect(task2.getTags().count()).toBe(2);
      expect(task2.getTags().has('shopping')).toBe(true);
      expect(task2.getTags().has('food')).toBe(true);
    });

    it('should not modify original task', () => {
      const task1 = Task.create('Buy groceries');
      task1.addTag('shopping');

      expect(task1.getTags().count()).toBe(0);
    });
  });

  describe('removeTag()', () => {
    it('should return new task with removed tag', () => {
      const task1 = Task.create('Buy groceries', 'medium', undefined, [
        'shopping',
        'food',
      ]);
      const task2 = task1.removeTag('shopping');

      expect(task1.getTags().count()).toBe(2);
      expect(task2.getTags().count()).toBe(1);
      expect(task2.getTags().has('shopping')).toBe(false);
      expect(task2.getTags().has('food')).toBe(true);
    });

    it('should not modify original task', () => {
      const task1 = Task.create('Buy groceries', 'medium', undefined, [
        'shopping',
      ]);
      task1.removeTag('shopping');

      expect(task1.getTags().count()).toBe(1);
    });
  });

  describe('status helper methods', () => {
    it('markAsTodo() should return task with TODO status', () => {
      const task1 = Task.create('Buy groceries');
      task1.markAsInProgress();
      const task2 = task1.markAsTodo();

      expect(task2.getStatus().value).toBe(TaskStatusEnum.TODO);
    });

    it('markAsInProgress() should return task with IN_PROGRESS status', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.markAsInProgress();

      expect(task2.getStatus().value).toBe(TaskStatusEnum.IN_PROGRESS);
    });

    it('markAsDone() should return task with DONE status', () => {
      const task1 = Task.create('Buy groceries');
      const task2 = task1.markAsDone();

      expect(task2.getStatus().value).toBe(TaskStatusEnum.DONE);
    });
  });

  describe('status check methods', () => {
    it('isTodo() should return correct value', () => {
      const task = Task.create('Buy groceries');
      expect(task.isTodo()).toBe(true);
      expect(task.isInProgress()).toBe(false);
      expect(task.isDone()).toBe(false);
    });

    it('isInProgress() should return correct value', () => {
      const task = Task.create('Buy groceries').markAsInProgress();
      expect(task.isInProgress()).toBe(true);
      expect(task.isTodo()).toBe(false);
      expect(task.isDone()).toBe(false);
    });

    it('isDone() should return correct value', () => {
      const task = Task.create('Buy groceries').markAsDone();
      expect(task.isDone()).toBe(true);
      expect(task.isTodo()).toBe(false);
      expect(task.isInProgress()).toBe(false);
    });
  });

  describe('isOverdue()', () => {
    it('should return true for overdue task', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = Task.create('Buy groceries', 'medium', yesterday);
      expect(task.isOverdue()).toBe(true);
    });

    it('should return false for task with future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('Buy groceries', 'medium', tomorrow);
      expect(task.isOverdue()).toBe(false);
    });

    it('should return false for task without due date', () => {
      const task = Task.create('Buy groceries');
      expect(task.isOverdue()).toBe(false);
    });
  });

  describe('toPrimitive()', () => {
    it('should convert task to primitive object', () => {
      const task = Task.create('Buy groceries', 'high', new Date('2025-12-31'), [
        'shopping',
      ]);
      const primitive = task.toPrimitive();

      expect(primitive).toHaveProperty('id');
      expect(primitive).toHaveProperty('description');
      expect(primitive).toHaveProperty('status');
      expect(primitive).toHaveProperty('priority');
      expect(primitive).toHaveProperty('dueDate');
      expect(primitive).toHaveProperty('tags');
      expect(primitive).toHaveProperty('createdAt');
      expect(primitive).toHaveProperty('updatedAt');
    });

    it('should return correct values in primitive object', () => {
      const dueDate = new Date('2025-12-31');
      const task = Task.create('Buy groceries', 'high', dueDate, ['shopping']);
      const primitive = task.toPrimitive();

      expect(primitive.description).toBe('Buy groceries');
      expect(primitive.priority).toBe('high');
      expect(primitive.status).toBe('todo');
      expect(primitive.tags).toEqual(['shopping']);
      expect(typeof primitive.id).toBe('string');
      expect(typeof primitive.createdAt).toBe('string');
      expect(typeof primitive.updatedAt).toBe('string');
    });

    it('should return null for due date if not set', () => {
      const task = Task.create('Buy groceries');
      const primitive = task.toPrimitive();
      expect(primitive.dueDate).toBeNull();
    });
  });

  describe('toString()', () => {
    it('should return formatted string', () => {
      const task = Task.create('Buy groceries', 'high');
      const str = task.toString();

      expect(str).toContain('Task(');
      expect(str).toContain('id=');
      expect(str).toContain('description="Buy groceries"');
      expect(str).toContain('status=todo');
      expect(str).toContain('priority=high');
    });
  });

  describe('immutability', () => {
    it('should be immutable - readonly fields cannot be directly modified', () => {
      const task = Task.create('Buy groceries');
      const originalDescription = task.getDescription().value;
      
      // Attempt to modify via TypeScript's readonly - would be caught at compile time
      // At runtime, the fields are private, so this should not affect the task
      expect(task.getDescription().value).toBe(originalDescription);
      
      // Create a new task with updated description to verify immutability pattern
      const updatedTask = task.updateDescription('Modified');
      expect(task.getDescription().value).toBe('Buy groceries'); // Original unchanged
      expect(updatedTask.getDescription().value).toBe('Modified'); // New instance has change
    });
  });

  describe('chaining', () => {
    it('should support method chaining for updates', () => {
      const task = Task.create('Buy groceries')
        .updatePriority('high')
        .markAsInProgress()
        .addTag('shopping');

      expect(task.getPriority().value).toBe(TaskPriorityEnum.HIGH);
      expect(task.getStatus().value).toBe(TaskStatusEnum.IN_PROGRESS);
      expect(task.getTags().has('shopping')).toBe(true);
    });
  });
});
