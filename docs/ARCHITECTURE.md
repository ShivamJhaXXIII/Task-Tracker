# Architecture

This project follows Clean Architecture with clear separation of concerns.

## Layers

## 1) Domain Layer (`src/domain`)

Core business logic and rules:

- Entities: `Task`
- Value Objects: `TaskId`, `TaskDescription`, `TaskStatus`, `TaskPriority`, `TaskDueDate`, `TaskTags`
- Domain Errors
- Repository Contract: `ITaskRepository`
- Domain Services

Characteristics:

- Framework-independent
- No infrastructure dependencies
- Strong validation via value objects

## 2) Application Layer (`src/application`)

Use-case orchestration:

- DTOs for input/output
- Use Cases:
  - `CreateTaskUseCase`
  - `ListTasksUseCase`
  - `UpdateTaskUseCase`
  - `DeleteTaskUseCase`
  - `SearchTasksUseCase`
  - `GetStatisticsUseCase`
  - `ExportTasksUseCase`
- Application errors

Characteristics:

- Depends on domain abstractions
- Contains application workflows
- No UI or persistence details

## 3) Infrastructure Layer (`src/infrastructure`)

External concerns and persistence:

- `JsonDatabase`
- `FileSystemTaskRepository`
- Config and path management
- File-system specific errors

Characteristics:

- Implements domain repository contracts
- Handles serialization/deserialization
- Responsible for persistence and filesystem I/O

## 4) Presentation Layer (`src/presentation`)

CLI interface:

- `App` bootstraps commands and dependencies
- Commands parse CLI input and call use cases
- Logger and Formatter provide output UX

Characteristics:

- Handles user interaction
- Translates CLI options to DTOs
- Displays results and errors

## Dependency Direction

Presentation -> Application -> Domain
Infrastructure -> Domain

Domain does not depend on outer layers.

## Runtime Flow (CLI Request)

1. `src/index.ts` creates and initializes `App`
2. `App` configures Commander and command handlers
3. Command parses arguments/options
4. Command executes corresponding use case
5. Use case calls repository interface
6. Infrastructure repository persists/reads data
7. Command formats and prints output

## Data Storage

- Storage backend: local JSON file through `JsonDatabase`
- Repository maps persisted records <-> domain entities

## Testing Strategy

- Unit tests for domain and core logic
- Integration tests for persistence behavior

