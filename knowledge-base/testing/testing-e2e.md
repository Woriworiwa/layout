# E2E Testing with Playwright

## Tech Stack
- **E2E Framework**: Playwright with TypeScript
- **Test Runner**: Playwright Test Runner
- **Browser**: Chromium (Desktop Chrome)
- **Pattern**: Page Object Model (POM)
- **Commands**: `nx e2e`, `npx playwright test --ui`, `npx playwright test --headed`

## Test Strategy
- Focus on **critical user journeys** end-to-end
- Test **across page boundaries** and route transitions
- Use **Page Object Model** for maintainability
- Keep tests **isolated** and **deterministic**
- Maximum **8-12 scenarios per feature**

### What to Test
**DO Test:**
- Complete user workflows (create layout → edit → export)
- Navigation and routing
- Form submissions with validation
- Data persistence across page loads
- Error states and recovery flows
- Responsive behavior (mobile/desktop)

**DON'T Test:**
- Unit-level logic (use Vitest)
- Component internals
- CSS styling details
- Third-party library behavior
- Browser compatibility (focus on Chromium)

## Project Structure
```
e2e/
├── src/
│   ├── tests/           # Test specs organized by feature
│   │   ├── app.spec.ts
│   │   ├── canvas.spec.ts
│   │   └── export.spec.ts
│   ├── page-objects/    # Page Object classes
│   │   ├── app.page.ts
│   │   ├── designer.page.ts
│   │   └── components/  # Reusable component objects
│   └── fixtures/        # Test data and custom fixtures
└── playwright.config.ts
```

## Configuration

### Current Setup (playwright.config.ts)
```typescript
{
  timeout: 30000,              // 30s per test
  fullyParallel: true,         // Run tests in parallel
  retries: 2 (CI only),        // Retry flaky tests in CI
  workers: 1 (CI only),        // Single worker in CI

  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',   // Debug failed tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  webServer: {
    command: 'npx nx run layout:serve',
    url: 'http://localhost:4300',
    reuseExistingServer: true,
    timeout: 120000,
  }
}
```

### Browser Projects
Currently configured for **Chromium only**. Add Firefox/Safari when needed:
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'mobile', use: { ...devices['iPhone 13'] } },
]
```

## Page Object Pattern

### Why Page Objects?
- **Encapsulate** locators and actions
- **Reduce duplication** across tests
- **Easier maintenance** when UI changes
- **Better readability** in test specs

### Page Object Structure
```typescript
// e2e/src/page-objects/designer.page.ts
import { Page, Locator } from '@playwright/test';

export class DesignerPage {
  readonly page: Page;

  // Locators - use accessible selectors
  readonly canvas: Locator;
  readonly layersPanel: Locator;
  readonly propertiesPanel: Locator;
  readonly insertButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.getByTestId('canvas');
    this.layersPanel = page.getByRole('region', { name: 'Layers' });
    this.propertiesPanel = page.getByRole('region', { name: 'Properties' });
    this.insertButton = page.getByRole('button', { name: /insert/i });
  }

  // Navigation
  async goto() {
    await this.page.goto('/design');
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.canvas.waitFor({ state: 'visible' });
  }

  // Actions
  async insertContainer(label: string) {
    await this.insertButton.click();
    await this.page.getByRole('menuitem', { name: 'Container' }).click();
    await this.page.getByLabel('Label').fill(label);
    await this.page.getByRole('button', { name: 'Insert' }).click();
  }

  async selectItemInLayers(label: string) {
    await this.layersPanel
      .getByRole('treeitem', { name: label })
      .click();
  }

  // Assertions helpers
  async getCanvasItems(): Promise<string[]> {
    const items = await this.layersPanel
      .getByRole('treeitem')
      .allTextContents();
    return items;
  }
}
```

### Component Objects
For reusable UI components:
```typescript
// e2e/src/page-objects/components/property-panel.component.ts
export class PropertyPanelComponent {
  constructor(private readonly locator: Locator) {}

  async setWidth(value: string) {
    await this.locator.getByLabel('Width').fill(value);
  }

  async setHeight(value: string) {
    await this.locator.getByLabel('Height').fill(value);
  }

