# Store vs Service Pattern

## Library Location
This pattern is implemented in the `@layout/canvas` library. Both `CanvasStore` and `CanvasService` are exported from `libs/canvas/src/index.ts`.

## Core Principle
**Store methods are PURE FUNCTIONS. Service controls all persistence and side effects.**

## Responsibilities

### Store (Data Layer)
**Pure functions returning new state - ZERO side effects**

- **Pure data operations** - Return `CanvasItem[]`, never call `setState()`
- Tree traversal (`getItemById()`, `getParentItemKey()`)
- Data queries and transformations
- Key generation utilities
- State getter/setter (only `setItems()` mutates state)

### Service (Orchestration Layer)
**Controls when/how state changes + all side effects**

- Calls store methods to get transformed data
- **Controls persistence** - Calls `store.setItems()` to commit changes
- Triggers undo/redo snapshots
- Coordinates multiple services (selection, presets)
- Business validation and error handling

## Rules

### ✅ DO

**Store:**
- Return new `CanvasItem[]` arrays from operations
- Keep all methods pure (same input = same output)
- Only `setItems()` should mutate the state BehaviorSubject
- Make operations testable without TestBed

**Service:**
- Call `store.setItems(result)` to persist changes
- Batch multiple store operations before persisting
- Always trigger undo snapshot after persistence
- Use service layer for ALL user actions

### ❌ DON'T

**Store:**
- ❌ NEVER call `setState()` or `setItems()` inside operation methods
- ❌ Don't inject services (UndoRedoService, SelectionService, etc.)
- ❌ Don't trigger any side effects

**Service:**
- ❌ Don't let components call `CanvasStore` directly
- ❌ Don't skip `setItems()` after store operations
- ❌ Don't skip undo tracking on user actions

## Pattern Examples

**Importing from libraries:**
```typescript
import { CanvasItem } from '@layout/models';
import { CanvasService, CanvasStore, InsertPosition } from '@layout/canvas';
```

**Store operation:**
```typescript
// Store: Returns mutated items, no setState
insertItem(key: string, item: CanvasItem, position: InsertPosition): CanvasItem[] {
  const items = cloneDeep(this.items);
  // ... mutation logic
  return items;
}
```

**Service operation:**
```typescript
// Service: Controls persistence + side effects
insertItem(key: string, item: CanvasItem, position: InsertPosition) {
  const updatedItems = this.store.insertItem(key, item, position);
  this.store.setItems(updatedItems);  // Service controls when
  this.selectionService.select(item.key);  // Coordinate services
  this.undoRedoService.takeSnapshot();  // Trigger side effects
}
```
