# Best Practices Guide

This document outlines the coding standards, architectural patterns, and development practices for the CSS Layout Generator project.

## Table of Contents

1. [TypeScript & Angular Conventions](#typescript--angular-conventions)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Testing Standards](#testing-standards)
5. [Accessibility Requirements](#accessibility-requirements)
6. [Code Quality & Style](#code-quality--style)
7. [Service Design Principles](#service-design-principles)
8. [Performance Best Practices](#performance-best-practices)

---

## TypeScript & Angular Conventions

### Strict TypeScript Configuration

This project uses strict TypeScript settings. All code must adhere to:

- **Strict mode enabled**: `"strict": true` in tsconfig.json
- **No implicit returns**: All functions with return types must explicitly return values
- **No implicit overrides**: Use `override` keyword when overriding methods
- **No property access from index signatures**: Use explicit type definitions
- **Force consistent casing**: File names must match across operating systems

### Naming Conventions

**Selectors** (enforced by ESLint):
- Component selectors: `kebab-case` with `app-` prefix
  - Example: `app-canvas-item`, `app-setting-group`
- Directive selectors: `camelCase` with `app` prefix
  - Example: `appEditableContent`, `appUndoRedo`

**Files and Classes**:
- Component files: `*.component.ts` (e.g., `canvas.component.ts`)
- Service files: `*.service.ts` (e.g., `canvas.service.ts`)
- Store files: `*.store.ts` (e.g., `canvas.store.ts`)
- Model files: `*.model.ts` (e.g., `canvas-item.model.ts`)
- Directive files: `*.directive.ts` (e.g., `undo-redo.directive.ts`)

**Variables and Functions**:
- Use `camelCase` for variables, functions, and methods
- Use `PascalCase` for classes, interfaces, types, and enums
- Prefix private methods with `private` access modifier
- Prefix protected methods/properties with `protected` when intended for inheritance

---

## Component Architecture

### Standalone Components

**All components must be standalone** (Angular 14+ pattern):

```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, OtherComponent],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {}
```

- Do NOT use `@NgModule` declarations
- Import dependencies directly in the `imports` array
- ESLint rule `@angular-eslint/prefer-standalone` is disabled, but standalone is still the standard

### Change Detection Strategy

**Use `OnPush` change detection for performance-critical components**:

```typescript
@Component({
  selector: 'app-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

Current components using OnPush:
- `ContainerComponent` (canvas-items/container)
- `CssPrismComponent` (renderer)
- `ThemeConfiguratorComponent`
- `PresetContainerComponent`

**When to use OnPush**:
- Components that render large lists or trees (like canvas items)
- Components with frequent re-renders
- Leaf components that only depend on inputs
- Components that use observables with async pipe

### Template Syntax

**Use modern Angular control flow** (`@if`, `@for`, `@switch`):

```html
<!-- ✅ GOOD: Modern control flow -->
@if (condition) {
  <div>Content</div>
}

@for (item of items; track item.key) {
  <app-item [data]="item"></app-item>
}

<!-- ❌ BAD: Legacy structural directives -->
<div *ngIf="condition">Content</div>
<app-item *ngFor="let item of items; trackBy: trackByKey" [data]="item"></app-item>
```

**Always use track expressions in `@for` loops**:
- Prefer tracking by unique identifiers (e.g., `track item.key`)
- This project uses 8-character unique keys for all `CanvasItem` objects

### Dependency Injection

**Use modern `inject()` function** instead of constructor injection:

```typescript
// ✅ GOOD: Modern inject()
export class ExampleComponent {
  private canvasService = inject(CanvasService);
  protected store = inject(CanvasStore);
}

// ❌ AVOID: Constructor injection (only when necessary)
constructor(private canvasService: CanvasService) {}
```

**Service Scoping**:
- Core services are provided at `AppComponent` level (see app.component.ts:19)
- Services with `@Injectable({providedIn: 'root'})` are singletons (like CanvasStore)
- Avoid providing services at component level unless you need isolated instances

### Signals vs. RxJS

**Use Angular signals for local component state**:

```typescript
// ✅ GOOD: Signals for component state
protected _collapsed = signal(false);
protected isCollapsed = this._collapsed.asReadonly();

constructor() {
  effect(() => {
    this._collapsed.set(this.collapsed());
  });
}
```

**Use RxJS for**:
- Cross-component state management (via Store pattern)
- Async operations and HTTP requests
- Complex event streams and transformations

**Current pattern**:
- Signals are used sparingly (setting-group.component.ts, pan-zoom.service.ts)
- Primary state management is RxJS-based (CanvasStore with BehaviorSubject)

### Input/Output Patterns

**Prefer signal inputs for new components** (Angular 17.1+):

```typescript
// ✅ GOOD: Signal inputs
export class SettingGroupComponent {
  header = input<string>('');
  collapsed = input<boolean>(false);
}
```

**Use decorator-based inputs when**:
- Working with existing components (60 occurrences across 23 files)
- Need `ngOnChanges` lifecycle hook
- Two-way binding with `[(value)]` syntax

**Always use `EventEmitter` for outputs**:

```typescript
@Output() clicked = new EventEmitter<CanvasItemMouseEvent>();
@Output() childTextContentChanged = new EventEmitter<{key: string, content: string}>();
```

---

## State Management

### Store Pattern

**Custom RxJS-based Store** (`src/app/core/store/store.ts`):

```typescript
export class Store<T> {
  state: Observable<Readonly<T>>;
  private state$: BehaviorSubject<Readonly<T>>;

  protected getState(): Readonly<T> { /* ... */ }
  protected setState(state: Readonly<T>): void { /* ... */ }
}
```

**Key principles**:
1. **Immutability**: State is `Readonly<T>` - always clone before mutating
2. **Observable pattern**: Expose `state` as Observable, keep BehaviorSubject private
3. **Single source of truth**: CanvasStore is the authoritative state container

### CanvasStore Usage

**Reading state**:

```typescript
// Via observable (reactive)
this.canvasStore.state.subscribe(state => {
  console.log(state.canvasItems);
});

// Direct access (synchronous)
const items = this.canvasStore.items; // getter property
const item = this.canvasStore.getItemById(undefined, 'someKey');
```

**Updating state**:

```typescript
// ✅ GOOD: Clone before mutating
import cloneDeep from 'lodash.clonedeep';

const items = cloneDeep(this.canvasStore.items);
const item = this.canvasStore.getItemById(items, key);
if (item) {
  item.css.display = 'flex';
  this.canvasService.setItems(items); // This triggers state update
}

// ❌ BAD: Direct mutation
const item = this.canvasStore.getItemById(undefined, key);
item.css.display = 'flex'; // Mutates readonly state!
```

### CanvasService vs CanvasStore

**Separation of concerns**:

- **CanvasStore**: Pure state container
  - `getItemById()`, `insertItem()`, `getParentItemKey()`
  - Low-level tree operations
  - No business logic

- **CanvasService**: Orchestration layer
  - Coordinates between Store, UndoRedoService, SelectionService
  - Business logic and validation
  - Higher-level operations (duplicate, delete, move)
  - **Always use CanvasService for user actions**

**Example**:

```typescript
// ✅ GOOD: Use CanvasService for user actions
this.canvasService.setItems(newItems, {pushToUndoStack: true});
this.canvasService.duplicateItem(itemKey);
this.canvasService.deleteItem(itemKey);

// ❌ BAD: Direct CanvasStore manipulation (skips undo/redo)
this.canvasStore.setItems(newItems);
this.canvasStore.insertItem(key, item, InsertPosition.AFTER);
```

### Undo/Redo Integration

**UndoRedoService** (`src/app/core/undo-redo/undo-redo.service.ts`):

- Maintains undo/redo stacks with deep clones
- **250ms debounce** on `takeSnapshot()` to batch rapid changes
- Emits `undoRedoExecuted$` observable when undo/redo occurs

**Key rules**:
1. Always call `canvasService.setItems()` with `pushToUndoStack: true` (default) for user actions
2. Use `pushToUndoStack: false` only for programmatic updates (e.g., undo/redo itself)
3. Snapshot is automatically taken when `pushToUndoStack: true`

---

## Testing Standards

### Unit Testing with Jest

**Test file naming**: `*.spec.ts` co-located with source files

**Test structure** (following canvas.store.spec.ts pattern):

```typescript
describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceName]
    });
    service = TestBed.inject(ServiceName);
  });

  describe('methodName', () => {
    it('should handle basic case', () => {
      // Arrange
      const input = {...};

      // Act
      const result = service.methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle edge case', () => { /* ... */ });
  });
});
```

**Testing principles**:
1. **Nested describe blocks**: Group tests by method/feature
2. **Clear test names**: Use "should" statements describing behavior
3. **AAA pattern**: Arrange, Act, Assert
4. **Test edge cases**: Undefined inputs, empty arrays, deeply nested structures
5. **Mock dependencies**: Use Jest spies when needed

**Coverage expectations**:
- Core services and stores: Comprehensive coverage (see canvas.store.spec.ts)
- Utilities and helpers: 100% coverage
- Components: Focus on business logic, not template rendering

### E2E Testing with Cypress

**Commands**:
- `nx e2e` - Run E2E tests
- `nx open-cypress` - Open Cypress UI

**Best practices**:
- Test critical user flows (insert, edit, delete, undo/redo)
- Use data attributes for test selectors (e.g., `data-testid`)
- Avoid testing implementation details

---

## Accessibility Requirements

### WCAG AA Compliance

All components must meet **WCAG 2.1 Level AA** standards.

### Current Accessibility Status

**Limited aria usage** (2 occurrences in 1 file):
- Accessibility needs improvement across the codebase
- Focus on semantic HTML first, ARIA attributes second

### Accessibility Checklist

**For all interactive elements**:
- [ ] Keyboard navigation support (tab, enter, escape)
- [ ] Visible focus indicators
- [ ] Appropriate ARIA roles (only when semantic HTML is insufficient)
- [ ] ARIA labels for icon-only buttons
- [ ] Color contrast meets 4.5:1 minimum (normal text) or 3:1 (large text)

**For forms**:
- [ ] Proper label associations
- [ ] Error messages linked with `aria-describedby`
- [ ] Required fields marked with `aria-required`

**For dynamic content**:
- [ ] Live regions for notifications (`aria-live`)
- [ ] Focus management for modals/dialogs
- [ ] Announce state changes to screen readers

**Special considerations for canvas**:
- Canvas elements use `tabindex="-1"` for keyboard event handling (container.component.ts:21)
- Ensure layer tree provides accessible alternative to visual canvas
- Provide keyboard shortcuts for common operations

---

## Code Quality & Style

### ESLint Configuration

**Rules enforced** (`.eslintrc.json`):
- Angular-specific rules via `@nx/angular` and `@angular-eslint`
- Directive/component selector conventions
- Inline template processing for `@angular-eslint`

**Custom rules**:
- `@angular-eslint/prefer-standalone: "off"` (but standalone is still the standard)

### SCSS Styling

**Default style format**: SCSS (not CSS)

**Best practices**:
- Use Tailwind utility classes where possible
- SCSS only for complex component-specific styles
- Leverage PrimeNG theming via `tailwindcss-primeui`

**Tailwind configuration**:
- Tailwind v4 (recently upgraded, see git history)
- Custom theme tokens in `tailwind.config.ts`

### Import Organization

**Order of imports**:
1. Angular core imports
2. Angular common/forms
3. Third-party libraries (PrimeNG, RxJS, lodash)
4. Internal app imports (services, models, components)

**Example**:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';
import { CanvasStore } from './core/store/canvas.store';
import { CanvasItem } from './core/models/canvas-item.model';
```

