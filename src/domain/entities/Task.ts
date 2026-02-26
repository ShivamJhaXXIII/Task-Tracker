import {
  TaskId,
  TaskDescription,
  TaskStatus,
  TaskStatusEnum,
  TaskPriority,
  TaskDueDate,
  TaskTags,
} from '../value-objects';

export class Task {
  // Fields
  private readonly _id: TaskId;
  private readonly _description: TaskDescription;
  private readonly _status: TaskStatus;
  private readonly _priority: TaskPriority;
  private readonly _dueDate: TaskDueDate | null;
  private readonly _tags: TaskTags;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  // Private constructor
  private constructor(
    id: TaskId,
    description: TaskDescription,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: TaskDueDate | null,
    tags: TaskTags,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._description = description;
    this._status = status;
    this._priority = priority;
    this._dueDate = dueDate;
    this._tags = tags;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Create a new Task
  public static create(
    description: string,
    priority: string = 'medium',
    dueDate?: Date,
    tags: string[] = []
  ): Task {
    return new Task(
      TaskId.create(),
      TaskDescription.create(description),
      TaskStatus.todo(),
      TaskPriority.fromString(priority),
      dueDate ? TaskDueDate.create(dueDate) : null,
      TaskTags.create(tags),
      new Date(),
      new Date()
    );
  }

  // Restore a Task from persisted values
  public static restoreFromPersistence(
    id: string,
    description: string,
    status: string,
    priority: string,
    dueDate: Date | null,
    tags: string[],
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      TaskId.of(id),
      TaskDescription.create(description),
      TaskStatus.fromString(status),
      TaskPriority.fromString(priority),
      dueDate ? TaskDueDate.create(dueDate) : null,
      TaskTags.create(tags),
      createdAt,
      updatedAt
    );
  }

  // Return the task ID
  public getId(): TaskId {
    return this._id;
  }

  // Return the description
  public getDescription(): TaskDescription {
    return this._description;
  }

  // Return the status
  public getStatus(): TaskStatus {
    return this._status;
  }

  // Return the priority
  public getPriority(): TaskPriority {
    return this._priority;
  }

  // Return the due date (or null)
  public getDueDate(): TaskDueDate | null {
    return this._dueDate;
  }

  // Return tags
  public getTags(): TaskTags {
    return this._tags;
  }

  // Return creation timestamp (copy)
  public getCreatedAt(): Date {
    return new Date(this._createdAt);
  }

  // Return last update timestamp (copy)
  public getUpdatedAt(): Date {
    return new Date(this._updatedAt);
  }

  // Update description (returns new Task)
  public updateDescription(newDescription: string): Task {
    return new Task(
      this._id,
      TaskDescription.create(newDescription),
      this._status,
      this._priority,
      this._dueDate,
      this._tags,
      this._createdAt,
      new Date()
    );
  }

  // Update status (returns new Task)
  public updateStatus(newStatus: string): Task {
    return new Task(
      this._id,
      this._description,
      TaskStatus.fromString(newStatus),
      this._priority,
      this._dueDate,
      this._tags,
      this._createdAt,
      new Date()
    );
  }

  // Update priority (returns new Task)
  public updatePriority(newPriority: string): Task {
    return new Task(
      this._id,
      this._description,
      this._status,
      TaskPriority.fromString(newPriority),
      this._dueDate,
      this._tags,
      this._createdAt,
      new Date()
    );
  }

  // Update due date (returns new Task)
  public updateDueDate(newDueDate: Date | null): Task {
    return new Task(
      this._id,
      this._description,
      this._status,
      this._priority,
      newDueDate ? TaskDueDate.create(newDueDate) : null,
      this._tags,
      this._createdAt,
      new Date()
    );
  }

  // Add a tag (returns new Task)
  public addTag(tag: string): Task {
    const updatedTags = this._tags.add(tag);
    return new Task(
      this._id,
      this._description,
      this._status,
      this._priority,
      this._dueDate,
      updatedTags,
      this._createdAt,
      new Date()
    );
  }

  // Remove a tag (returns new Task)
  public removeTag(tag: string): Task {
    const updatedTags = this._tags.remove(tag);
    return new Task(
      this._id,
      this._description,
      this._status,
      this._priority,
      this._dueDate,
      updatedTags,
      this._createdAt,
      new Date()
    );
  }

  // Replace all tags (returns new Task)
  public updateTags(tags: string[]): Task {
    const updatedTags = TaskTags.create(tags);
    return new Task(
      this._id,
      this._description,
      this._status,
      this._priority,
      this._dueDate,
      updatedTags,
      this._createdAt,
      new Date()
    );
  }

  // Mark as TODO
  public markAsTodo(): Task {
    return this.updateStatus(TaskStatusEnum.TODO);
  }

  // Mark as IN_PROGRESS
  public markAsInProgress(): Task {
    return this.updateStatus(TaskStatusEnum.IN_PROGRESS);
  }

  // Mark as DONE
  public markAsDone(): Task {
    return this.updateStatus(TaskStatusEnum.DONE);
  }

  // Return true if overdue
  public isOverdue(): boolean {
    return this._dueDate !== null && this._dueDate.isOverdue();
  }

  // Return true if done
  public isDone(): boolean {
    return this._status.isDone();
  }

  // Return true if in progress
  public isInProgress(): boolean {
    return this._status.isInProgress();
  }

  // Return true if todo
  public isTodo(): boolean {
    return this._status.isTodo();
  }

  // Convert to plain object for persistence
  public toPrimitive(): {
    id: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this._id.value,
      description: this._description.value,
      status: this._status.value,
      priority: this._priority.value,
      dueDate: this._dueDate ? this._dueDate.toDateString() : null,
      tags: this._tags.toArray(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  // Return formatted string for logging
  public toString(): string {
    return `Task(id=${this._id.value}, description=\"${this._description.value}\", status=${this._status.value}, priority=${this._priority.value})`;
  }
}