  async getComputedStyle(property: string): Promise<string> {
    return await this.locator
      .getByTestId(`computed-${property}`)
      .textContent() || '';
  }
}

// Usage in page object
export class DesignerPage {
  readonly properties: PropertyPanelComponent;

  constructor(page: Page) {
    this.page = page;
    this.properties = new PropertyPanelComponent(
      page.getByRole('region', { name: 'Properties' })
    );
  }
}
```

## Writing Tests

### BDD Style with Page Objects
```typescript
// e2e/src/tests/canvas-editing.spec.ts
import { test, expect } from '@playwright/test';
import { DesignerPage } from '../page-objects/designer.page';

test.describe('Canvas Editing', () => {
  let designer: DesignerPage;

  test.beforeEach(async ({ page }) => {
    designer = new DesignerPage(page);
    await designer.goto();
  });

  test.describe('WHEN user inserts a container', () => {
    test('SHOULD appear in canvas and layers panel', async () => {
      await designer.insertContainer('Header Container');

      const items = await designer.getCanvasItems();
      expect(items).toContain('Header Container');
      await expect(designer.canvas.getByText('Header Container')).toBeVisible();
    });

    test('SHOULD be editable with properties panel', async () => {
      await designer.insertContainer('Main Container');
      await designer.selectItemInLayers('Main Container');

      await designer.properties.setWidth('800px');
      await designer.properties.setHeight('600px');

      const width = await designer.properties.getComputedStyle('width');
      expect(width).toBe('800px');
    });
  });

  test.describe('WHEN user deletes an item', () => {
    test('SHOULD remove from canvas and layers', async () => {
      await designer.insertContainer('Temp Container');
      await designer.selectItemInLayers('Temp Container');
      await designer.deleteSelectedItem();

      const items = await designer.getCanvasItems();
      expect(items).not.toContain('Temp Container');
    });
  });
});
```

### User Journey Tests
Test complete workflows:
```typescript
test.describe('Complete Layout Creation Journey', () => {
  test('SHOULD create, edit, and export layout', async ({ page }) => {
    const designer = new DesignerPage(page);
    const preview = new PreviewPage(page);

    // Step 1: Navigate to designer
    await designer.goto();

    // Step 2: Create layout structure
    await designer.insertContainer('Page Container');
    await designer.insertFlexContainer('Header', 'Page Container');
    await designer.insertText('Logo', 'Header');

    // Step 3: Configure styles
    await designer.selectItemInLayers('Page Container');
    await designer.properties.setWidth('1200px');

    // Step 4: Navigate to preview
    await designer.navigateToPreview();

    // Step 5: Verify export
    const html = await preview.getHTMLOutput();
    expect(html).toContain('Page Container');
    expect(html).toContain('width: 1200px');
  });
});
```

## Locator Strategies

### Priority Order (Angular-aligned)
1. **Accessible Role** (best for accessibility)
   ```typescript
   page.getByRole('button', { name: 'Save' })
   page.getByRole('textbox', { name: 'Email' })
   page.getByRole('navigation')
   ```

2. **Test ID** (stable, semantic)
   ```typescript
   page.getByTestId('canvas-container')
   page.getByTestId('layer-tree')
   ```
   Add to templates: `<div data-testid="canvas-container">`

3. **Label** (for form fields)
   ```typescript
   page.getByLabel('Width')
   page.getByLabel('Background Color')
   ```

4. **Text** (for unique text content)
   ```typescript
   page.getByText('Insert Container')
   page.getByText(/layout created/i)
   ```

**Avoid:**
- ❌ CSS classes: `.btn-primary` (brittle)
- ❌ XPath: `//div[@class='...']` (hard to read)
- ❌ nth-child: `.item:nth-child(3)` (breaks easily)

## Testing Patterns

### Waiting Strategies
```typescript
// Wait for element state
await page.getByRole('button', { name: 'Save' }).waitFor({ state: 'visible' });
await page.getByTestId('loading').waitFor({ state: 'detached' });

// Wait for navigation
await Promise.all([
  page.waitForURL('/preview'),
  page.getByRole('link', { name: 'Preview' }).click()
]);

// Wait for API response
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/save')),
  page.getByRole('button', { name: 'Save' }).click()
]);

// Custom condition
await expect(async () => {
  const items = await designer.getCanvasItems();
  expect(items).toHaveLength(3);
}).toPass({ timeout: 5000 });
```

