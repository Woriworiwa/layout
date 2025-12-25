# E2E Testing with Playwright

## Overview
- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model (POM)
- **Browser**: Chromium only
- **Location**: `apps/boxout-e2e/`

## Commands
```bash
nx boxout-e2e          # Run all tests headless
nx boxout-e2e-ui       # Open Playwright UI (interactive)
nx boxout-e2e-headed   # Run with visible browser
nx boxout-e2e-debug    # Run with Playwright Inspector
```

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
        └── presets.component.ts # Presets panel
```

## Page Object Model

### Structure
- **Page Objects** - Represent pages/routes (designer.page.ts)
- **Component Objects** - Represent reusable UI components (canvas.component.ts, presets.component.ts)

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
  test('SHOULD preserve CSS properties', async () => { });
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
