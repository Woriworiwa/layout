# E2E Testing with Playwright

## Tech Stack
- **E2E Framework**: Playwright with TypeScript
- **Test Runner**: Playwright Test Runner
- **Browser**: Chromium (Desktop Chrome)
- **Pattern**: Page Object Model (POM)
- **Commands**: `npm run e2e`, `npm run e2e:ui`, `npm run e2e:headed`

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
│   ├── tests/                    # Test specs organized by feature
│   │   ├── app.spec.ts
│   │   ├── preset-insertion.spec.ts       # Preset insertion workflow (12 tests)
│   ├── page-objects/             # Page Object classes
│   │   ├── designer.page.ts      # Main designer page object
│   │   └── components/           # Reusable component objects
│   │       └── canvas.component.ts
│   └── fixtures/                 # Test data and custom fixtures
├── playwright.config.ts
└── README.md                     # E2E testing documentation
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
    // Dev: Start dev server with hot reload
    // CI: Serve pre-built static files
    command: process.env['CI']
      ? 'npx serve dist/layout/browser -l 4200'
      : 'npx nx run layout:serve',
    url: process.env['CI'] ? 'http://localhost:4200' : 'http://localhost:4300',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  }
}
```

### CI Pipeline
E2E tests run automatically in the CI pipeline on:
- **Pull requests** - Tests run before preview deployment
- **Merges to master** - Tests run before production deployment

**CI Workflow:**
1. Build app (`npm run build`)
2. Run unit tests (`npm test`)
3. Run linter (`npm run lint`)
4. Install Playwright browsers (`npx playwright install --with-deps`)
5. Run E2E tests (`npm run e2e` with `CI=true`)
6. Deploy to Firebase

The CI environment uses `serve` package to host the built app statically, avoiding Nx dependencies.

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


### Component Objects
For reusable UI components, create separate component objects that encapsulate locators and actions:

**Canvas Component:**
```typescript
// e2e/src/page-objects/components/canvas.component.ts
export class CanvasComponent {
  readonly page: Page;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.locator('[data-testid="canvas"]');
  }

  async waitForReady(): Promise<void> {
    await this.canvas.waitFor({ state: 'visible' });
  }

  async hasItem(label: string): Promise<boolean> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.isVisible();
  }

  async getItemCssProperty(label: string, property: string): Promise<string> {
    const item = this.canvas.locator(`[data-label="${label}"]`);
    return await item.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }
}
```
