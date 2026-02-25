import { ValueObject } from './ValueObject';

/**
 * TaskTags Value Object
 * Represents a collection of tags for a task
 */
export class TaskTags extends ValueObject<string[]> {
  private static readonly MAX_TAG_LENGTH = 50;
  private static readonly MAX_TAGS = 20;

  private constructor(value: string[]) {
    super(value);
  }

  /**
   * Create an empty set of tags
   */
  public static create(tags: string[] = []): TaskTags {
    const normalized = TaskTags.normalizeAndValidateTags(tags);
    return new TaskTags(normalized);
  }

  /**
   * Create from comma-separated string
   */
  public static fromString(tagsString: string): TaskTags {
    if (!tagsString || tagsString.trim() === '') {
      return TaskTags.create([]);
    }
    const tags = tagsString.split(',').map((tag) => tag.trim());
    return TaskTags.create(tags);
  }

  /**
   * Add a tag to the collection
   */
  public add(tag: string): TaskTags {
    const trimmed = tag.trim();
    if (trimmed === '') {
      throw new Error('Tag cannot be empty');
    }

    if (trimmed.length > TaskTags.MAX_TAG_LENGTH) {
      throw new Error(`Tag cannot exceed ${TaskTags.MAX_TAG_LENGTH} characters`);
    }

    if (this._value.includes(trimmed)) {
      return this; // Tag already exists, return unchanged
    }

    if (this._value.length >= TaskTags.MAX_TAGS) {
      throw new Error(`Cannot add more than ${TaskTags.MAX_TAGS} tags`);
    }

    return new TaskTags([...this._value, trimmed]);
  }

  /**
   * Remove a tag from the collection
   */
  public remove(tag: string): TaskTags {
    const filtered = this._value.filter((t) => t !== tag.trim());
    return new TaskTags(filtered);
  }

  /**
   * Check if a specific tag exists
   */
  public has(tag: string): boolean {
    return this._value.includes(tag.trim());
  }

  /**
   * Check if tags collection is empty
   */
  public isEmpty(): boolean {
    return this._value.length === 0;
  }

  /**
   * Get count of tags
   */
  public count(): number {
    return this._value.length;
  }

  /**
   * Get all tags as an array
   */
  public toArray(): string[] {
    return [...this._value];
  }

  /**
   * Convert to comma-separated string
   */
  public toCommaSeparatedString(): string {
    return this._value.join(', ');
  }

  private static normalizeAndValidateTags(tags: string[]): string[] {
    const normalized = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    // Remove duplicates
    const unique = [...new Set(normalized)];

    // Validate length of each tag
    for (const tag of unique) {
      if (tag.length > this.MAX_TAG_LENGTH) {
        throw new Error(`Tag "${tag}" exceeds ${this.MAX_TAG_LENGTH} characters`);
      }
    }

    // Validate total number of tags
    if (unique.length > this.MAX_TAGS) {
      throw new Error(`Cannot have more than ${this.MAX_TAGS} tags`);
    }

    return unique;
  }

  protected isEqual(value: string[]): boolean {
    if (this._value.length !== value.length) {
      return false;
    }
    const sorted1 = [...this._value].sort();
    const sorted2 = [...value].sort();
    return sorted1.every((tag, index) => tag === sorted2[index]);
  }
}
