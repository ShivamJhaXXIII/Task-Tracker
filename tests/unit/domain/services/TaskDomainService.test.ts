import { TaskDomainService } from '@domain/services';
import { Task } from '@domain/entities';
import { TaskStatus, TaskPriority, TaskStatusEnum, TaskPriorityEnum } from '@domain/value-objects';

describe('TaskDomainService', () => {
  let tasks: Task[];

  beforeEach(() => {
    // Create a sample of tasks for testing
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    tasks = [
      Task.create('Buy groceries', 'high', tomorrow, ['shopping']), // todo, high
      Task.create('Wash car', 'medium', undefined, ['chores']).markAsInProgress(), // in-progress, medium
      Task.create('Review code', 'high', tomorrow, ['work']).markAsDone(), // done, high
      Task.create('Call dentist', 'low', undefined, ['personal']), // todo, low
      Task.create('Submit report', 'high', yesterday, ['work']) // todo, high, overdue
        .markAsInProgress(),
      Task.create('Vacuum house', 'low', new Date('2025-01-01'), ['chores']), // todo, low, overdue
    ];
  });

  describe('getTasksByStatus()', () => {
    it('should return all tasks with TODO status', () => {
      const todoTasks = TaskDomainService.getTasksByStatus(
        tasks,
        TaskStatus.todo()
      );
      expect(todoTasks.length).toBe(3); // Buy groceries, Call dentist, Vacuum house
      expect(todoTasks.every((t) => t.isTodo())).toBe(true);
    });

    it('should return all tasks with IN_PROGRESS status', () => {
      const inProgressTasks = TaskDomainService.getTasksByStatus(
        tasks,
        TaskStatus.inProgress()
      );
      expect(inProgressTasks.length).toBe(2); // Wash car, Submit report
      expect(inProgressTasks.every((t) => t.isInProgress())).toBe(true);
    });

    it('should return all tasks with DONE status', () => {
      const doneTasks = TaskDomainService.getTasksByStatus(
        tasks,
        TaskStatus.done()
      );
      expect(doneTasks.length).toBe(1); // Review code
      expect(doneTasks.every((t) => t.isDone())).toBe(true);
    });

    it('should return empty array when no tasks match status', () => {
      const emptyList = tasks.filter(
        (t) => t.getStatus().value === TaskStatusEnum.DONE
      );
      const result = TaskDomainService.getTasksByStatus(
        emptyList.slice(1), // Remove the one DONE task
        TaskStatus.done()
      );
      expect(result.length).toBe(0);
    });

    it('should not modify original task list', () => {
      const originalLength = tasks.length;
      TaskDomainService.getTasksByStatus(tasks, TaskStatus.todo());
      expect(tasks.length).toBe(originalLength);
    });
  });

  describe('getTasksByPriority()', () => {
    it('should return all tasks with HIGH priority', () => {
      const highPriorityTasks = TaskDomainService.getTasksByPriority(
        tasks,
        TaskPriority.high()
      );
      expect(highPriorityTasks.length).toBe(3); // Buy groceries, Review code, Submit report
      expect(highPriorityTasks.every((t) => t.getPriority().isHigh())).toBe(true);
    });

    it('should return all tasks with MEDIUM priority', () => {
      const mediumPriorityTasks = TaskDomainService.getTasksByPriority(
        tasks,
        TaskPriority.medium()
      );
      expect(mediumPriorityTasks.length).toBe(1); // Wash car
      expect(mediumPriorityTasks.every((t) => t.getPriority().isMedium())).toBe(
        true
      );
    });

    it('should return all tasks with LOW priority', () => {
      const lowPriorityTasks = TaskDomainService.getTasksByPriority(
        tasks,
        TaskPriority.low()
      );
      expect(lowPriorityTasks.length).toBe(2); // Call dentist, Vacuum house
      expect(lowPriorityTasks.every((t) => t.getPriority().isLow())).toBe(true);
    });

    it('should return empty array when no tasks match priority', () => {
      const emptyList = tasks.filter(
        (t) => !t.getPriority().isLow()
      );
      const result = TaskDomainService.getTasksByPriority(
        emptyList,
        TaskPriority.low()
      );
      expect(result.length).toBe(0);
    });
  });

  describe('getOverdueTasks()', () => {
    it('should return only overdue tasks', () => {
      const overdueTasks = TaskDomainService.getOverdueTasks(tasks);
      expect(overdueTasks.length).toBe(2); // Submit report, Vacuum house
      expect(overdueTasks.every((t) => t.isOverdue())).toBe(true);
    });

    it('should not include future due date tasks', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const futureTask = Task.create('Future task', 'low', future);
      const result = TaskDomainService.getOverdueTasks([futureTask]);
      expect(result.length).toBe(0);
    });

    it('should not include tasks without due date', () => {
      const noDateTasks = tasks.filter((t) => t.getDueDate() === null);
      expect(noDateTasks.length).toBeGreaterThan(0);
      const result = TaskDomainService.getOverdueTasks(noDateTasks);
      expect(result.length).toBe(0);
    });

    it('should return empty for empty task list', () => {
      const result = TaskDomainService.getOverdueTasks([]);
      expect(result.length).toBe(0);
    });
  });

  describe('getTaskStats()', () => {
    it('should return correct total count', () => {
      const stats = TaskDomainService.getTaskStats(tasks);
      expect(stats.total).toBe(tasks.length);
    });

    it('should return correct status counts', () => {
      const stats = TaskDomainService.getTaskStats(tasks);
      expect(stats.todo).toBe(3); // Buy groceries, Call dentist, Vacuum house
      expect(stats.inProgress).toBe(2); // Wash car, Submit report
      expect(stats.completed).toBe(1); // Review code
    });

    it('should return correct overdue count', () => {
      const stats = TaskDomainService.getTaskStats(tasks);
      expect(stats.overdue).toBe(2); // Submit report, Vacuum house
    });

    it('should handle all done tasks', () => {
      const doneTasks = tasks.map((t) => t.markAsDone());
      const stats = TaskDomainService.getTaskStats(doneTasks);
      expect(stats.completed).toBe(doneTasks.length);
      expect(stats.todo).toBe(0);
      expect(stats.inProgress).toBe(0);
    });

    it('should handle empty task list', () => {
      const stats = TaskDomainService.getTaskStats([]);
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.inProgress).toBe(0);
      expect(stats.todo).toBe(0);
      expect(stats.overdue).toBe(0);
    });

    it('should count tasks as both status and overdue', () => {
      const stats = TaskDomainService.getTaskStats(tasks);
      // A task can be counted in both status (todo, in-progress, or done)
      // AND in overdue count if it's overdue
      // So total should be: todo + inProgress + completed
      // And overdue is separate
      const statusTotal = stats.todo + stats.inProgress + stats.completed;
      expect(statusTotal).toBe(stats.total);
    });
  });

  describe('rankByUrgency()', () => {
    it('should sort by priority first (high before low)', () => {
      const ranked = TaskDomainService.rankByUrgency(tasks);
      let lastPriority = 4; // Higher than max priority
      for (const task of ranked) {
        const currentPriority = task.getPriority().toNumeric();
        expect(currentPriority).toBeLessThanOrEqual(lastPriority);
        lastPriority = currentPriority;
      }
    });

    it('should sort by due date within same priority', () => {
      // Create tasks with same priority but different due dates
      const samePriorityTasks = [
        Task.create('Task A', 'high', new Date('2025-03-01')),
        Task.create('Task B', 'high', new Date('2025-01-01')),
        Task.create('Task C', 'high', new Date('2025-02-01')),
      ];

      const ranked = TaskDomainService.rankByUrgency(samePriorityTasks);
      const dueDates = ranked
        .map((t) => t.getDueDate()?.value.getTime())
        .filter((d) => d !== undefined) as number[];

      // Should be sorted ascending (soonest first)
      for (let i = 0; i < dueDates.length - 1; i++) {
        expect(dueDates[i]!).toBeLessThanOrEqual(dueDates[i + 1]!);
      }
    });

    it('should place tasks with due dates before tasks without', () => {
      const withDate = Task.create('With date', 'high', new Date('2025-12-31'));
      const withoutDate = Task.create('Without date', 'high');

      const ranked = TaskDomainService.rankByUrgency([withoutDate, withDate]);
      expect(ranked[0]!.getDueDate()).toBeDefined();
      expect(ranked[1]!.getDueDate()).toBeNull();
    });

    it('should not modify original task list', () => {
      const original = [...tasks];
      TaskDomainService.rankByUrgency(tasks);

      expect(tasks.length).toBe(original.length);
      for (let i = 0; i < tasks.length; i++) {
        expect(tasks[i]!.getId().value).toBe(original[i]!.getId().value);
      }
    });

    it('should return tasks in correct urgency order', () => {
      const ranked = TaskDomainService.rankByUrgency(tasks);

      // Check that high priority tasks come first
      const highPriorityTasks = ranked.filter((t) => t.getPriority().isHigh());
      const mediumPriorityTasks = ranked.filter((t) =>
        t.getPriority().isMedium()
      );
      const lowPriorityTasks = ranked.filter((t) => t.getPriority().isLow());

      const firstHighIndex = ranked.findIndex((t) => t.getPriority().isHigh());
      const firstMediumIndex = ranked.findIndex((t) =>
        t.getPriority().isMedium()
      );
      const firstLowIndex = ranked.findIndex((t) => t.getPriority().isLow());

      if (highPriorityTasks.length > 0) {
        expect(firstHighIndex).toBeLessThan(
          firstMediumIndex === -1 ? Infinity : firstMediumIndex
        );
      }
      if (mediumPriorityTasks.length > 0) {
        expect(firstMediumIndex).toBeLessThan(
          firstLowIndex === -1 ? Infinity : firstLowIndex
        );
      }
    });

    it('should handle empty list', () => {
      const ranked = TaskDomainService.rankByUrgency([]);
      expect(ranked.length).toBe(0);
    });

    it('should handle single task', () => {
      const singleTask = [Task.create('Single task')];
      const ranked = TaskDomainService.rankByUrgency(singleTask);
      expect(ranked.length).toBe(1);
      expect(ranked[0]!.getId().value).toBe(singleTask[0]!.getId().value);
    });
  });

  describe('isValidStatusTransition()', () => {
    it('should return true for any transition (currently allow all)', () => {
      const transitions: [TaskStatus, TaskStatus][] = [
        [TaskStatus.todo(), TaskStatus.inProgress()],
        [TaskStatus.inProgress(), TaskStatus.done()],
        [TaskStatus.done(), TaskStatus.todo()],
        [TaskStatus.todo(), TaskStatus.done()],
        [TaskStatus.inProgress(), TaskStatus.todo()],
        [TaskStatus.done(), TaskStatus.inProgress()],
      ];

      for (const [from, to] of transitions) {
        const isValid = TaskDomainService.isValidStatusTransition(from, to);
        expect(isValid).toBe(true);
      }
    });

    it('should allow transition from same status', () => {
      const status = TaskStatus.todo();
      const isValid = TaskDomainService.isValidStatusTransition(status, status);
      expect(isValid).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should filter and rank high-priority overdue tasks', () => {
      const highPriorityTasks = TaskDomainService.getTasksByPriority(
        tasks,
        TaskPriority.high()
      );
      const overdueTasks = TaskDomainService.getOverdueTasks(highPriorityTasks);
      const ranked = TaskDomainService.rankByUrgency(overdueTasks);

      expect(ranked.length).toBeGreaterThanOrEqual(0);
      expect(ranked.every((t) => t.getPriority().isHigh())).toBe(true);
      expect(ranked.every((t) => t.isOverdue())).toBe(true);
    });

    it('should generate accurate statistics after filtering', () => {
      const todoTasks = TaskDomainService.getTasksByStatus(
        tasks,
        TaskStatus.todo()
      );
      const stats = TaskDomainService.getTaskStats(todoTasks);

      expect(stats.completed).toBe(0);
      expect(stats.inProgress).toBe(0);
      expect(stats.todo).toBe(todoTasks.length);
    });
  });
});
