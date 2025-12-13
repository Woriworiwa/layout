# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a low-code CSS layout generator built with Angular 20, designed to simplify creating responsive layouts using Grid and Flexbox. It's an Nx monorepo with a visual canvas-based editor that generates CSS, HTML, and JSON output.

## Common Commands

### Development
```bash
nx serve              # Start dev server on port 4300
nx build              # Production build
nx build --watch --configuration development  # Watch mode
```

### Testing
```bash
nx test              # Run all Vitest unit tests
nx test --watch      # Run tests in watch mode
nx test --ui         # Open Vitest UI
nx test --coverage   # Generate coverage report
nx e2e               # Run Playwright E2E tests
npx playwright test --ui  # Open Playwright UI
```

### Linting
```bash
nx lint              # Run ESLint on src/ directory
```

### Single Test Execution
To run a specific test file:
```bash
nx test --testFile=path/to/file.spec.ts
```

## Architecture

### State Management

The application uses a custom RxJS-based state management pattern with **pure store functions and service orchestration**:

**Store Pattern (Pure Functions):**
- **Store base class** (src/app/core/store/store.ts): Provides `BehaviorSubject`-based state with `getState()` and `setState()` methods
- **CanvasStore** (src/app/canvas/canvas.store.ts): Pure data layer managing the hierarchical tree of `CanvasItem` objects
  - All operations return new `CanvasItem[]` arrays without side effects
  - Methods like `insertItem()`, `deleteItem()`, `updateItemCss()` are pure functions
  - Only `setItems()` mutates state

**Service Pattern (Orchestration):**
- **CanvasService** controls when state persists by calling `store.setItems()`
- Services coordinate multiple concerns (undo/redo, selection, validation)
- State flows: Component → Service → Store → Component

**Critical Pattern**: Store methods are pure functions. Services control all persistence and side effects.

> See `knowledge-base/architecture/store-service-pattern.md` for detailed patterns and examples.

### Core Data Model

**CanvasItem** (src/app/core/models/canvas-item.model.ts): The fundamental building block representing elements on the canvas
```typescript
{
  itemType: CanvasItemType,  // CONTAINER, FLEX_CONTAINER, TEXT, etc.
  key: string,               // Unique 8-character identifier
  label: string,             // Display name
  content: string,           // For text items
  children: CanvasItem[],    // Nested hierarchy
  css: Css,                  // CSS properties object
  editable: boolean
}
```

### Service Layer Architecture

**CanvasService** (src/app/canvas/canvas.service.ts): Primary orchestration layer
- Calls store methods to get transformed data
- **Controls persistence** by calling `store.setItems()` after store operations
- Coordinates between CanvasStore, UndoRedoService, SelectionService
- Provides `items$` observable for reactive updates
- Triggers undo snapshots after all user actions
- **Always use CanvasService for user actions** (never call CanvasStore directly)

**UndoRedoService** (src/app/core/undo-redo/undo-redo.service.ts):
- Maintains undo/redo stacks with deep clones
- Uses 250ms debounce on `takeSnapshot()` to batch rapid changes
- Emits `undoRedoExecuted$` observable when undo/redo occurs

**SerializationService** (src/app/core/serialization/serialization.service.ts):
- Exports canvas to HTML, CSS (class/inline), and JSON formats
- Serializers are in src/app/core/serialization/serializers/

### Application Structure

