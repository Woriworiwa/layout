# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a low-code CSS layout generator built with Angular 21, designed to simplify creating responsive layouts using Grid and Flexbox. It's an Nx monorepo with a visual canvas-based editor that generates CSS, HTML, and JSON output.

**Note:** Use Nx MCP tools (`nx_workspace`, `nx_project_details`) to discover available commands and targets dynamically.

## Architecture

This is an Nx monorepo with a **library-first architecture**. Core functionality has been extracted into three reusable libraries:

### Library Structure

**@layout/models** (`libs/models/`)

- Core data models and type definitions
- `CanvasItem` model - The fundamental building block representing elements on the canvas
- CSS interfaces (Css, FlexContainer, GridContainer, BoxSizing, etc.)
- CSS enums (Properties, Units)
- Shared constants and enums
- Type utilities (enumify, proxied-properties-of)

**@layout/canvas** (`libs/canvas/`)

- Canvas rendering and interaction
- State management (CanvasStore, CanvasService)
- Canvas components (Container, Text, AiWrapper)
- Services: Selection, UndoRedo, CopyPaste, PanZoom, ContextMenu, MetaLayer, DragDrop
- Store base class for RxJS state management
- Canvas toolbar and selection UI
- Directives for keyboard commands, pan/zoom, undo/redo

**@layout/serialization** (`libs/serialization/`)

- Export functionality for HTML, CSS, and JSON
- SerializationService orchestrates exports
- Serializers: HtmlSerializer, CssStyleSerializer, CssClassSerializer, JsonSerializer

**boxout** (`apps/boxout/`)

- Main application shell
- App-specific services (AI generation, theme, app state, data service, UI guidance)
- Designer UI (properties panel, layers panel, inspector, header, presets)
- Renderer component for preview mode
- Code viewer components (HTML/CSS/JSON display)
- Routing configuration

### State Management

The application uses a custom RxJS-based state management pattern with **pure store functions and service orchestration**:

**Store Pattern (Pure Functions):**

- **Store base class** (`@layout/canvas`): Provides `BehaviorSubject`-based state with `getState()` and `setState()` methods
- **CanvasStore** (`@layout/canvas`): Pure data layer managing the hierarchical tree of `CanvasItem` objects
  - All operations return new `CanvasItem[]` arrays without side effects
  - Methods like `insertItem()`, `deleteItem()`, `updateItemCss()` are pure functions
  - Only `setItems()` mutates state

**Service Pattern (Orchestration):**

- **CanvasService** (`@layout/canvas`) controls when state persists by calling `store.setItems()`
- Services coordinate multiple concerns (undo/redo, selection, validation)
- State flows: Component → Service → Store → Component

**Critical Pattern**: Store methods are pure functions. Services control all persistence and side effects.

> See `knowledge-base/architecture/store-service-pattern.md` for detailed patterns and examples.

### Core Data Model

**CanvasItem** (`@layout/models`): The fundamental building block representing elements on the canvas

```typescript
{
  itemType: CanvasItemType,  // CONTAINER, FLEX_CONTAINER, TEXT, etc.
  key: string,               // Unique 8-character identifier
  label: string,             // Display name
  content: string,           // For text items
  children: CanvasItem[],    // Nested hierarchy
  css: Css,                  // CSS properties-panel object
  editable: boolean,
  aiMetadata: AiMetadata     // AI generation metadata (optional)
}
```

### Service Layer Architecture

**CanvasService** (`@layout/canvas`): Primary orchestration layer

- Calls store methods to get transformed data
- **Controls persistence** by calling `store.setItems()` after store operations
- Coordinates between CanvasStore, UndoRedoService, SelectionService
- Provides `items$` observable for reactive updates
- Triggers undo snapshots after all user actions
- **Always use CanvasService for user actions** (never call CanvasStore directly)

**UndoRedoService** (`@layout/canvas`):

- Maintains undo/redo stacks with deep clones
- Uses 250ms debounce on `takeSnapshot()` to batch rapid changes
- Emits `undoRedoExecuted$` observable when undo/redo occurs

**SerializationService** (`@layout/serialization`):

- Exports canvas to HTML, CSS (class/inline), and JSON formats
- Serializers implement the `Serializer` interface and handle specific output formats

### Application Structure

