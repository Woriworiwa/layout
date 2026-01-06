# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a low-code CSS layout generator built with Angular 21, designed to simplify creating responsive layouts using Grid and Flexbox. It's an Nx monorepo with a visual canvas-based editor that generates CSS, HTML, and JSON output.

**Note:** Use Nx MCP tools (`nx_workspace`, `nx_project_details`) to discover available commands and targets dynamically.

## Quick Reference

**Adding functionality?**
- Canvas interaction/rendering → `@layout/canvas`
- Data models/types → `@layout/models`
- Export/serialization → `@layout/serialization`
- Preset templates → `@layout/presets`
- Shared UI components → `@layout/shared`
- Renderer/preview → `@layout/renderer`
- App-specific features → `apps/boxout/src/app/core`

**Modifying canvas state?**
- User action → `CanvasService` method → `CanvasStore` → Service calls `store.setItems()`
- ✓ Always use `CanvasService` for user actions
- ✗ Never call `store.setItems()` from store methods
- ✗ Never call store methods directly from components

**Common workflows:** See Common Workflows section below.

## Architecture

This is an Nx monorepo with a **library-first architecture**. Core functionality is extracted into reusable libraries.

### Library Structure

**@layout/models** (`libs/models/`)
- Core data models and type definitions
- `CanvasItem` model, CSS interfaces, enums, and utilities

**@layout/canvas** (`libs/canvas/`)
- Canvas rendering, state management (CanvasStore, CanvasService)
- Canvas components (Container, Text, AiWrapper)
- Services: Selection, UndoRedo, CopyPaste, PanZoom, ContextMenu, MetaLayer, DragDrop
- Canvas toolbar, selection UI, and directives

**@layout/serialization** (`libs/serialization/`)
- Export functionality for HTML, CSS, and JSON
- Serializers: HtmlSerializer, CssStyleSerializer, CssClassSerializer, JsonSerializer

**@layout/presets** (`libs/presets/`)
- Preset components, service, and data
- Categorized layout presets (responsive, grid, flexbox)

**@layout/renderer** (`libs/renderer/`)
- Renderer component for preview mode
- Resizable directive

**@layout/shared** (`libs/shared/`)
- Shared UI components (code viewers, tab switcher)
- Store base class for RxJS state management
- Reusable across applications

**Provider Pattern**: Each library exports a provider function (`provideCanvas()`, `providePresets()`, etc.) that registers required services. Check `*-providers.ts` files for dependency requirements.

### Library Dependencies

```
models (no dependencies)
  ↓
serialization, shared → models
  ↓
canvas → models, shared, serialization
  ↓
presets → models, shared, serialization
  ↓
renderer → (check renderer-providers.ts)
```

**Critical**: Avoid circular dependencies. Always import from libraries with fewer dependencies.

### Applications

**boxout** (`apps/boxout/`)
- Main designer application
- App-specific services (AI generation, theme, app state)
- Designer UI (properties panel, layers panel, inspector, header)
- Routing: `/design` (main editor), `/preview` (lazy loaded preview)

### State Management

The application uses a custom RxJS-based state management pattern with **pure store functions and service orchestration**:

**Store Pattern (Pure Functions):**

- **Store base class** (`@layout/shared`): Provides `BehaviorSubject`-based state with `getState()` and `setState()` methods
- **CanvasStore** (`@layout/canvas`): Pure data layer managing the hierarchical tree of `CanvasItem` objects
  - All operations return new `CanvasItem[]` arrays without side effects
  - Methods like `insertItem()`, `deleteItem()`, `updateItemCss()` are pure functions
  - Only `setItems()` mutates state

**Service Pattern (Orchestration):**

- **CanvasService** (`@layout/canvas`) controls when state persists by calling `store.setItems()`
- Services coordinate multiple concerns (undo/redo, selection, validation)
- State flows: Component → Service → Store → Component

**Critical Pattern**: Store methods are pure functions. Services control all persistence and side effects.

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
├── canvas/                  # @layout/canvas - Canvas functionality
│   ├── canvas.store.ts     # Pure data operations
│   ├── canvas.service.ts   # Orchestration layer
│   └── canvas-providers.ts # Provider function with dependencies
├── serialization/           # @layout/serialization - Export functionality
├── presets/                 # @layout/presets - Preset components & data
├── renderer/                # @layout/renderer - Renderer component
└── shared/                  # @layout/shared - Shared UI components