### Handling Dialogs
```typescript
test('SHOULD confirm deletion', async ({ page }) => {
  const designer = new DesignerPage(page);

  // Listen for dialog
  page.on('dialog', dialog => dialog.accept());

  await designer.deleteSelectedItem();

  const items = await designer.getCanvasItems();
  expect(items).toHaveLength(0);
});
```

### Local Storage / Session State
```typescript
test('SHOULD persist layout to localStorage', async ({ page }) => {
  const designer = new DesignerPage(page);
  await designer.insertContainer('My Layout');

  // Check localStorage
  const stored = await page.evaluate(() => {
    return localStorage.getItem('canvas-state');
  });

  expect(stored).toBeTruthy();
  expect(JSON.parse(stored!)).toMatchObject({
    items: expect.arrayContaining([
      expect.objectContaining({ label: 'My Layout' })
    ])
  });
});

test('SHOULD restore layout on reload', async ({ page }) => {
  const designer = new DesignerPage(page);

  // Set initial state
  await page.evaluate(() => {
    localStorage.setItem('canvas-state', JSON.stringify({
      items: [{ key: '123', label: 'Restored Item' }]
    }));
  });

  await designer.goto();

  const items = await designer.getCanvasItems();
  expect(items).toContain('Restored Item');
});
```

### Keyboard Interactions
```typescript
test('SHOULD support undo with Ctrl+Z', async ({ page }) => {
  const designer = new DesignerPage(page);
  await designer.insertContainer('To Undo');

  await page.keyboard.press('Control+Z');

  const items = await designer.getCanvasItems();
  expect(items).not.toContain('To Undo');
});

test('SHOULD navigate with arrow keys', async ({ page }) => {
  await page.getByRole('treeitem', { name: 'Container' }).focus();
  await page.keyboard.press('ArrowDown');

  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toBe('Next Item');
});
```

### Drag and Drop
```typescript
test('SHOULD reorder items via drag', async ({ page }) => {
  const designer = new DesignerPage(page);

  const source = designer.layersPanel.getByRole('treeitem', { name: 'Item 1' });
  const target = designer.layersPanel.getByRole('treeitem', { name: 'Item 2' });

  await source.dragTo(target);

  const items = await designer.getCanvasItems();
  expect(items[0]).toBe('Item 2');
  expect(items[1]).toBe('Item 1');
});
```

## Assertions

### Visual Assertions
```typescript
// Element visibility
await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByTestId('spinner')).toBeHidden();

// Element state
await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
await expect(page.getByRole('checkbox')).toBeChecked();

// Text content
await expect(page.getByRole('heading')).toHaveText('Designer');
await expect(page.getByTestId('status')).toContainText(/saved/i);

// Attributes
await expect(page.getByRole('img')).toHaveAttribute('alt', 'Logo');
await expect(page.locator('input')).toHaveValue('800px');

// Count
await expect(page.getByRole('treeitem')).toHaveCount(3);
```

### Screenshot Comparison
```typescript
test('SHOULD render canvas correctly', async ({ page }) => {
  await designer.goto();
  await designer.insertContainer('Test Layout');

  // Visual regression test
  await expect(page.getByTestId('canvas')).toHaveScreenshot('canvas-with-container.png');
});
```

### Accessibility Checks
```typescript
import AxeBuilder from '@axe-core/playwright';

test('SHOULD have no accessibility violations', async ({ page }) => {
  const designer = new DesignerPage(page);
  await designer.goto();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

## Test Organization

### Feature-Based Structure
```
e2e/src/tests/
├── canvas-editing.spec.ts      # Canvas operations
├── properties-panel.spec.ts    # Property editing
├── layers-panel.spec.ts        # Layer tree interactions
├── export-functionality.spec.ts # Export features
├── routing.spec.ts             # Navigation
└── accessibility.spec.ts       # a11y tests
```

### Test Count Guidelines
- **Feature specs**: 8-12 scenarios per file
- **User journey specs**: 3-5 complete flows
- **Critical path**: Must cover in every PR
- **Smoke tests**: 5-8 essential checks

## Running Tests

### Local Development
```bash
# Run all tests (headless)
nx e2e