```
libs/                        # Reusable libraries
├── models/                  # @layout/models - Data models & types
│   ├── canvas-item.model.ts
│   ├── css-interfaces/      # Css, FlexContainer, GridContainer, etc.
│   ├── css-enums/          # Properties, Units
│   ├── constants.ts
│   ├── canvas-item-type.enum.ts
│   └── utils/              # Type utilities
│
├── canvas/                  # @layout/canvas - Canvas functionality
│   ├── canvas.component.ts
│   ├── canvas.store.ts     # Pure data operations
│   ├── canvas.service.ts   # Orchestration layer
│   ├── canvas-items/       # Container, Text, AiWrapper components
│   ├── selection/          # Selection service & UI
│   ├── undo-redo/          # Undo/redo service & directive
│   ├── copy-paste/         # Copy/paste service
│   ├── pan-zoom/           # Pan/zoom service & directive
│   ├── context-menu/       # Context menu service & component
│   ├── meta-layer/         # Meta labels & layer
│   ├── drag-drop/          # Drag/drop services & directives
│   ├── toolbar/            # Canvas toolbar
│   ├── keyboard/           # Keyboard commands directive
│   └── store/              # Store base class
│
└── serialization/           # @layout/serialization - Export functionality
    ├── serialization.service.ts
    └── serializers/        # HTML, CSS, JSON serializers

apps/boxout/src/app/        # Main application
├── core/                   # App-specific business logic
│   ├── services/          # AI generation, theme, app state, data, UI guidance
│   ├── store/             # App-level state (layout, app state)
│   ├── theme/             # Theme configuration & presets
│   ├── models/            # App-specific models (Preset)
│   └── canvas-item-type.enum.ts           # App-specific enums
│
├── designer/              # Main editor interface (/design route)
│   ├── designer.component.ts
│   ├── header/           # App header
│   ├── inspector/        # Element inspector panel
│   ├── layers/           # Layer tree view
│   ├── presets/          # Preset components & service
│   └── properties/       # Properties panel with groups & controls
│
├── renderer/              # Preview mode (/preview route)
│   └── renderer.component.ts
│
└── shared/                # App-specific shared components
    ├── code-viewer/       # HTML/CSS/JSON viewers
    └── tab-switcher/      # Tab switcher component
```

### Routing

Two main routes (apps/boxout/src/app/app.routes.ts):

- `/design` - Main designer interface (eager loaded)
- `/preview` - Preview generated output (lazy loaded)

### Library Imports

Libraries are imported using TypeScript path mappings defined in `tsconfig.base.json`:

```typescript
import { CanvasItem, Css } from '@layout/models';
import { CanvasService, SelectionService } from '@layout/canvas';
import { SerializationService } from '@layout/serialization';
```

**Path mappings:**

- `@layout/models` → `libs/models/src/index.ts`
- `@layout/canvas` → `libs/canvas/src/index.ts`
- `@layout/serialization` → `libs/serialization/src/index.ts`

### Key Patterns

1. **Library-First Architecture**: Core functionality is extracted into reusable libraries (@layout/models, @layout/canvas, @layout/serialization). Import from these libraries using path mappings rather than relative paths.

2. **Pure Store Functions**: CanvasStore methods return new `CanvasItem[]` arrays. Services call `store.setItems()` to persist changes. Never call `setItems()` inside store methods.

3. **Service Orchestration**: Always use `CanvasService` for user actions. It controls persistence, triggers undo snapshots, and coordinates with SelectionService.

4. **Hierarchical Operations**: Store operations recursively traverse the tree structure. Use `getItemById()` to locate items, `getParentItemKey()` to find parents.

5. **Immutability**: When updating canvas items, always use `cloneDeep()` before mutations to ensure pure functions and proper change detection.

6. **Service Injection**: Canvas services (CanvasStore, CanvasService, etc.) from `@layout/canvas` are provided at the library level. App-specific services are injected at AppComponent level.

7. **Insert Positions**: When inserting items, use the `InsertPosition` enum: `INSIDE`, `BEFORE`, `AFTER`.

## Technology Stack

- **Angular 21.0.6** with standalone components
- **Nx 22.3.1** for monorepo tooling
- **PrimeNG 21.0.2** for UI components with Tailwind CSS via tailwindcss-primeui
- **RxJS 7.8** for reactive state management
- **Vitest 4.0.16** with happy-dom for unit tests
- **Playwright 1.57.0** for E2E tests
- **SortableJS** (via nxt-sortablejs) for drag-and-drop
- **PrismJS** for syntax highlighting
- **Firebase** for hosting

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

### Angular Documentation
ALways keep up to date with latest Angular best practices from https://angular.dev/ai/develop-with-ai

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
