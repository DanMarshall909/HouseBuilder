# AGENTS.md

Guidance for coding agents working in `C:\code\HouseBuilder`.

## Project Overview
- TypeScript Minecraft Bedrock project (behavior/resource packs).
- Build pipeline uses `just-scripts` + `@minecraft/core-build-tasks`.
- Main source folder: `scripts/`.
- TS compile output: `lib/`; bundled runtime output: `dist/scripts/main.js`.
- Tests use Jest + ts-jest, matching `**/*.test.ts`.

## Tooling
- Package manager: `npm` (`package-lock.json` present).
- TypeScript: strict mode enabled (`tsconfig.json`).
- Lint: ESLint flat config in `eslint.config.mjs`.
- Format: Prettier config in `.prettierrc.json`.
- Build orchestration: `just.config.ts`.

## Setup
Run from repo root:

```bash
npm install
```

Environment variables are loaded from `.env` in `just.config.ts`.

## Build / Lint / Test Commands
Primary commands:

```bash
npm run build
npm run lint
npm run test
npm run test:watch
```

Supporting commands:

```bash
npm run clean
npm run local-deploy
npm run mcaddon
```

## Test Commands (including single-test workflows)
Run all tests:

```bash
npm run test
```

Run a single test file:

```bash
npm run test -- scripts/HouseBuilder.test.ts
```

Run tests by name pattern:

```bash
npm run test -- -t "draws a door"
```

Run one named test within one file:

```bash
npm run test -- scripts/Window.test.ts -t "validate window dimensions"
```

## Lint and Formatting
Run lint:

```bash
npm run lint
```

Run lint with autofix:

```bash
npm run lint -- --fix
```

Prettier settings to follow:
- `tabWidth: 2`
- `semi: true`
- `singleQuote: false`
- `trailingComma: es5`
- `printWidth: 120`
- `arrowParens: always`

## Code Style Rules

### Imports
- Order imports as: external packages first, local imports second.
- Use relative imports (`./`, `../`); no path aliases configured.
- Keep imports explicit and minimal.

### TypeScript and Types
- Respect strict typing (`strict: true`, `noImplicitAny: true`).
- Do not introduce `any` unless absolutely unavoidable.
- Prefer `interface`/`type` for shared contracts.
- Use literal unions for constrained domains (e.g., `Rotation = 0 | 90 | 180 | 270`).
- Keep block references typed via `BlockType`/`DoorType`.

### Naming
- `PascalCase`: classes, interfaces, enums, type aliases.
- `camelCase`: variables, functions, methods, object keys.
- `UPPER_SNAKE_CASE`: true constants (frequent in tests).
- Test file names should stay `*.test.ts`.

### Formatting
- Use 2-space indentation.
- Use semicolons.
- Use double-quoted strings by default.
- Keep lines at or under ~120 chars where practical.

### Error Handling and Validation
- Throw clear `Error` messages for invalid input/state.
- Validate AI/external data before building structures.
- In `catch`, narrow unknowns with `instanceof Error`.
- Use `console.error` for failures; use `console.log` for runtime diagnostics.

### Architecture and Boundaries
- Keep orchestration/entry behavior near `scripts/main.ts`.
- Keep domain concerns split by folder (`geometry`, `prefabs`, `io`, `config`, `ai`, `ui`).
- Favor small, composable methods over monolithic functions.
- Prefer `const`; use `let` only when reassignment is required.

### Testing Conventions
- Use Jest `describe` + `it` with behavior-driven names.
- Use `beforeEach` for mutable setup.
- Assert exact block positions and values for geometry behavior.
- Cover both expected behavior and invalid input paths.

### Comments and Docs
- Keep comments only for non-obvious logic.
- Use concise JSDoc on public APIs and important domain types.
- Update docs when commands, APIs, or workflows change.

## Repository Instruction Files
Checked for extra agent rule files:
- `.cursorrules`: not present.
- `.cursor/rules/`: not present.
- `.github/copilot-instructions.md`: not present.

If these appear later, treat them as high-priority repo instructions and merge into this file.

## Recommended Agent Workflow
1. Install deps (`npm install`) if missing.
2. Make focused edits in `scripts/`.
3. Run `npm run lint`.
4. Run targeted tests first (single-file / `-t`), then full suite.
5. Run `npm run build` before finishing.
6. Update tests/docs alongside behavior changes.
