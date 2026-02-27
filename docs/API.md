# CLI Command Reference

Base command:

```bash
task-cli [options] [command]
```

For local runs without global install, use:

```bash
node dist/index.js [options] [command]
```

## Global Options

- `-V, --version` Show version
- `-h, --help` Show help
- `-d, --debug` Enable debug output

## Commands

## `create` / `add`

Create a task.

```bash
task-cli add <description> [options]
```

Options:

- `-p, --priority <priority>`: `low|medium|high` (default: `medium`)
- `-d, --due <date>`: due date (`YYYY-MM-DD`)
- `-t, --tags <tags>`: comma-separated tags

Example:

```bash
task-cli add "Prepare release" --priority high --due 2026-03-15 --tags release,work
```

## `list` / `ls`

List tasks.

```bash
task-cli list [options]
```

Options:

- `-s, --status <status>`: `todo|in-progress|done`
- `-p, --priority <priority>`: `low|medium|high`
- `--sort <field>`: `priority|dueDate|createdAt|updatedAt|description` (default: `createdAt`)
- `--order <order>`: `asc|desc` (default: `asc`)

## `update` / `edit`

Update a task.

```bash
task-cli update <id> [options]
```

Options:

- `--description <description>`
- `--status <status>`: `todo|in-progress|done`
- `--priority <priority>`: `low|medium|high`
- `--due <date>`
- `--tags <tags>`

Example:

```bash
task-cli update 123e4567-e89b-12d3-a456-426614174000 --status in-progress --priority medium
```

## `delete` / `rm`

Delete a task.

```bash
task-cli delete <id>
```

## `search`

Search/filter tasks.

```bash
task-cli search [query] [options]
```

Options:

- `-s, --status <status>`: `todo|in-progress|done`
- `-p, --priority <priority>`: `low|medium|high`
- `-t, --tags <tags>`: comma-separated tags
- `--overdue`: only overdue tasks
- `--done`: only completed tasks
- `--sort <field>`: `priority|dueDate|createdAt|updatedAt|description` (default: `createdAt`)
- `--order <order>`: `asc|desc` (default: `asc`)

## `stats` / `statistics`

Show aggregate task metrics.

```bash
task-cli stats
```

## `export`

Export tasks to file.

```bash
task-cli export [options]
```

Options:

- `-f, --format <format>`: `json|csv` (default: `json`)
- `-o, --output <filepath>`: output file path
- `--pretty`: pretty-print JSON

Examples:

```bash
task-cli export --format json --output backup.json --pretty
task-cli export --format csv --output backup.csv
```

## Error Handling

- Validation and business errors are printed with user-friendly messages
- Command exits with non-zero code on handled failures
