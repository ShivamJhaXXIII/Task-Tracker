# Sample Data Documentation

This directory contains sample task data for testing and demonstration purposes.

## Files

### sample-tasks.json

A sample JSON file containing 5 pre-created tasks that demonstrates the structure and format of the Task Tracker database.

## Sample Data Overview

The sample dataset includes:

1. **Complete project documentation**
   - Status: TODO
   - Priority: HIGH
   - Due Date: 2026-03-15
   - Tags: `work`, `documentation`

2. **Review code changes**
   - Status: IN_PROGRESS
   - Priority: MEDIUM
   - Due Date: 2026-03-10
   - Tags: `work`, `review`

3. **Fix bug in login system**
   - Status: DONE
   - Priority: HIGH
   - Due Date: 2026-03-05
   - Tags: `work`, `bug`

4. **Update dependencies**
   - Status: TODO
   - Priority: LOW
   - Due Date: 2026-03-20
   - Tags: `maintenance`

5. **Write unit tests for auth module**
   - Status: IN_PROGRESS
   - Priority: MEDIUM
   - Due Date: 2026-03-12
   - Tags: `testing`, `work`

## JSON Structure

Each task in the JSON file follows this structure:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "description": "Task description",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-03-15T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2026-02-26T10:30:00.000Z",
  "updatedAt": "2026-02-26T10:30:00.000Z"
}
```

### Field Descriptions

- **id**: Unique identifier (UUID format)
- **description**: Task description text
- **status**: Task status (`todo`, `in-progress`, `done`)
- **priority**: Task priority level (`low`, `medium`, `high`)
- **dueDate**: ISO 8601 formatted due date
- **tags**: Array of tag strings for categorization
- **createdAt**: ISO 8601 formatted creation timestamp
- **updatedAt**: ISO 8601 formatted last update timestamp

## How to Use

### Testing
The sample data is used in integration tests to verify:
- Database initialization
- Reading and writing operations
- JSON structure validation
- Filtering by status, priority, and tags
- Date format validation

### Manual Testing
You can copy the `sample-tasks.json` file to your application's data directory (`~/.task-tracker/`) to test the CLI with pre-populated data:

```bash
cp sample-data/sample-tasks.json ~/.task-tracker/tasks.json
```

## Verification

All sample data has been validated to ensure:
- ✅ Proper JSON formatting
- ✅ Valid UUID identifiers
- ✅ Valid enum values for status and priority
- ✅ ISO 8601 formatted dates
- ✅ Correct array structures for tags
- ✅ Required fields present on all tasks
