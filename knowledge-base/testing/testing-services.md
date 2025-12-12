# Service Testing Guidelines

## Service Types

### Orchestration Services (CanvasService, SelectionService)
Coordinate stores and business logic. **Primary testing focus.**

```typescript
import { TestBed } from '@angular/core/testing';

describe('CanvasService', () => {
  let service: CanvasService;
  let store: CanvasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasService, CanvasStore, UndoRedoService]
    });
    service = TestBed.inject(CanvasService);
    store = TestBed.inject(CanvasStore);
  });

  describe('WHEN adding item', () => {
    it('SHOULD update store', () => {
      service.addItem(newItem, 'INSIDE', 'parent-key');

      expect(store.getState().items).toContainEqual(
        expect.objectContaining({ key: '123' })
      );
    });

    it('SHOULD push to undo stack', () => {
      const spy = jest.spyOn(undoRedoService, 'takeSnapshot');

      service.addItem(newItem, 'INSIDE', 'parent-key');

      expect(spy).toHaveBeenCalled();
    });
  });
});
```

**Key patterns:**
- Use **real stores**, not mocks
- Set initial state in `beforeEach`
- Test observable outputs with subscriptions
- Maximum 8-10 tests

### Utility Services (SerializationService)
Pure functions. Simple input/output tests.

```typescript
describe('SerializationService', () => {
  let service: SerializationService;

  beforeEach(() => {
    service = new SerializationService(); // No TestBed needed
  });

  describe('WHEN converting to HTML', () => {
    it('SHOULD generate valid structure', () => {
      const items = [{ key: '1', itemType: 'CONTAINER', css: { width: '500px' } }];

      const html = service.toHTML(items);

      expect(html).toContain('<div');
      expect(html).toContain('width: 500px');
    });
  });
});
```

**Key patterns:**
- Instantiate directly (no TestBed)
- Focus on transformations
- Maximum 5-8 tests

## Testing Observables
❌ Bad: `expect(service.items$).toBeDefined()`
✅ Good: Test behavior

```typescript
it('SHOULD emit updated items', (done) => {
  service.items$.subscribe(items => {
    expect(items).toHaveLength(1);
    done();
  });

  store.setState({ items: [{ key: '123' }] });
});

// Or with firstValueFrom
it('SHOULD emit current items', async () => {
  store.setState({ items: [{ key: '123' }] });

  const items = await firstValueFrom(service.items$);

  expect(items).toHaveLength(1);
});
```

## Mocking Dependencies
**Mock external services:**
- HTTP calls
- Browser APIs
- Third-party libraries

**Don't mock:**
- Your own stores
- Utility services
- Angular services

```typescript
describe('DataService', () => {
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = { get: jest.fn(), post: jest.fn() } as any;
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });
  });

  it('SHOULD fetch user', async () => {
    httpMock.get.mockReturnValue(of({ id: 1, name: 'John' }));

    const user = await firstValueFrom(service.getUser(1));

    expect(user).toEqual({ id: 1, name: 'John' });
  });
});
```

## Service Coordination
```typescript
describe('WHEN deleting selected item', () => {
  it('SHOULD clear selection and update store', () => {
    store.setState({ items: [item] });
    selectionService.select('123');

    service.deleteItem('123');

    expect(store.getState().items).toHaveLength(0);
    expect(selectionService.getSelectedKey()).toBeNull();
  });
});
```

## Test Count Guidelines
- Orchestration services: 8-10 tests
- Utility services: 5-8 tests
- API services: 6-8 tests
