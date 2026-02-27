import { TaskTags } from '@domain/value-objects';

describe('TaskTags', () => {
  describe('create()', () => {
    it('should create empty TaskTags when no tags provided', () => {
      const tags = TaskTags.create();
      expect(tags.isEmpty()).toBe(true);
      expect(tags.toArray()).toEqual([]);
    });

    it('should create TaskTags with provided tags', () => {
      const tags = TaskTags.create(['work', 'urgent']);
      expect(tags.toArray()).toContain('work');
      expect(tags.toArray()).toContain('urgent');
    });

    it('should trim whitespace from tags', () => {
      const tags = TaskTags.create(['  work  ', '  urgent  ']);
      expect(tags.toArray()).toEqual(['work', 'urgent']);
    });

    it('should remove duplicate tags', () => {
      const tags = TaskTags.create(['work', 'work', 'urgent']);
      expect(tags.count()).toBe(2);
      expect(tags.toArray().filter((t) => t === 'work').length).toBe(1);
    });

    it('should remove empty tags', () => {
      const tags = TaskTags.create(['work', '', 'urgent', '   ']);
      expect(tags.count()).toBe(2);
      expect(tags.toArray()).toEqual(['work', 'urgent']);
    });

    it('should throw error when tag exceeds max length (50 chars)', () => {
      const longTag = 'a'.repeat(51);
      expect(() => TaskTags.create([longTag])).toThrow(
        'Tag "' + longTag + '" exceeds 50 characters'
      );
    });

    it('should throw error when exceeding max tags (20)', () => {
      const manyTags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
      expect(() => TaskTags.create(manyTags)).toThrow('Cannot have more than 20 tags');
    });

    it('should allow maximum of 20 unique tags', () => {
      const manyTags = Array.from({ length: 20 }, (_, i) => `tag${i}`);
      const tags = TaskTags.create(manyTags);
      expect(tags.count()).toBe(20);
    });
  });

  describe('fromString()', () => {
    it('should create TaskTags from comma-separated string', () => {
      const tags = TaskTags.fromString('work, urgent, important');
      expect(tags.toArray()).toEqual(['work', 'urgent', 'important']);
    });

    it('should handle empty string', () => {
      const tags = TaskTags.fromString('');
      expect(tags.isEmpty()).toBe(true);
    });

    it('should handle whitespace-only string', () => {
      const tags = TaskTags.fromString('   ');
      expect(tags.isEmpty()).toBe(true);
    });

    it('should trim whitespace around tags', () => {
      const tags = TaskTags.fromString('  work  ,  urgent  ');
      expect(tags.toArray()).toEqual(['work', 'urgent']);
    });
  });

  describe('add()', () => {
    it('should add a new tag', () => {
      let tags = TaskTags.create(['work']);
      tags = tags.add('urgent');
      expect(tags.toArray()).toEqual(['work', 'urgent']);
    });

    it('should trim whitespace when adding tag', () => {
      let tags = TaskTags.create(['work']);
      tags = tags.add('  urgent  ');
      expect(tags.toArray()).toEqual(['work', 'urgent']);
    });

    it('should not add duplicate tag (returns unchanged)', () => {
      let tags = TaskTags.create(['work']);
      const sameTagsObject = tags.add('work');
      expect(sameTagsObject.count()).toBe(1);
    });

    it('should throw error for empty tag', () => {
      const tags = TaskTags.create(['work']);
      expect(() => tags.add('')).toThrow('Tag cannot be empty');
    });

    it('should throw error for tag exceeding max length', () => {
      const tags = TaskTags.create(['work']);
      const longTag = 'a'.repeat(51);
      expect(() => tags.add(longTag)).toThrow('Tag cannot exceed 50 characters');
    });

    it('should throw error when adding tag exceeds max tags limit', () => {
      const manyTags = Array.from({ length: 20 }, (_, i) => `tag${i}`);
      let tags = TaskTags.create(manyTags);
      expect(() => tags.add('newTag')).toThrow('Cannot add more than 20 tags');
    });
  });

  describe('remove()', () => {
    it('should remove an existing tag', () => {
      let tags = TaskTags.create(['work', 'urgent']);
      tags = tags.remove('work');
      expect(tags.toArray()).toEqual(['urgent']);
    });

    it('should return unchanged if tag does not exist', () => {
      let tags = TaskTags.create(['work']);
      tags = tags.remove('nonexistent');
      expect(tags.toArray()).toEqual(['work']);
    });

    it('should return empty tags after removing all', () => {
      let tags = TaskTags.create(['work']);
      tags = tags.remove('work');
      expect(tags.isEmpty()).toBe(true);
    });

    it('should trim whitespace when removing', () => {
      let tags = TaskTags.create(['work', 'urgent']);
      tags = tags.remove('  work  ');
      expect(tags.toArray()).toEqual(['urgent']);
    });
  });

  describe('has()', () => {
    it('should return true if tag exists', () => {
      const tags = TaskTags.create(['work', 'urgent']);
      expect(tags.has('work')).toBe(true);
    });

    it('should return false if tag does not exist', () => {
      const tags = TaskTags.create(['work']);
      expect(tags.has('nonexistent')).toBe(false);
    });

    it('should trim whitespace when checking', () => {
      const tags = TaskTags.create(['work']);
      expect(tags.has('  work  ')).toBe(true);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty tags', () => {
      const tags = TaskTags.create();
      expect(tags.isEmpty()).toBe(true);
    });

    it('should return false for tags with items', () => {
      const tags = TaskTags.create(['work']);
      expect(tags.isEmpty()).toBe(false);
    });
  });

  describe('count()', () => {
    it('should return correct count', () => {
      const tags = TaskTags.create(['work', 'urgent', 'important']);
      expect(tags.count()).toBe(3);
    });

    it('should return 0 for empty tags', () => {
      const tags = TaskTags.create();
      expect(tags.count()).toBe(0);
    });
  });

  describe('toArray()', () => {
    it('should return copy of tags array', () => {
      const tags = TaskTags.create(['work', 'urgent']);
      const array = tags.toArray();
      expect(array).toEqual(['work', 'urgent']);
    });

    it('should return independent copy', () => {
      const tags = TaskTags.create(['work', 'urgent']);
      const array = tags.toArray();
      array.push('modified');
      expect(tags.toArray()).not.toContain('modified');
    });
  });

  describe('toCommaSeparatedString()', () => {
    it('should return comma-separated string', () => {
      const tags = TaskTags.create(['work', 'urgent']);
      expect(tags.toCommaSeparatedString()).toBe('work, urgent');
    });

    it('should return empty string for empty tags', () => {
      const tags = TaskTags.create();
      expect(tags.toCommaSeparatedString()).toBe('');
    });
  });

  describe('equals()', () => {
    it('should return true for same tags', () => {
      const tags1 = TaskTags.create(['work', 'urgent']);
      const tags2 = TaskTags.create(['work', 'urgent']);
      expect(tags1.equals(tags2)).toBe(true);
    });

    it('should return true for tags in different order', () => {
      const tags1 = TaskTags.create(['work', 'urgent']);
      const tags2 = TaskTags.create(['urgent', 'work']);
      expect(tags1.equals(tags2)).toBe(true);
    });

    it('should return false for different tags', () => {
      const tags1 = TaskTags.create(['work']);
      const tags2 = TaskTags.create(['urgent']);
      expect(tags1.equals(tags2)).toBe(false);
    });

    it('should return false for different count', () => {
      const tags1 = TaskTags.create(['work']);
      const tags2 = TaskTags.create(['work', 'urgent']);
      expect(tags1.equals(tags2)).toBe(false);
    });
  });
});
