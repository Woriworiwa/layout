# End-to-End Tests

This directory contains Playwright-based E2E tests for the Layout Generator application.

## Test Structure

### Page Objects
Located in `src/page-objects/`:

- **`designer.page.ts`** - Main designer page with navigation and high-level workflows
- **`components/insert-panel.component.ts`** - Insert panel for preset insertion
- **`components/layers-panel.component.ts`** - Layers tree navigation and selection
- **`components/properties-panel.component.ts`** - Properties editing
- **`components/canvas.component.ts`** - Canvas rendering and interactions

### Test Specs
Located in `src/tests/`:

- **`preset-insertion.spec.ts`** - Focused tests for preset insertion workflow (12 scenarios)
- **`preset-user-journey.spec.ts`** - Complete end-to-end user journeys (4 scenarios)

## Running Tests

```bash
# Run all E2E tests (headless)
nx e2e

# Open Playwright UI for interactive testing
nx e2e-ui

# Run tests in headed mode (see browser)
nx e2e-headed

# Debug tests with Playwright Inspector
nx e2e-debug

# Run specific test file
nx e2e -- preset-insertion.spec.ts

# Run tests matching a pattern
nx e2e -- --grep "WHEN user inserts"
```

## Test Coverage

### Preset Insertion (`preset-insertion.spec.ts`)
- ✅ Empty canvas state verification
- ✅ Flexbox preset insertion and CSS verification
- ✅ Grid preset insertion and CSS verification
- ✅ Text preset insertion
- ✅ Preset selection and properties panel update
- ✅ Multiple preset insertion and order
- ✅ Nested preset insertion (child in container)
- ✅ Property editing (label and CSS)
- ✅ Complete multi-preset workflow
- ✅ Undo/redo functionality

### User Journeys (`preset-user-journey.spec.ts`)
- ✅ Complete page layout creation (header, content, footer)
- ✅ Rapid preset insertion with undo/redo
- ✅ Nested container structure building
- ✅ Layout persistence across page reload

## Page Object Patterns

### Component Objects
Each UI component has its own page object with encapsulated locators and actions:

```typescript
// Using the insert panel
await designer.insert.insertPreset('Flexbox Row');
const presets = await designer.insert.getAvailablePresets();

// Using the layers panel
await designer.layers.selectLayer('My Container');
const labels = await designer.layers.getLayerLabels();

// Using the properties panel
await designer.properties.setLabel('New Label');
const width = await designer.properties.getCssProperty('Width');

// Using the canvas
await designer.canvas.clickItem('My Item');
const count = await designer.canvas.getItemCount();
```

### High-Level Workflows
The designer page provides workflow methods:

```typescript
// Navigate to designer
await designer.goto();

// Insert and verify preset
await designer.insertAndVerifyPreset('Flexbox Row');

// Get current state
const state = await designer.getState();

// Undo/redo
await designer.undo();
await designer.redo();

// Navigate to other pages
await designer.navigateToPreview();
await designer.navigateToLearn();
```

## Locator Strategy

Tests use accessible selectors in priority order:
1. **Role**: `page.getByRole('button', { name: 'Insert' })`
2. **Test ID**: `page.getByTestId('canvas')`
3. **Label**: `page.getByLabel('Width')`
4. **Text**: `page.getByText('Flexbox Row')`

**Never use:**
- CSS classes (`.btn-primary`)
- XPath (`//div[@class='...']`)
- nth-child selectors

## Best Practices

1. **Isolation** - Each test is independent with clean state via `beforeEach`
2. **Auto-waiting** - Rely on Playwright's built-in waiting, use explicit waits only when needed
3. **User behavior** - Tests simulate real user interactions (click, type, navigate)
4. **BDD naming** - Use WHEN/SHOULD structure for test names
5. **Page Objects** - All locators and actions encapsulated in page objects
6. **Focused tests** - Maximum 12 scenarios per feature file

## Debugging

### Using Playwright UI
```bash
nx e2e-ui
```
- See test execution in real-time
- Time-travel through test steps
- Inspect DOM at any point
- Run individual tests

### Using Playwright Inspector
```bash
nx e2e-debug
```
- Step through test code
- Pause and inspect state
- Modify selectors on the fly
- Generate code from interactions

### Console Logs
Add debug output in tests:
```typescript
console.log('Layer count:', await designer.layers.getLayerCount());
console.log('Canvas state:', await designer.getState());
```

## CI/CD Integration

Tests run in CI with:
- Chromium browser only (fastest, most stable)
- Headless mode
- Retries: 2 attempts per test
- Timeout: 30 seconds per test
- Screenshots on failure
- Video on first retry

## Adding New Tests

1. **Identify the workflow** - What complete user journey are you testing?
2. **Check page objects** - Can you reuse existing page objects or do you need new ones?
3. **Create/update page objects** - Add any missing locators and actions
4. **Write focused tests** - Maximum 12 scenarios, use BDD naming
5. **Test like a user** - Click, type, verify - end-to-end

Example:
```typescript
test.describe('WHEN user creates responsive layout', () => {
  test('SHOULD adapt to different screen sizes', async ({ page }) => {
    await designer.goto();
    await designer.insert.insertPreset('Responsive Grid');

    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopColumns = await designer.canvas.getItemCssProperty(
      'Responsive Grid',
      'grid-template-columns'
    );
    expect(desktopColumns).toContain('1fr 1fr 1fr');

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileColumns = await designer.canvas.getItemCssProperty(
      'Responsive Grid',
      'grid-template-columns'
    );
    expect(mobileColumns).toContain('1fr');
  });
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing E2E Guidelines](../knowledge-base/testing/testing-e2e.md)
- [Page Object Model](https://playwright.dev/docs/pom)
