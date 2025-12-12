---
name: test
description: Generate focused BDD unit tests using testing guidelines
---

Generate unit tests using the test-generator-bdd agent.

This command will:
1. Read testing guidelines from knowledge-base/testing/
2. Analyze the target code
3. Generate focused BDD-style unit tests (max 10 per file)
4. Follow project testing conventions

## Usage

### Test a specific file
```
/test <file-path>
```
Example:
```
/test src/app/designer/inspector/inspector.component.ts
```

### Test all changed files in current branch
```
/test --changed
```

This compares the current branch against the main branch and generates tests for all modified TypeScript files (excluding existing test files).

## What Gets Generated

- **Angular Testing Library** tests for components
- **TestBed** tests for services
- **BDD naming** with WHEN/SHOULD structure
- **Real stores** with test data (not mocks)
- **Reusable fakes** from src/testing/fakes/
- **Maximum 10 tests** focusing on behavior

## Guidelines Applied

The agent automatically reads:
- `knowledge-base/testing/testing-core.md` - Core principles
- `knowledge-base/testing/testing-components.md` - For components
- `knowledge-base/testing/testing-services.md` - For services
- `knowledge-base/testing/testing-stores.md` - For Store<T> pattern

---

{{#if (contains "--changed" prompt)}}
Generate tests for all TypeScript files changed in the current branch compared to master.

Steps:
1. Run `git diff master...HEAD --name-only --diff-filter=ACMR` to find changed files
2. Filter for .ts files (exclude .spec.ts)
3. For each file, use the test-generator-bdd agent to generate tests
4. Create the test file at the same location with .spec.ts extension

{{else}}
Generate a test file for: {{prompt}}

Steps:
1. Read the target file
2. Invoke the test-generator-bdd agent
3. Generate focused BDD tests following project guidelines
4. Create the test file at [file-path].spec.ts (or update if exists)
{{/if}}