```
src/app/
├── canvas/                # Canvas state and service
│   ├── canvas.store.ts   # Pure data operations
│   ├── canvas.service.ts # Orchestration layer
│   └── selection/        # Selection state management
├── core/                  # Shared business logic
│   ├── models/           # Data models (CanvasItem, Css, etc.)
│   ├── store/            # Store base class
│   ├── services/         # Core services (DataService, AppStateService)
│   ├── serialization/    # Export functionality
│   ├── undo-redo/        # Undo/redo implementation
│   └── utils/            # Utilities
├── designer/             # Main editor interface (/design route)
│   ├── insert/          # Preset insertion logic
│   ├── inspector/       # Element inspector panel
│   ├── layers/          # Layer tree view
│   └── properties/      # Properties panel
├── shared/              # Reusable components
│   ├── canvas/          # Canvas rendering components
│   ├── header/          # App header
│   ├── properties/      # Property controls
│   └── side-bar/        # Sidebar components
├── renderer/            # Preview mode (/preview route)
│   └── prisms/          # Syntax highlighting components
└── learn/               # Tutorial mode (/learn route)
```

### Routing

Three main routes (src/app/app.routes.ts):
- `/design` - Main designer interface (eager loaded)
- `/preview` - Preview generated output (lazy loaded)
- `/learn` - Tutorial content (lazy loaded)

### Key Patterns

1. **Pure Store Functions**: CanvasStore methods return new `CanvasItem[]` arrays. Services call `store.setItems()` to persist changes. Never call `setItems()` inside store methods.

2. **Service Orchestration**: Always use `CanvasService` for user actions. It controls persistence, triggers undo snapshots, and coordinates with SelectionService.

3. **Hierarchical Operations**: Store operations recursively traverse the tree structure. Use `getItemById()` to locate items, `getParentItemKey()` to find parents.

4. **Immutability**: When updating canvas items, always use `cloneDeep()` before mutations to ensure pure functions and proper change detection.

5. **Service Injection**: Core services (CanvasStore, CanvasService, etc.) are injected at AppComponent level, making them available app-wide.

6. **Insert Positions**: When inserting items, use the `InsertPosition` enum: `INSIDE`, `BEFORE`, `AFTER`.

## Technology Stack

- **Angular 20.3.9** with standalone components
- **Nx 22.1.1** for monorepo tooling
- **PrimeNG 19.1.6-lts** for UI components with Tailwind CSS via tailwindcss-primeui
- **RxJS 7.8** for reactive state management
- **Vitest 3** with happy-dom for unit tests
- **Playwright** for E2E tests
- **SortableJS** (via nxt-sortablejs) for drag-and-drop
- **PrismJS** for syntax highlighting
- **Firebase** for hosting

**Note**: Angular 21 is available but not yet supported by Nx 22.1.1. Wait for Nx to release official Angular 21 support before upgrading.

## Development Notes

- Dev server runs on port 4300 (not default 4200)
- SCSS is the default style format for components
- The build has relaxed bundle budgets (2MB max for initial and component styles)
- Uses `@happy-dom/jest-environment` (via Vitest) for faster test execution
- Nx cache is enabled for build, test, and lint targets

## Git Workflow

**IMPORTANT**: Do not commit changes automatically. Always wait for explicit user instruction before creating commits.

- Make changes and fixes as requested
- Stage files if needed with `git add`
- Wait for user to say "commit" or similar instruction before running `git commit`
- Use `npm run commit` for guided Conventional Commits when instructed to commit

## Knowledge Base

Detailed documentation is organized in the `knowledge-base/` directory:

### Architecture Patterns
- **`architecture/store-service-pattern.md`** - Store vs Service responsibilities, pure functions, anti-patterns, and real-world examples

### Testing Guidelines
- **`testing/testing-core.md`** - Core testing strategy (Vitest, BDD, what to test/mock)
- **`testing/testing-stores.md`** - Testing Store<T> pattern with real stores
- **`testing/testing-services.md`** - Testing services that use stores
- **`testing/testing-components.md`** - Component testing guidelines

### Best Practices
- **`best-practices.md`** - Comprehensive guide covering TypeScript conventions, Angular patterns, state management, accessibility, and performance

### Angular Documentation
The `.claude/llms-full.txt` file contains the complete official Angular documentation (14,862 lines). Reference this file for Angular-specific questions about framework features, best practices, and API usage.
