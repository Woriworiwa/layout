# .claude Folder - AI Assistant Reference

This folder contains documentation and plans to help Claude Code (or other AI assistants) work efficiently with this codebase.

---

## Files

### `adding-css-properties-guide.md`
**Comprehensive implementation guide for adding CSS properties**

Based on the grid-template-areas implementation (Jan 7, 2026, commit 9bef13c).

Contains:
- Step-by-step implementation pattern
- Architecture overview
- Code examples for each step
- Common scenarios and troubleshooting
- Complete file reference

**Use this when:** Adding any new CSS property to the layout generator

**Estimated time savings:** ~30-40 minutes of exploration per feature

---

### `css-anchor-positioning-plan.md`
**Implementation plan for CSS Anchor Positioning feature**

Planned for January 8, 2026.

Contains:
- Feature overview and CSS properties
- Model design decisions
- UI design approach
- Implementation checklist
- Open questions and considerations

**Use this when:** Implementing CSS Anchor Positioning specifically

**Status:** Ready for implementation

---

## How to Use These Docs

### For AI Assistants

When starting a new conversation about adding CSS properties:

1. **Read** `adding-css-properties-guide.md` first
2. **Follow** the step-by-step pattern exactly
3. **Reference** file locations and examples from the guide
4. **Skip** the exploration phase - the guide has all the patterns

This should reduce implementation time from ~45-60 min to ~20-30 min.

### For Human Developers

These docs serve as:
- Onboarding material for new developers
- Quick reference for adding properties
- Historical context for architectural decisions
- Templates for feature implementation

---

## Maintenance

### When to Update These Docs

**Update `adding-css-properties-guide.md` when:**
- Architecture changes (e.g., new state management approach)
- New UI component types are added
- File structure changes
- Better patterns are discovered

**Add new plan files when:**
- Planning a significant new feature
- Implementation pattern differs from standard CSS properties
- Want to preserve research for future reference

### Versioning

Include at bottom of each doc:
```markdown
**Document Version:** X.X
**Last Updated:** Date
**Based on:** Commit hash or feature name
```

---

## Future Documentation Ideas

Consider adding:
- `testing-patterns.md` - Unit/E2E test patterns
- `serialization-guide.md` - Deep dive on CSS serialization
- `ai-generation-guide.md` - How AI code generation works
- `performance-optimization.md` - Canvas rendering optimizations

---

**Created:** January 7, 2026
**Purpose:** Reduce AI context exploration time, preserve implementation knowledge