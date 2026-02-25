import { ITaskRepository } from '@domain/repositories';
import { Task } from '@domain/entities';

/**
 * Mock implementation of ITaskRepository for testing
 * This serves to validate that the interface is correctly defined
 * and can be properly implemented
 */
class MockTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<Task> {
    const id = task.getId().value;
    if (this.tasks.has(id)) {
      throw new Error('Task already exists');
    }
    this.tasks.set(id, task);
    return task;
  }

  async findById(id: string): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async update(task: Task): Promise<Task> {
    const id = task.getId().value;
    if (!this.tasks.has(id)) {
      throw new Error('Task not found');
    }
    this.tasks.set(id, task);
    return task;
  }

  async delete(id: string): Promise<void> {
    if (!this.tasks.has(id)) {
      throw new Error('Task not found');
    }
    this.tasks.delete(id);
  }

  async findByStatus(status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.getStatus().value === status
    );
  }

  async findByPriority(priority: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.getPriority().value === priority
    );
  }

  async findByTags(tag: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.getTags().has(tag));
  }
}

describe('ITaskRepository interface', () => {
  let repository: ITaskRepository;

  beforeEach(() => {
    repository = new MockTaskRepository();
  });

  describe('save()', () => {
    it('should save a new task', async () => {
      const task = Task.create('Buy groceries', 'high');
      const saved = await repository.save(task);
      expect(saved.getId().value).toBe(task.getId().value);
    });

    it('should throw error when saving duplicate task', async () => {
      const task = Task.create('Buy groceries');
      await repository.save(task);
      await expect(repository.save(task)).rejects.toThrow();
    });
  });

  describe('findById()', () => {
    it('should retrieve a task by ID', async () => {
      const task = Task.create('Buy groceries');
      await repository.save(task);

      const found = await repository.findById(task.getId().value);
      expect(found.getId().value).toBe(task.getId().value);
      expect(found.getDescription().value).toBe(task.getDescription().value);
    });

    it('should throw error for non-existent task', async () => {
      await expect(repository.findById('non-existent-id')).rejects.toThrow();
    });
  });

  describe('findAll()', () => {
    it('should return all saved tasks', async () => {
      const task1 = Task.create('Task 1');
      const task2 = Task.create('Task 2');
      const task3 = Task.create('Task 3');

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(3);
    });

    it('should return empty array when no tasks exist', async () => {
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });
  });

  describe('update()', () => {
    it('should update an existing task', async () => {
      let task = Task.create('Buy groceries');
      await repository.save(task);

      task = task.updateDescription('Buy groceries and cook');
      const updated = await repository.update(task);

      expect(updated.getDescription().value).toBe('Buy groceries and cook');
    });

    it('should throw error when updating non-existent task', async () => {
      const task = Task.create('Non-existent task');
      await expect(repository.update(task)).rejects.toThrow();
    });
  });

  describe('delete()', () => {
    it('should delete an existing task', async () => {
      const task = Task.create('Task to delete');
      await repository.save(task);

      await repository.delete(task.getId().value);

      const allTasks = await repository.findAll();
      expect(allTasks).toHaveLength(0);
    });

    it('should throw error when deleting non-existent task', async () => {
      await expect(repository.delete('non-existent-id')).rejects.toThrow();
    });
  });

  describe('findByStatus()', () => {
    it('should find all tasks with specific status', async () => {
      const task1 = Task.create('Task 1');
      const task2 = Task.create('Task 2').markAsInProgress();
      const task3 = Task.create('Task 3');

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const todoTasks = await repository.findByStatus('todo');
      expect(todoTasks).toHaveLength(2);
      expect(
        todoTasks.every((t: Task) => t.getStatus().value === 'todo')
      ).toBe(true);
    });

    it('should return empty array when no tasks match status', async () => {
      const task = Task.create('Task 1');
      await repository.save(task);

      const doneTasks = await repository.findByStatus('done');
      expect(doneTasks).toEqual([]);
    });
  });

  describe('findByPriority()', () => {
    it('should find all tasks with specific priority', async () => {
      const task1 = Task.create('High priority task', 'high');
      const task2 = Task.create('Low priority task', 'low');
      const task3 = Task.create('Another high priority task', 'high');

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const highPriorityTasks = await repository.findByPriority('high');
      expect(highPriorityTasks).toHaveLength(2);
      expect(
        highPriorityTasks.every((t: Task) => t.getPriority().value === 'high')
      ).toBe(true);
    });

    it('should return empty array when no tasks match priority', async () => {
      const task = Task.create('Medium priority task', 'medium');
      await repository.save(task);

      const highPriorityTasks = await repository.findByPriority('high');
      expect(highPriorityTasks).toEqual([]);
    });
  });

  describe('findByTags()', () => {
    it('should find all tasks with specific tag', async () => {
      const task1 = Task.create('Task 1', 'medium', undefined, ['work']);
      const task2 = Task.create('Task 2', 'medium', undefined, ['personal']);
      const task3 = Task.create('Task 3', 'medium', undefined, ['work', 'urgent']);

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const workTasks = await repository.findByTags('work');
      expect(workTasks).toHaveLength(2);
      expect(workTasks.every((t: Task) => t.getTags().has('work'))).toBe(true);
    });

    it('should return empty array when no tasks have the tag', async () => {
      const task = Task.create('Task 1', 'medium', undefined, ['personal']);
      await repository.save(task);

      const workTasks = await repository.findByTags('work');
      expect(workTasks).toEqual([]);
    });

    it('should be case-sensitive for tag search', async () => {
      const task = Task.create('Task 1', 'medium', undefined, ['Work']);
      await repository.save(task);

      const workTasksLower = await repository.findByTags('work');
      const workTasksUpper = await repository.findByTags('Work');

      expect(workTasksLower).toHaveLength(0);
      expect(workTasksUpper).toHaveLength(1);
    });
  });

  describe('repository contract', () => {
    it('should maintain persistence across operations', async () => {
      const task1 = Task.create('Task 1', 'high');
      const task2 = Task.create('Task 2', 'low');

      await repository.save(task1);
      await repository.save(task2);

      const allTasks = await repository.findAll();
      expect(allTasks).toHaveLength(2);

      await repository.delete(task1.getId().value);

      const remainingTasks = await repository.findAll();
      expect(remainingTasks).toHaveLength(1);
      expect(remainingTasks[0]!.getId().value).toBe(task2.getId().value);
    });

    it('should support concurrent read operations', async () => {
      const task = Task.create('Shared task');
      await repository.save(task);

      const [task1, task2, allTasks] = await Promise.all([
        repository.findById(task.getId().value),
        repository.findById(task.getId().value),
        repository.findAll(),
      ]);

      expect(task1.getId().value).toBe(task2.getId().value);
      expect(allTasks).toHaveLength(1);
    });

    it('should handle complex filtering scenarios', async () => {
      const task1 = Task.create('Work task', 'high', undefined, ['work']);
      const task2 = Task.create(
        'Personal task',
        'low',
        undefined,
        ['personal']
      );
      const task3 = Task.create(
        'Urgent work task',
        'high',
        undefined,
        ['work', 'urgent']
      );

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const highPriorityWorkTasks = (await repository.findByPriority('high'))
        .filter((t: Task) => t.getTags().has('work'));

      expect(highPriorityWorkTasks).toHaveLength(2);
    });
  });
});
