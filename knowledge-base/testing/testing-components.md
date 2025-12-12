# Component Testing Guidelines

## Component Types

### Presentational (No Services)
- Only `@Input()` and `@Output()`
- 5-8 tests maximum
- No mocking needed

```typescript
import { render, screen } from '@testing-library/angular';

describe('ButtonComponent', () => {
  describe('WHEN user clicks button', () => {
    it('SHOULD emit click event', async () => {
      const mockClick = jest.fn();
      await render(ButtonComponent, {
        componentProperties: { onClick: mockClick }
      });

      await userEvent.setup().click(screen.getByRole('button'));

      expect(mockClick).toHaveBeenCalled();
    });
  });
});
```

### Smart Components (With Services)
- Use `componentProviders` for service fakes
- 8-10 tests maximum
- Focus on workflows

```typescript
import { provideFakeCanvasService } from '@testing/fakes/provide-fake-canvas-service';

describe('InspectorComponent', () => {
  describe('WHEN user updates width', () => {
    it('SHOULD call service update', async () => {
      const mockUpdate = jest.fn();
      await render(InspectorComponent, {
        componentProviders: [provideFakeCanvasService({ updateItem: mockUpdate })]
      });

      await userEvent.setup().type(screen.getByLabelText(/width/i), '500');

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ css: { width: '500px' } })
      );
    });
  });
});
```

## Standalone Components
✅ Use `componentProviders` and `componentImports`
❌ DON'T create TestBed modules

```typescript
await render(MyComponent, {
  componentProviders: [MyService],
  componentImports: [CommonModule]
});
```

## Testing PrimeNG
❌ Don't test PrimeNG: `component.visible = true`
✅ Test your behavior: `expect(screen.getByText(/are you sure/i)).toBeInTheDocument()`

## Testing Forms
```typescript
describe('WHEN user submits form', () => {
  it('SHOULD validate required fields', async () => {
    await render(FormComponent);

    await userEvent.setup().click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});
```

## Testing Observables
❌ Bad: `expect(component.items$).toBeDefined()`
✅ Good: Test UI effects

```typescript
it('SHOULD update list when items change', async () => {
  const store = new CanvasStore();
  await render(Component, {
    componentProviders: [{ provide: CanvasStore, useValue: store }]
  });

  store.setState({ items: [{ key: '1', label: 'Item 1' }] });

  expect(screen.getByText('Item 1')).toBeInTheDocument();
});
```

## Testing Drag & Drop
❌ Don't test SortableJS internals
✅ Test your handler

```typescript
it('SHOULD call reorder handler', () => {
  component.handleDragEnd({ oldIndex: 0, newIndex: 2 });

  expect(mockReorder).toHaveBeenCalledWith({ oldIndex: 0, newIndex: 2 });
});
```

## BDD Naming
```typescript
describe('ComponentName', () => {
  describe('WHEN component loads with no data', () => {
    it('SHOULD show empty state', ...);
  });

  describe('WHEN user clicks add button', () => {
    it('SHOULD open dialog', ...);
    it('SHOULD focus first input', ...);
  });
});
```

## Test Count Limits
- Presentational: 5-8 tests
- Smart: 8-10 tests
- Container: 3-5 tests
