import { JsonDatabase } from '../../src/infrastructure/persistence/JsonDatabase';
import { FileSystemTaskRepository } from '../../src/infrastructure/persistence/FileSystemTaskRepository';
import { Task } from '../../src/domain/entities';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Integration test for creating and verifying sample data
 * This test creates a tasks.json file with sample tasks and verifies the structure
 */
describe('Create Sample Data - Integration Test', () => {
  const testDbPath = join(__dirname, '../../..', 'sample-tasks.json');

  afterAll(async () => {
    // Clean up the test database file
    try {
      await fs.unlink(testDbPath);
    } catch {
      // File might not exist
    }
  });

  it('should create and initialize database with sample data', async () => {
    const database = new JsonDatabase(testDbPath);
    await database.initialize();

    expect(database.isInitialized()).toBe(true);
  });

  it('should write and read sample tasks', async () => {
    const database = new JsonDatabase(testDbPath);
    const repository = new FileSystemTaskRepository(database);
    await repository.initialize();

    // Create sample tasks
    const task1 = Task.create('Complete project documentation', 'high', new Date('2026-03-15'), [
      'work',
      'documentation',
    ]);

    const task2 = Task.create('Review code changes', 'medium', new Date('2026-03-10'), [
      'work',
      'review',
    ]);

    const task3 = Task.create('Fix bug in login system', 'high', new Date('2026-03-05'), [
      'work',
      'bug',
    ]);

    const task4 = Task.create('Update dependencies', 'low', new Date('2026-03-20'), [
      'maintenance',
    ]);

    const task5 = Task.create('Write unit tests', 'medium', new Date('2026-03-12'), [
      'testing',
      'work',
    ]);

    // Save all tasks
    await repository.save(task1);
    await repository.save(task2);
    await repository.save(task3);
    await repository.save(task4);
    await repository.save(task5);

    // Read all tasks back
    const allTasks = await repository.findAll();
    expect(allTasks).toHaveLength(5);
  });

  it('should verify JSON file structure', async () => {
    // Read the raw JSON file
    const content = await fs.readFile(testDbPath, 'utf-8');
    const tasks = JSON.parse(content);

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBe(5);

    // Verify first task structure
    const firstTask = tasks[0];
    expect(firstTask).toHaveProperty('id');
    expect(firstTask).toHaveProperty('description');
    expect(firstTask).toHaveProperty('status');
    expect(firstTask).toHaveProperty('priority');
    expect(firstTask).toHaveProperty('dueDate');
    expect(firstTask).toHaveProperty('tags');
    expect(firstTask).toHaveProperty('createdAt');
    expect(firstTask).toHaveProperty('updatedAt');

    // Verify data types
    expect(typeof firstTask.id).toBe('string');
    expect(typeof firstTask.description).toBe('string');
    expect(typeof firstTask.status).toBe('string');
    expect(typeof firstTask.priority).toBe('string');
    expect(Array.isArray(firstTask.tags)).toBe(true);
    expect(typeof firstTask.createdAt).toBe('string');
    expect(typeof firstTask.updatedAt).toBe('string');

    // Verify valid enum values
    expect(['todo', 'in-progress', 'done']).toContain(firstTask.status);
    expect(['low', 'medium', 'high']).toContain(firstTask.priority);
  });

  it('should test reading/writing operations', async () => {
    const database = new JsonDatabase(testDbPath);
    const repository = new FileSystemTaskRepository(database);
    await repository.initialize();

    // Test findByStatus
    const todoTasks = await repository.findByStatus('todo');
    expect(todoTasks.length).toBeGreaterThan(0);
    expect(todoTasks.every((t: Task) => t.getStatus().value === 'todo')).toBe(true);

    // Test findByPriority
    const highPriorityTasks = await repository.findByPriority('high');
    expect(highPriorityTasks.length).toBeGreaterThan(0);
    expect(highPriorityTasks.every((t: Task) => t.getPriority().value === 'high')).toBe(true);

    // Test findByTags
    const workTasks = await repository.findByTags('work');
    expect(workTasks.length).toBeGreaterThan(0);
    expect(workTasks.every((t: Task) => t.getTags().toArray().includes('work'))).toBe(true);

    // Test findById
    const allTasks = await repository.findAll();
    expect(allTasks.length).toBeGreaterThan(0);
    const firstTaskId = allTasks[0]!.getId().value;
    const foundTask = await repository.findById(firstTaskId);
    expect(foundTask.getId().value).toBe(firstTaskId);
  });

  it('should have valid ISO date formats', async () => {
    const content = await fs.readFile(testDbPath, 'utf-8');
    const tasks = JSON.parse(content);

    tasks.forEach((task: any) => {
      // Check createdAt and updatedAt are valid ISO strings
      expect(() => new Date(task.createdAt)).not.toThrow();
      expect(() => new Date(task.updatedAt)).not.toThrow();

      // If dueDate exists, verify it's valid ISO
      if (task.dueDate) {
        expect(() => new Date(task.dueDate)).not.toThrow();
      }
    });
  });
});
