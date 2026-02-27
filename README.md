# Task Tracker CLI

A task management CLI built with TypeScript and Clean Architecture.

## Features

- Create, list, update, and delete tasks
- Priority support (`low`, `medium`, `high`)
- Status workflow (`todo`, `in-progress`, `done`)
- Tagging support
- Search and filtering
- Task statistics
- Export to JSON/CSV

## Tech Stack

- TypeScript
- Commander.js
- Chalk
- cli-table3
- Jest

## Installation

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ (comes with Node.js)

### Quick Start

1. **Clone the repository:**

```bash
git clone <repository-url>
cd task-tracker
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the project:**

```bash
npm run build
```

### Usage

#### Development Mode

Run the CLI directly with TypeScript:

```bash
npm run dev -- --help
```

#### Production Mode

Use the built distribution:

```bash
npm run build
node dist/index.js --help
# or if installed globally
task-cli --help
```

### Global Installation

After building, install globally:

```bash
npm run build
npm install -g .
```

Then use from anywhere:

```bash
task-cli --help
task-cli add "My task"
```

### Build and Development Commands

- `npm install` - Install dependencies
- `npm run build` - Compile TypeScript to `dist/`
- `npm run build:watch` - Watch mode for TypeScript compilation
- `npm run dev` - Run CLI in development mode
- `npm start` - Run the built CLI

## CLI Usage

```bash
task-cli --help
```

Or if not installed globally:

```bash
node dist/index.js --help
```

## Commands

### Create Task

```bash
node dist/index.js add "Write docs" --priority high --tags work,docs
```

### List Tasks

```bash
node dist/index.js list
node dist/index.js list --status todo --priority high --sort createdAt --order desc
```

### Update Task

```bash
node dist/index.js update <task-id> --status in-progress --priority medium
```

### Delete Task

```bash
node dist/index.js delete <task-id>
```

### Search Tasks

```bash
node dist/index.js search "docs" --status in-progress --sort updatedAt --order desc
```

### Show Statistics

```bash
node dist/index.js stats
```

### Export Tasks

```bash
node dist/index.js export --format json --output tasks.json --pretty
node dist/index.js export --format csv --output tasks.csv
```

## Scripts

- `npm run build` - Compile TypeScript to `dist/`
- `npm run type-check` - Run TypeScript checks
- `npm run lint` - Run ESLint
- `npm run format` - Format source and tests
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run quality` - Run type-check, lint, format check, tests

## Project Structure

```text
src/
  domain/
  application/
  infrastructure/
  presentation/
```

Detailed docs:

- [Architecture](docs/ARCHITECTURE.md)
- [CLI/API Reference](docs/API.md)
- [Contributing](CONTRIBUTING.md)

## Current Status

- Core CLI is functional and manually validated
- Build, type-check, and tests are passing

## License

MIT
