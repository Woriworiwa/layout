# Testing Store<T> Pattern

## Core Principle
**Use real stores with test data, not mocks.**

## Library Imports
```typescript
import { CanvasStore, CanvasService } from '@layout/canvas';
import { CanvasItem } from '@layout/models';
```

## Testing Stores Directly
Rarely needed - stores are simple wrappers. Test services that use them instead.

```typescript
import { CanvasStore } from '@layout/canvas';

describe('CanvasStore', () => {
  let store: CanvasStore;

  beforeEach(() => {
    store = new CanvasStore(); // No TestBed needed
  });

  describe('WHEN setting state', () => {
    it('SHOULD update state', () => {
      const items = [{ key: '123', label: 'Test', itemType: 'FLEX' }];

      store.setState({ items });

      expect(store.getState().items).toEqual(items);
    });

    it('SHOULD emit to observable', (done) => {
      store.state$.subscribe(state => {
        if (state.items.length > 0) {
          expect(state.items).toHaveLength(1);
          done();
        }
      });

      store.setState({ items: [{ key: '123' }] });
    });
  });
});
```

## Testing Services with Stores
**Inject real stores, set initial state, test behavior.**

```typescript
import { TestBed } from '@angular/core/testing';
import { CanvasStore, CanvasService } from '@layout/canvas';

describe('CanvasService', () => {
  let service: CanvasService;
  let store: CanvasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasService, CanvasStore]
    });
    service = TestBed.inject(CanvasService);
    store = TestBed.inject(CanvasStore);

    // Set initial state
    store.setState({ items: [{ key: '123', label: 'Item 1' }] });
  });

  describe('WHEN removing item', () => {
    it('SHOULD update store', () => {
      service.removeItem('123');

      expect(store.getState().items).toHaveLength(0);
    });
  });
});
```

## Testing Components with Stores
```typescript
import { render, screen } from '@testing-library/angular';
import { CanvasStore } from '@layout/canvas';

describe('ItemListComponent', () => {
  describe('WHEN store has items', () => {
    it('SHOULD display all items', async () => {
      const store = new CanvasStore();
      store.setState({
        items: [
          { key: '1', label: 'Item 1' },
          { key: '2', label: 'Item 2' }
        ]
      });

      await render(ItemListComponent, {
        componentProviders: [{ provide: CanvasStore, useValue: store }]
      });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('WHEN store updates', () => {
    it('SHOULD reflect in UI', async () => {
      const store = new CanvasStore();
      store.setState({ items: [] });

      await render(ItemListComponent, {
        componentProviders: [{ provide: CanvasStore, useValue: store }]
      });

      // Update store
      store.setState({ items: [{ key: '1', label: 'New Item' }] });

      // UI updates
      expect(screen.getByText('New Item')).toBeInTheDocument();
    });
  });
});
```

## Reusable Fake Stores
Create in `src/testing/fakes/`:

```typescript
// provide-fake-canvas-store.ts
export function provideFakeCanvasStore(items: CanvasItem[] = []) {
  const store = new CanvasStore();
  store.setState({ items });
  return { provide: CanvasStore, useValue: store };
}

// Usage:
await render(Component, {
  componentProviders: [
    provideFakeCanvasStore([{ key: '1', label: 'Test' }])
  ]
});
```

## Reusable Test Data
```typescript
// fake-canvas-items.ts
export const FAKE_CONTAINER: CanvasItem = {
  key: 'container-1',
  label: 'Test Container',
  itemType: 'FLEX',
  children: [],
  css: { display: 'flex' }
};

export const FAKE_NESTED = {
  key: 'root',
  children: [FAKE_CONTAINER]
};

// Usage:
store.setState({ items: [FAKE_NESTED] });
```

## Testing Multiple Services with Shared Store
```typescript
describe('Service coordination', () => {
  let canvasService: CanvasService;
  let selectionService: SelectionService;
  let store: CanvasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasService, SelectionService, CanvasStore]
    });
    canvasService = TestBed.inject(CanvasService);
    selectionService = TestBed.inject(SelectionService);
    store = TestBed.inject(CanvasStore);
  });

  it('SHOULD coordinate between services', () => {
    store.setState({ items: [{ key: '1' }] });
    selectionService.select('1');

    canvasService.deleteItem('1');

    expect(selectionService.getSelectedKey()).toBeNull();
    expect(store.getState().items).toHaveLength(0);
  });
});
```

## Anti-Patterns
❌ **Mocking stores:**
```typescript
const mockStore = {
  getState: jest.fn(),
  setState: jest.fn()
};
// Loses type safety, real behavior, integration value
```

✅ **Use real stores:**
```typescript
const store = new CanvasStore();
store.setState({ items: testData });
```

## Test Count
- Store classes: 3-5 tests (rarely needed)
- Services using stores: 8-10 tests
- Components using stores: 5-8 tests
