# E2E Testing with Playwright

## Overview
- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model (POM)
- **Browser**: Chromium only
- **Location**: `apps/boxout-e2e/`
- **Config**: `apps/boxout-e2e/playwright.config.ts`

## Test Strategy

### What to Test (E2E)
- Complete user workflows across pages (create → edit → export)
- Navigation and routing between /design, /preview, /learn
- Data persistence (localStorage across page reloads)
- Keyboard shortcuts and interactions
- Drag-and-drop operations

### What NOT to Test (Use Vitest)
- Unit-level logic
- Component internals
- CSS styling details
- Third-party library behavior

### Test Limits
- **Maximum 8-12 scenarios per feature file**
- Focus on critical paths, not edge cases

## Current Structure
```
apps/boxout-e2e/src/
├── tests/
│   ├── app.spec.ts              # Basic app smoke tests
│   └── preset-insertion.spec.ts # Preset drag and drop workflows
└── page-objects/
    ├── app.page.ts              # App-level page
    ├── designer.page.ts         # Main designer page
    └── components/
        ├── canvas.component.ts  # Canvas component
        └── presets-panel.component.ts # Presets panel
```

## Page Object Model

### Structure
- **Page Objects** - Represent pages/routes (designer.page.ts)
- **Component Objects** - Represent reusable UI components (canvas.component.ts, presets-panel.component.ts)

### Why?
- Encapsulate locators and actions in one place
- Tests remain readable when UI changes
- Reduce duplication across test specs

### Example Usage
```typescript
test.describe('Feature', () => {
  let designer: DesignerPage;

  test.beforeEach(async ({ page }) => {
    designer = new DesignerPage(page);
    await designer.goto();
    await designer.clearCanvas();  // Isolated tests
  });

  test('SHOULD do something', async () => {
    const preset = await designer.presets.dragPreset('text');
    await preset.dragTo(await designer.canvas.getLocator());

    expect(await designer.canvas.hasItem('Text')).toBe(true);
  });
});
```

## Locator Strategy

**Priority order:**
1. **Test ID**: `page.getByTestId('canvas-component')` (most stable)
2. **Data attributes**: `page.locator('[data-label="Item"]')` (semantic)
3. **Role**: `page.getByRole('button', { name: 'Save' })` (accessible)
4. **Label**: `page.getByLabel('Width')` (forms)

**Never use:**
- CSS classes (`.btn-primary`)
- XPath (`//div[@class='...']`)
- nth-child selectors

## Test Isolation

Each test starts with clean state:
```typescript
test.beforeEach(async ({ page }) => {
  await designer.goto();
  await designer.clearCanvas();  // Clears localStorage + reloads
});
```

## BDD Naming

Use WHEN/SHOULD structure:
```typescript
test.describe('WHEN user drags preset', () => {
  test('SHOULD appear in canvas', async () => { });
  test('SHOULD preserve CSS properties-panel', async () => { });
});
```

## Common Patterns

### Drag and Drop
```typescript
const preset = await designer.presets.dragPreset('container');
await preset.dragTo(await designer.canvas.getLocator());
```

### Keyboard Shortcuts
```typescript
await page.keyboard.press('Control+Z');  // Undo
await page.keyboard.press('Delete');     // Delete item
```

### State Persistence
```typescript
// Add item
const preset = await designer.presets.dragPreset('text');
await preset.dragTo(await designer.canvas.getLocator());

// Reload and verify persistence
await page.reload();
await designer.canvas.waitForReady();
expect(await designer.canvas.hasItem('Text')).toBe(true);
```

### CSS Property Verification
```typescript
const display = await designer.canvas.getItemCssProperty('Item', 'display');
expect(display).toBe('flex');
```

## Creating Page Objects

### Page Object Structure

Page Objects encapsulate locators and actions for pages/routes:

```typescript
// apps/boxout-e2e/src/page-objects/designer.page.ts
import { Page } from '@playwright/test';
import { CanvasComponent } from './components/canvas.component';
import { PresetsPanelComponent } from './components/components-panel.component';

export class DesignerPage {
  readonly canvas: CanvasComponent;
  readonly presets: PresetsPanelComponent;

  constructor(public readonly page: Page) {
    this.canvas = new CanvasComponent(page);
    this.presets = new PresetsPanelComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/design', { waitUntil: 'domcontentloaded' });
    await this.canvas.waitForReady();
  }

  async clearCanvas(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('canvas-state');
    });
    await this.page.reload();
    await this.canvas.waitForReady();
  }
}
```

### Component Page Objects

Component Objects represent reusable UI components:

