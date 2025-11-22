# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a low-code CSS layout generator built with Angular 19, designed to simplify creating responsive layouts using Grid and Flexbox. It's an Nx monorepo with a visual canvas-based editor that generates CSS, HTML, and JSON output.

## Common Commands

### Development
```bash
nx serve              # Start dev server on port 4300
nx build              # Production build
nx build --watch --configuration development  # Watch mode
```

### Testing
```bash
nx test              # Run all Jest unit tests
nx test --watch      # Run tests in watch mode
nx e2e               # Run Cypress E2E tests
nx open-cypress      # Open Cypress UI
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

The application uses a custom RxJS-based state management pattern centered around `Store<T>` (src/app/core/store/store.ts):

- **CanvasStore** (src/app/core/store/canvas.store.ts): Core state container managing the hierarchical tree of `CanvasItem` objects
- **Store base class**: Provides `BehaviorSubject`-based state with `getState()` and `setState()` methods
- State flows unidirectionally through services to components

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

**CanvasService** (src/app/shared/canvas/canvas.service.ts): Primary orchestration layer
- Manages CRUD operations on canvas items
- Coordinates between CanvasStore, UndoRedoService, SelectionService, and DragDropService
- Provides `items$` observable for reactive updates
- Always call `setItems()` with `pushToUndoStack: true` (default) for user actions

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
├── core/                   # Shared business logic and state
│   ├── models/            # Data models (CanvasItem, Css, etc.)
│   ├── store/             # State management (Store, CanvasStore)
│   ├── services/          # Core services (DataService, AppStateService)
│   ├── serialization/     # Export functionality
│   ├── undo-redo/         # Undo/redo implementation
│   └── utils/             # Utilities
├── designer/              # Main editor interface (/design route)
│   ├── insert/           # Preset insertion logic
│   ├── inspector/        # Element inspector panel
│   ├── layers/           # Layer tree view
│   └── properties/       # Properties panel
├── shared/               # Reusable components
│   ├── canvas/           # Canvas rendering and interaction
│   ├── header/           # App header
│   ├── properties/       # Property controls
│   └── side-bar/         # Sidebar components
├── renderer/             # Preview mode (/preview route)
│   └── prisms/           # Syntax highlighting components
└── learn/                # Tutorial mode (/learn route)
```

### Routing

Three main routes (src/app/app.routes.ts):
- `/design` - Main designer interface (eager loaded)
- `/preview` - Preview generated output (lazy loaded)
- `/learn` - Tutorial content (lazy loaded)

### Key Patterns

1. **Hierarchical Operations**: Most CanvasStore operations recursively traverse the tree structure. Use `getItemById()` to locate items, `getParentItemKey()` to find parents.

2. **Immutability**: When updating canvas items, always use `cloneDeep()` and call `setItems()` to trigger reactivity.

3. **Service Injection**: Core services (CanvasStore, CanvasService, etc.) are injected at AppComponent level, making them available app-wide.

4. **Insert Positions**: When inserting items, use the `InsertPosition` enum: `INSIDE`, `BEFORE`, `AFTER`.

## Technology Stack

- **Angular 19** with standalone components
- **Nx 20.3** for monorepo tooling
- **PrimeNG 19** for UI components with Tailwind CSS via tailwindcss-primeui
- **RxJS 7.8** for reactive state management
- **Jest** with happy-dom for unit tests
- **Cypress 13** for E2E tests
- **SortableJS** (via nxt-sortablejs) for drag-and-drop
- **PrismJS** for syntax highlighting
- **Firebase** for hosting

## Development Notes

- Dev server runs on port 4300 (not default 4200)
- SCSS is the default style format for components
- The build has relaxed bundle budgets (2MB max for initial and component styles)
- Uses `@happy-dom/jest-environment` for faster test execution
- Nx cache is enabled for build, test, and lint targets

## Angular Documentation

The `.ai/llms-full.txt` file contains the complete official Angular documentation (14,862 lines). Reference this file for Angular-specific questions about framework features, best practices, and API usage.