---

## Service Design Principles

### Single Responsibility

Each service has a focused purpose:

| Service | Responsibility |
|---------|---------------|
| `CanvasStore` | State container for canvas items |
| `CanvasService` | Orchestration and business logic |
| `SelectionService` | Track selected/hovered items |
| `UndoRedoService` | Undo/redo stack management |
| `DragDropService` | SortableJS configuration |
| `SerializationService` | Export to HTML/CSS/JSON |
| `DataService` | Mock data loading |
| `AppStateService` | UI state (panels, tabs) |

### Dependency Hierarchy

**Layered architecture**:

```
Components
    ↓
CanvasService (orchestration)
    ↓
CanvasStore ← UndoRedoService
    ↓           ↓
 SelectionService, DragDropService
```

**Rules**:
- Services can depend on stores
- Services can depend on other services at same level or below
- Stores should not depend on services (except utility services)
- Components should primarily interact with services, not stores directly

### Reactive Services

**Observable naming convention**:
- Observables end with `$`: `items$`, `selectedItem$`, `undoRedoExecuted$`
- BehaviorSubjects are private: `private items$`
- Expose as public observables: `public items = this.items$.asObservable()`

**Example pattern**:

```typescript
export class SelectionService {
  private selectedKey$ = new BehaviorSubject<string | undefined>(undefined);
  public selectedKey = this.selectedKey$.asObservable();

  setSelectedKey(key: string | undefined): void {
    this.selectedKey$.next(key);
  }
}
```

