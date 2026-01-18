---
name: designing-layouts
description: Guide design decisions for a low-code CSS layout generator. Use this skill when the user ask for tasks related to UI/UX choices, designing component architecture, creating layout presets, working on canvas interactions, or making design system decisions. Generates creative, polished code that avoids generic AI aesthetics
---

# Design Engineer

Bridges design thinking with technical implementation for the layout application.
This skill focuses on design principles and decision-making criteria.

## Scope

Use for: Dashboards, admin panels, SaaS apps, tools, settings pages, data interfaces.
Not for: Landing pages, marketing sites, campaigns. Redirect those to /frontend-design.

## Responsibilities

1. **Design System Decisions**: Choose appropriate patterns, spacing, colors, and component structures
2. **Component Architecture**: Design reusable, accessible, and maintainable components
3. **Layout Expertise**: CSS Grid, Flexbox, and responsive design patterns
4. **User Experience**: Consider how users interact with the canvas editor
5. **Preset Creation**: Design reusable layout templates that solve real-world problems

---

# Design Principles

### Visual Hierarchy
- Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px
- Padding: Keep it symmetrical. If one side is 16px, others should match unless there's a clear reason.
- Depth: 
  - Use **Subtle shadows** — Soft lift for cards layouts like the presets panel.
  - Use **Borders-only** — Clean, technical. For dense tools like properties panel.
- Border Radius: Sharper feels technical. Rounder feels friendly. Pick a scale and apply consistently.
- Typography: Headlines need weight and tight tracking. Body needs readability. Data needs monospace. Build a hierarchy.
- Color: Gray builds structure. Color communicates meaning — status, action, emphasis. Decorative color is noise.
- Animation: Fast micro-interactions (~150ms), smooth easing. No bouncy/spring effects.

### Interaction Design
- Click to select, double-click to edit
- Drag handles: discoverable but not intrusive
- Context menus for advanced actions
- Keyboard shortcuts for power users

---

# Preset Design

## Best Practices
1. **Meaningful defaults**: Reasonable widths, gaps, padding
2. **Semantic labels**: Name by purpose (header, sidebar, main)
3. **Flexible sizing**: Prefer `fr` units and `flex-grow` over fixed widths
4. **Nested structure**: Group related items logically

---

# Review Criteria

1. **Consistency**: Matches existing patterns?
2. **Simplicity**: Simplest solution?
3. **Flexibility**: Adapts to different content?
4. **Performance**: Unnecessary re-renders?
5. **Accessibility**: Meets WCAG AA?
6. **Maintainability**: Easy to understand and modify?

---

# Avoid

- Dramatic drop shadows
- Large radius on small elements
- Pure white cards on colored backgrounds
- Thick decorative borders
- Excessive spacing (>48px margins)
- Gradients for decoration
- Multiple accent colors

---

# Deep Dives

For more detail on specific topics:
- `references/principles.md` — Code examples, specific values, dark mode
- `references/directions.md` — The 6 design personalities
- `references/validation.md` — Memory management, when to update system.md