```typescript
// apps/boxout-e2e/src/page-objects/components/canvas.component.ts
import { Locator, Page } from '@playwright/test';

export class CanvasComponent {
  readonly page: Page;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.locator('[data-testid="canvas-component"]');
  }

  async waitForReady(): Promise<void> {
    await this.canvas.waitFor({ state: 'visible' });
  }

  async hasItem(label: string): Promise<boolean> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.isVisible();
  }

  async selectItem(label: string): Promise<void> {
    await this.canvas.locator(`[data-label="${label}"]`).click();
  }

  async getItemCssProperty(label: string, property: string): Promise<string> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }

  async getCanvasItemCount(): Promise<number> {
    return await this.canvas.locator('[data-canvas-item]').count();
  }

  async getLocator(): Promise<Locator> {
    return this.canvas;
  }
}
```

## Wait Strategies

Playwright auto-waits for elements, but explicit waits may be needed:

### Element State
```typescript
await page.getByTestId('canvas').waitFor({ state: 'visible' });
await element.waitFor({ state: 'attached' });
```

### Navigation
```typescript
await Promise.all([
  page.waitForURL('/preview'),
  page.getByRole('link', { name: 'Preview' }).click()
]);
```

### Conditional Waiting
```typescript
await expect(async () => {
  const hasItem = await designer.canvas.hasItem('My Container');
  expect(hasItem).toBe(true);
}).toPass({ timeout: 5000 });
```

## Complete Test Examples

### User Journey Test
```typescript
import { test, expect } from '@playwright/test';
import { DesignerPage } from '../page-objects/designer.page';

test.describe('Canvas Editing', () => {
  let designer: DesignerPage;

  test.beforeEach(async ({ page }) => {
    designer = new DesignerPage(page);
    await designer.goto();
    await designer.clearCanvas();
  });

  test('SHOULD create layout with components-panel', async ({ page }) => {
    // Step 1: Drag preset to canvas
    const containerPreset = await designer.presets.dragPreset('container');
    await containerPreset.dragTo(await designer.canvas.getLocator());

    // Step 2: Verify item appears
    expect(await designer.canvas.hasItem('Container')).toBe(true);

    // Step 3: Verify CSS properties-panel
    const display = await designer.canvas.getItemCssProperty('Container', 'display');
    expect(display).toBe('block');
  });
});
```

### Keyboard Interaction Test
```typescript
test('SHOULD support undo with Ctrl+Z', async ({ page }) => {
  const preset = await designer.presets.dragPreset('text');
  await preset.dragTo(await designer.canvas.getLocator());

  await page.keyboard.press('Control+Z');

  expect(await designer.canvas.getCanvasItemCount()).toBe(0);
});
```

### State Persistence Test
```typescript
test('SHOULD persist layout across page reload', async ({ page }) => {
  await designer.clearCanvas();

  const preset = await designer.presets.dragPreset('text');
  await preset.dragTo(await designer.canvas.getLocator());

  // Reload page
  await page.reload();
  await designer.canvas.waitForReady();

  // Verify persistence
  expect(await designer.canvas.hasItem('Text')).toBe(true);
});
```

## Test Organization

### Feature-Based Grouping
Group related scenarios by feature, not by page:

```typescript
test.describe('Preset Insertion', () => {
  test.describe('WHEN user drags text preset', () => {
    test('SHOULD appear in canvas', async () => { /* ... */ });
    test('SHOULD have default CSS', async () => { /* ... */ });
  });

  test.describe('WHEN user drags container preset', () => {
    test('SHOULD appear in canvas', async () => { /* ... */ });
    test('SHOULD support nesting', async () => { /* ... */ });
  });

  test.describe('WHEN user drags multiple components-panel', () => {
    test('SHOULD maintain order', async () => { /* ... */ });
  });
});
```

## Anti-Patterns

### ❌ Bad Practices

```typescript
// Don't use arbitrary timeouts
await page.waitForTimeout(2000);

// Don't use brittle selectors
await page.locator('.item').nth(2).click();

// Don't test implementation details
expect(component.internalState).toBe(true);

// Don't create dependent tests
test('create item', async () => { /* ... */ });
test('edit item', async () => { /* assumes item exists */ });

// Don't use CSS classes
await page.locator('.btn-primary').click();

// Don't use XPath
await page.locator('//div[@class="..."]').click();
```

### ✅ Good Practices

```typescript
// Use auto-waiting
await page.getByTestId('canvas').click();

// Use semantic selectors
await page.locator('[data-label="Specific Item"]').click();

// Test user-observable behavior
await expect(page.getByText('Saved successfully')).toBeVisible();

// Isolated test setup
test.beforeEach(async ({ page }) => {
  await designer.goto();
  await designer.clearCanvas();
});

// Use test IDs and data attributes
await page.getByTestId('canvas-component').click();
await page.locator('[data-label="My Item"]').click();
```

## CI Configuration

E2E tests run automatically in CI:
- On pull requests (before preview deployment)
- On merges to master (before production deployment)

Settings:
- Chromium only, headless mode
- 2 retries per failing test
- 30s timeout per test
- Screenshots + videos on failure

See `apps/boxout-e2e/playwright.config.ts` for full configuration.