---

## Performance Best Practices

### Change Detection Optimization

1. **Use OnPush change detection** for list/tree components
2. **Use `trackBy` in `@for` loops** (always use `track item.key`)
3. **Avoid function calls in templates** - use getters or properties
4. **Use async pipe** for observable subscriptions (auto-unsubscribe)

### Immutability

**Why it matters**:
- OnPush change detection relies on reference equality
- Prevents accidental mutations
- Makes state changes traceable

**Tools**:
- TypeScript `Readonly<T>` type
- `cloneDeep` from lodash for deep cloning
- Spread operator for shallow clones

**Example**:

```typescript
// Deep clone for nested structures
const items = cloneDeep(this.canvasStore.items);

// Shallow clone for simple objects
const newState = {...oldState, canvasItems: [...items]};
```

### Bundle Size

**Current configuration** (angular.json):
- Initial bundle: 2MB max
- Component styles: 2MB max (relaxed for CSS generation features)

**Best practices**:
- Lazy load routes (`/preview` and `/learn` are lazy loaded)
- Use Nx build cache for faster rebuilds
- Tree-shakeable imports (use named imports, not `import *`)

---

## Architecture-Specific Patterns

### Hierarchical Tree Operations

**Recursive tree traversal pattern** (used throughout CanvasStore):