# Run with UI mode (recommended for development)
nx e2e-ui

# Run in headed mode (see browser)
nx e2e-headed

# Run in debug mode with inspector
nx e2e-debug

# Run specific test file
npx playwright test canvas-editing

# Run tests matching pattern
npx playwright test --grep "insert container"

# Update screenshots
npx playwright test --update-snapshots
```

### CI/CD
```bash
# Runs with retries, single worker, artifacts
nx e2e  # Uses CI environment variables

# View HTML report
npx playwright show-report dist/.playwright/e2e/html
```

## Debugging

### Playwright Inspector
```bash
nx e2e-debug
# or
npx playwright test --debug
```
- Step through tests
- Inspect locators
- View action log

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```
- Timeline of actions
- Network activity
- Screenshots at each step
- Console logs

### VS Code Integration
Install Playwright extension for:
- Run tests from editor
- Debug with breakpoints
- Generate tests via codegen

## Best Practices

### Test Isolation
```typescript
// ✅ Good - Isolated setup
test.beforeEach(async ({ page }) => {
  await page.goto('/design');
  await page.evaluate(() => localStorage.clear());
});

// ❌ Bad - Tests depend on each other
test('create item', async () => { /* ... */ });
test('edit item', async () => { /* assumes item exists */ });
```

### Deterministic Tests
```typescript
// ✅ Good - Wait for condition
await expect(page.getByTestId('item-count')).toHaveText('3');

// ❌ Bad - Arbitrary timeout
await page.waitForTimeout(2000);
```

### Readable Assertions
```typescript
// ✅ Good - Clear intent
const items = await designer.getCanvasItems();
expect(items).toEqual(['Header', 'Main', 'Footer']);

// ❌ Bad - Opaque
expect((await page.$$('[data-testid="item"]')).length).toBe(3);
```

### Avoid Over-Mocking
E2E tests should use real implementation:
- ❌ Don't mock Angular services
- ❌ Don't mock API calls (use test backend)
- ✅ Use real database (test instance)
- ✅ Test actual user flows

### Performance
```typescript
// ✅ Good - Parallel when independent
test.describe.configure({ mode: 'parallel' });

// ✅ Good - Reuse authentication
test.use({ storageState: 'auth.json' });

// ❌ Bad - Sequential when unnecessary
for (const item of items) {
  await test.step(`test ${item}`, async () => { /* ... */ });
}
```

## Common Pitfalls

### Race Conditions
```typescript
// ❌ Bad - Click before button ready
await page.click('button');

// ✅ Good - Auto-wait built in
await page.getByRole('button').click();
```

### Flaky Selectors
```typescript
// ❌ Bad - Depends on order
await page.locator('.item').nth(2).click();

// ✅ Good - Semantic selector
await page.getByRole('treeitem', { name: 'Specific Item' }).click();
```

### Ignoring Errors
```typescript
// ❌ Bad - Silent failure
await page.click('button').catch(() => {});

// ✅ Good - Let it fail
await page.getByRole('button').click();
```

## Angular-Specific Considerations

### Zone.js and Change Detection
Playwright automatically waits for:
- Network idle
- DOM mutations
- Angular zone stabilization

No special handling needed for Angular's change detection.

### Lazy Loaded Routes
```typescript
test('SHOULD load preview route', async ({ page }) => {
  await page.goto('/design');

  // Wait for chunk to load
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('link', { name: 'Preview' }).click()
  ]);

  await expect(page).toHaveURL('/preview');
  await expect(page.getByRole('heading')).toHaveText('Preview');
});
```

### Signal-Based Components
No special handling - signals work seamlessly:
```typescript
// Component using signals
test('SHOULD react to signal changes', async ({ page }) => {
  await designer.insertContainer('Test');

  // Signal updates trigger DOM changes automatically
  await designer.properties.setWidth('500px');

  // Playwright waits for DOM update
  await expect(page.getByTestId('canvas-item')).toHaveCSS('width', '500px');
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
