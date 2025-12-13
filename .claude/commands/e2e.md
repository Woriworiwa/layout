---
name: e2e
description: Generate Playwright E2E tests using Page Object Model pattern
---

Generate end-to-end tests using the test-generator-e2e agent.

This command will:
1. Read E2E testing guidelines from knowledge-base/testing/testing-e2e.md
2. Analyze the feature/workflow to test
3. Create/update Page Objects in e2e/src/page-objects/
4. Generate focused BDD-style E2E tests (max 12 per feature)
5. Follow Playwright and Page Object Model best practices

## Usage

### Test a specific feature or workflow
```
/e2e <feature-description>
```
Examples:
```
/e2e canvas editing workflow
/e2e export functionality to HTML and CSS
/e2e properties panel interactions
/e2e complete layout creation journey
```

### Test a specific page/route
```
/e2e /design route
/e2e /preview page
```

## What Gets Generated

- **Page Object classes** in `e2e/src/page-objects/` with:
  - Accessible locators (roles, labels, test IDs)
  - Reusable action methods
  - Helper methods for assertions

- **Test specs** in `e2e/src/tests/` with:
  - BDD naming with WHEN/SHOULD structure
  - Complete user journey tests
  - Maximum 12 focused scenarios
  - Proper waiting strategies
  - Real browser interactions

## Guidelines Applied

The agent automatically reads:
- `knowledge-base/testing/testing-e2e.md` - Complete E2E testing guide
- `e2e/playwright.config.ts` - Playwright configuration
- Existing page objects for reuse

## Test Patterns

- **User Journeys**: Complete workflows from start to finish
- **Page Object Model**: Encapsulated locators and actions
- **Accessible Selectors**: Role > Test ID > Label > Text
- **Auto-Waiting**: Trust Playwright's built-in waits
- **Isolation**: Each test is independent with clean setup

## Running Generated Tests

After generation, run tests with:
```bash
nx e2e          # Run all tests headless
nx e2e-ui       # Open Playwright UI (recommended)
nx e2e-headed   # See browser while testing
nx e2e-debug    # Debug with inspector
```

---

Generate E2E tests for: {{prompt}}

Steps:
1. Understand the user workflow or feature to test
2. Identify which pages/routes are involved
3. Check for existing page objects in e2e/src/page-objects/
4. Invoke the test-generator-e2e agent
5. Generate or update page objects as needed
6. Create focused E2E test scenarios in e2e/src/tests/
7. Use BDD structure and accessible selectors