```typescript
getItemById(items: CanvasItem[], key: string): CanvasItem | undefined {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }

    // Recursive descent into children
    const childItem = this.getItemById(item.children || [], key);
    if (childItem) {
      return childItem;
    }
  }
  return undefined;
}
```

**Insertion positions** (`InsertPosition` enum):
- `INSIDE`: Add as last child
- `BEFORE`: Insert as previous sibling
- `AFTER`: Insert as next sibling

### CanvasItem Model

**Core data structure** (`src/app/core/models/canvas-item.model.ts`):

```typescript
interface CanvasItem {
  itemType: CanvasItemType;  // CONTAINER, FLEX_CONTAINER, TEXT, etc.
  key?: string;              // Unique 8-character identifier
  label?: string;            // Display name in layers panel
  content?: string;          // For TEXT items
  children?: CanvasItem[];   // Nested hierarchy
  css?: Css;                 // CSS properties object
  editable?: boolean;        // Inline editing allowed
}
```

**Key conventions**:
- Keys are 8 characters, letters only (A-Za-z)
- Generated by `CanvasStore.generateUniqueId()`
- Root wrapper uses constant `CANVAS_WRAPPER_ID` from `src/app/core/constants`

### Serialization

**Export formats** (via `SerializationService`):
- HTML: Semantic markup
- CSS: Class-based or inline styles
- JSON: CanvasItem structure for persistence

**Serializers location**: `src/app/core/serialization/serializers/`

---

## Development Workflow

### Common Commands

```bash
# Development
nx serve              # Start dev server (port 4300)
nx build              # Production build
nx build --watch --configuration development  # Watch mode

# Testing
nx test               # Run all Jest tests
nx test --watch       # Watch mode
nx test --testFile=path/to/file.spec.ts  # Single file
nx e2e                # Cypress E2E tests

# Code Quality
nx lint               # ESLint on src/
```

### Git Workflow

**Commit conventions**:
- Use `npm run commit` for guided Conventional Commits
- Do NOT commit automatically - wait for explicit user instruction
- Pre-commit hooks may modify files (use `git commit --amend` if safe)

### Angular Version

**Current**: Angular 20.3.9

**Note**: Angular 21 is available but not yet supported by Nx 22.1.1. Wait for Nx to release official Angular 21 support before upgrading.

---

## Questions or Clarifications?

When in doubt:
1. Check existing code patterns in similar components
2. Refer to `.ai/llms-full.txt` for Angular framework documentation
3. Review CLAUDE.md for project-specific architecture decisions
4. Ask for clarification rather than guessing conventions

This is a living document - update it when new patterns emerge or conventions change.