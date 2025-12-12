# Core Testing Guidelines

## Tech Stack
- **Testing Framework**: Jest 29 with `@happy-dom/jest-environment`
- **Angular**: Angular 20 standalone components (no NgModules)
- **Testing Library**: Angular Testing Library
- **State Management**: Custom `Store<T>` pattern (src/app/core/store/store.ts)
- **Commands**: `nx test`, `nx test --watch`, `nx test --testFile=path/to/file.spec.ts`

## Test Strategy
- Focus on **user behavior**, not implementation
- **Maximum 5-10 tests per file**
- Use **BDD naming**: `describe('WHEN user clicks', () => { it('SHOULD save', ...`
- Group by user scenarios, not methods

### What to Test
**DO Test:**
- User interactions and outputs
- Rendered content
- Observable effects on UI
- Error states

**DON'T Test:**
- Framework internals (DI, lifecycle, change detection)
- Third-party libraries (PrimeNG, SortableJS)
- Private methods
- That observables are observables
- TypeScript types

### Mocking Strategy
**DO Mock:**
- External APIs
- Browser APIs (localStorage, etc.)
- Complex services (use reusable fakes)

**DON'T Mock:**
- Angular framework
- Your models/interfaces
- Utility functions
- `Store<T>` (use real with test data)

## Example Structure
```typescript
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

describe('ComponentName', () => {
  describe('WHEN user clicks submit', () => {
    it('SHOULD emit save event', async () => {
      const mockSave = jest.fn();
      await render(Component, {
        componentProperties: { onSave: mockSave }
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(mockSave).toHaveBeenCalled();
    });
  });
});
```

## Anti-Patterns
❌ `expect(component).toBeTruthy()` - tests framework
❌ `expect(component.loading).toBe(true)` - tests internal state
❌ `component.dialogVisible = true` - tests third-party library
✅ `expect(screen.getByText(/are you sure/i)).toBeInTheDocument()` - tests user experience

## Reusable Fakes
Create in `src/testing/fakes/`:
```typescript
// provide-fake-canvas-store.ts
export function provideFakeCanvasStore(items: CanvasItem[] = []) {
  const store = new CanvasStore();
  store.setState({ items });
  return { provide: CanvasStore, useValue: store };
}
```