apps/
└── boxout/                  # Main designer application
    └── src/app/
        ├── core/           # App services (AI, theme, state)
        ├── designer/       # Designer UI (properties, layers, inspector)
        ├── header/         # App header with preview
        └── app.routes.ts   # Routing config
```

### Library Imports

Libraries are imported using TypeScript path mappings defined in `tsconfig.base.json`:

```typescript
import { CanvasItem, Css } from '@layout/models';
import { CanvasService, SelectionService } from '@layout/canvas';
import { SerializationService } from '@layout/serialization';
import { PresetService } from '@layout/presets';
import { RendererComponent } from '@layout/renderer';
import { CodeViewerComponent } from '@layout/shared';
```

**Path mappings:**
- `@layout/models`, `@layout/canvas`, `@layout/serialization`
- `@layout/presets`, `@layout/renderer`, `@layout/shared`

### Critical Anti-Patterns

❌ **DO NOT** call `store.setItems()` inside store methods (breaks pure function pattern)
❌ **DO NOT** call CanvasStore methods directly from components (bypasses undo/redo)
❌ **DO NOT** mutate CanvasItem objects directly (use `cloneDeep()` first)
❌ **DO NOT** import from relative paths across libraries (use `@layout/*` imports)
❌ **DO NOT** create circular dependencies between libraries
❌ **DO NOT** add app-specific logic to libraries (keep libraries reusable)

### Key Patterns

1. **Library-First Architecture**: Core functionality is extracted into reusable libraries. Import using path mappings (`@layout/*`) rather than relative paths.

2. **Provider Functions**: Each library exports a provider function (`provideCanvas()`, `providePresets()`, etc.) that registers services with documented dependencies. Check provider files for required dependencies.

3. **Pure Store Functions**: CanvasStore methods return new `CanvasItem[]` arrays. Services call `store.setItems()` to persist changes. Never call `setItems()` inside store methods.

4. **Service Orchestration**: Always use `CanvasService` for user actions. It controls persistence, triggers undo snapshots, and coordinates with SelectionService.

5. **Hierarchical Operations**: Store operations recursively traverse the tree structure. Use `getItemById()` to locate items, `getParentItemKey()` to find parents.

6. **Immutability**: When updating canvas items, always use `cloneDeep()` before mutations to ensure pure functions and proper change detection.

## Common Workflows

### Adding a New Canvas Item Type
1. Add enum to `@layout/models/canvas-item-type.enum.ts`
2. Create component in `@layout/canvas/canvas-items/`
3. Update `CanvasStore` methods to handle new type
4. Add to `container.component.html` template

### Adding a New CSS Property
1. Add to interface in `@layout/models/css-interfaces/`
2. Add to `Properties` enum in `@layout/models/css-enums/`
3. Add UI control in `apps/boxout/src/app/properties-panel/`
4. Update serializers if needed

### Adding a New Preset
1. Create preset data in `@layout/presets/data/`
2. Add to preset categories in `PresetService`
3. Update preset panel UI if needed

### Modifying Canvas State
1. Add method to `CanvasStore` (pure function, returns new array)
2. Add orchestration method to `CanvasService` that:
   - Calls store method
   - Calls `store.setItems()` with result
   - Triggers `undoRedoService.takeSnapshot()`
3. Call `CanvasService` method from component

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

### Angular & TypeScript Guidelines

Follow Angular best practices from https://angular.dev/ai/develop-with-ai with these project-specific requirements:

**Project-Specific Rules:**
- Use `input()` and `output()` functions (not decorators)
- Use host object in `@Component` decorator (not `@HostBinding`/`@HostListener`)
- Use native control flow (`@if`, `@for`, `@switch`) not structural directives
- Use `class` and `style` bindings (not `ngClass`/`ngStyle`)
- Use `inject()` function (not constructor injection)
- Use signals for state, `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- SCSS is the default style format
- Strict TypeScript, avoid `any` type

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
