# Contributing

Thanks for contributing to Task Tracker CLI.

## Development Setup

```bash
npm install
npm run build
npm test
```

## Branching and Commits

- Create feature branches from `main`
- Use Conventional Commits where possible, e.g.:
  - `feat: add search command`
  - `fix: handle invalid due date`
  - `test: add use case tests`

## Code Quality

Before opening a PR, run:

```bash
npm run type-check
npm run lint
npm run format:check
npm test
```

Or run all at once:

```bash
npm run quality
```

## Architecture Rules

- Keep domain layer independent from infrastructure/UI
- Add new business workflows in application use cases
- Keep command handlers thin (parse input, call use case, format output)
- Reuse existing errors and DTOs where possible

## Testing Guidance

- Add unit tests for business logic changes
- Add integration tests for persistence behavior changes
- Avoid flaky tests and hidden cross-test dependencies

## Pull Requests

Include:

- Problem statement
- Summary of changes
- Test evidence (command output)
- Any breaking changes and migration notes
