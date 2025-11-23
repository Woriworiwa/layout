# Contributing Guide

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

### Quick Start

Use the interactive commit tool instead of `git commit`:

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

### Commit Message Format

Each commit message consists of a **header**, a **body** (optional), and a **footer** (optional):

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and must conform to the format above.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (white-space, formatting, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the affected module or feature (optional but recommended):

- `canvas`
- `properties`
- `serialization`
- `undo-redo`
- `designer`
- `renderer`
- etc.

### Subject

The subject contains a succinct description of the change:

- Use sentence case (first letter capitalized)
- No period (.) at the end
- Maximum 100 characters
- Use imperative, present tense: "Change" not "Changed" nor "Changes"

### Body

The body should include the motivation for the change and contrast this with previous behavior (optional but recommended for significant changes).

### Footer

The footer should contain any information about **Breaking Changes** and reference **GitHub issues** that this commit closes (optional).

Breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines.

## Examples

### Simple commit

```
feat(canvas): Add drag and drop support for items
```

### Commit with scope and body

```
fix(serialization): Correct CSS export for flexbox containers

The previous implementation didn't properly handle nested flex containers.
This commit ensures all flex properties are correctly serialized.
```

### Breaking change

```
feat(properties)!: Update property panel API

BREAKING CHANGE: The `PropertyGroup` component now requires a `group` prop instead of individual property props.

Migration guide:
- Replace `<PropertyGroup name="..." value="..." />` with `<PropertyGroup group={groupObject} />`
```

### Referencing issues

```
fix(undo-redo): Prevent memory leak in undo stack

Fixes #123
```

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks:

### Pre-commit

- Runs linting on staged files
- Ensures code quality before commit

### Commit-msg

- Validates commit message format
- Ensures adherence to Conventional Commits specification

If your commit message doesn't follow the convention, the commit will be rejected with a helpful error message.

## Manual Commits (Not Recommended)

If you need to use `git commit` directly, ensure your message follows this format:

```bash
git commit -m "feat(scope): Add new feature"
```

However, using `npm run commit` is strongly recommended as it provides interactive prompts and validation.

## Bypassing Hooks (Emergency Only)

In rare cases where you need to bypass the hooks:

```bash
git commit --no-verify -m "your message"
```

⚠️ **Use sparingly** - This should only be used in emergency situations.

## Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Commitizen Documentation](https://commitizen-tools.github.io/commitizen/)
