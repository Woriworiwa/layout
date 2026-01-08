# CSS Anchor Positioning - Implementation Plan

**Feature:** CSS Anchor Positioning API
**Planned Date:** January 8, 2026
**Estimated Time:** 60-90 minutes

---

## What is CSS Anchor Positioning?

CSS Anchor Positioning allows elements to be positioned relative to other elements (anchors) without requiring parent-child relationships or absolute positioning hacks.

**Browser Support:** Chrome 125+, Edge 125+ (as of Jan 2024)

---

## CSS Properties to Add

### Container/Anchor Properties

**anchor-name** - Defines an element as an anchor
```css
.header {
  anchor-name: --my-header;
}
```

### Positioned Element Properties

**position-anchor** - References which anchor to use
```css
.tooltip {
  position: absolute;
  position-anchor: --my-header;
}
```

**Positioning with anchor() function** - Enhanced existing properties
```css
.tooltip {
  top: anchor(bottom);           /* Position below anchor */
  left: anchor(left);            /* Align with anchor's left */
  right: anchor(right);          /* Align with anchor's right */
  bottom: anchor(top);           /* Position above anchor */
}
```

**anchor-scope** - Limits anchor lookup scope
```css
.container {
  anchor-scope: --my-header;
}
```

**position-try-options** - Fallback positions if anchor doesn't fit
```css
.tooltip {
  position-try-options: flip-block, flip-inline;
}
```

**position-visibility** - Controls visibility when anchor is off-screen
```css
.tooltip {
  position-visibility: anchors-visible;
}
```

---

## Implementation Strategy

### Phase 1: Basic Anchor Support (v1)

**Add these properties first:**
1. `anchor-name` (container/any element)
2. `position-anchor` (positioned element)
3. Enhanced `top`, `left`, `right`, `bottom` to support `anchor()` function

**Skip for v1:**
- `anchor-scope` (advanced)
- `position-try-options` (advanced)
- `position-visibility` (advanced)

### Phase 2: Advanced Features (v2+)
- Full `anchor()` function support with sides/percentages
- Fallback positions
- Visibility controls

---

## Model Design

### Question: Where do these properties belong?

**anchor-name:**
- Could apply to any element (not just containers)
- **Recommendation:** Create new `AnchorProperties` interface or add to `BoxSizing`

**position-anchor:**
- Only applies to positioned elements (absolute, fixed)
- **Recommendation:** Add to existing positioning properties or create `PositionProperties`

### Proposed Structure

```typescript
// libs/models/src/lib/css-models/anchor.ts (NEW)
export const ANCHOR_PROPERTY_NAMES = [
  'anchorName',
  'positionAnchor',
] as const satisfies readonly (keyof CSS.Properties)[];

export interface Anchor extends Pick<CSS.Properties, AnchorPropertyName> {}
```

```typescript
// libs/models/src/lib/css-models/css.ts
export interface Css {
  display?: Layout;
  container?: Container;
  flexContainer?: FlexContainer;
  flexItem?: FlexItem;
  gridContainer?: GridContainer;
  gridItem?: GridItem;
  boxSizing?: BoxSizing;
  anchor?: Anchor;  // ← ADD THIS
}
```

---

## UI Design

### Anchor Name Control

**Component:** `TextFieldComponent`
**Presets:**
```typescript
anchorNamePresets = [
  { label: 'header', value: '--header' },
  { label: 'sidebar', value: '--sidebar' },
  { label: 'nav', value: '--nav' },
  { label: 'button', value: '--button' },
  { label: 'tooltip-anchor', value: '--tooltip-anchor' },
];
```

**Placement:** New "Anchor" property group or add to existing positioning group

### Position Anchor Control

**Component:** `TextFieldComponent`
**Presets:**
```typescript
positionAnchorPresets = [
  { label: 'header', value: '--header' },
  { label: 'sidebar', value: '--sidebar' },
  { label: 'nav', value: '--nav' },
  { label: 'button', value: '--button' },
];
```

**Note:** Ideally, presets would dynamically show anchor names defined in the current canvas, but that's v2+

### Top/Left/Right/Bottom Enhancement

**Challenge:** These properties now accept:
- Lengths: `10px`, `2rem`, `50%`
- Keyword: `auto`
- **NEW:** `anchor()` function: `anchor(top)`, `anchor(bottom 10px)`

**Options:**

1. **Simple (v1):** Keep as regular text field, users type `anchor(bottom)`
2. **Advanced (v2):** Add toggle between "Length" and "Anchor" modes

**Recommendation for v1:** Simple text field approach

---

## Implementation Checklist

### Step 1: Models (15 min)

- [ ] Create `libs/models/src/lib/css-models/anchor.ts`
- [ ] Add `Anchor` interface
- [ ] Update `libs/models/src/lib/css-models/css.ts` to include `anchor?: Anchor`
- [ ] Export from `libs/models/src/lib/css-models/index.ts`

### Step 2: Property Group Component (30 min)

**Option A:** Create new `properties-anchor.component.ts`
**Option B:** Add to existing positioning component (if it exists)

**Recommendation:** Create new component for clarity

- [ ] Create `apps/boxout/src/app/properties-panel/groups/properties-anchor.component.ts`
- [ ] Add form controls for `anchorName` and `positionAnchor`
- [ ] Add presets
- [ ] Create template with property rows

### Step 3: Property Panel Integration (10 min)

- [ ] Import `PropertiesAnchorComponent`
- [ ] Add to properties panel template
- [ ] Decide on conditional display (always show vs. only for positioned elements)

### Step 4: AI Schema Generator (5 min)

```typescript
anchorName: {
  type: 'custom',
  description: 'string (dashed-ident, e.g., "--header", "--tooltip-anchor")',
},
positionAnchor: {
  type: 'custom',
  description: 'string (dashed-ident, e.g., "--header", "--button")',
},
```

### Step 5: Positioning Properties Enhancement (Optional, 20 min)

If adding `anchor()` support to top/left/right/bottom:

- [ ] Update `top`, `left`, `right`, `bottom` descriptions in AI schema
- [ ] Add example presets with `anchor()` values
- [ ] Update placeholder text to show `anchor()` examples

### Step 6: Testing (20 min)

- [ ] Build passes
- [ ] Anchor name can be set on any element
- [ ] Position anchor can reference anchor name
- [ ] CSS export shows correct syntax
- [ ] Test in browser (Chrome 125+)

---

## Example Use Case: Tooltip

**Goal:** Create a tooltip that positions itself below a button

**Button (Anchor):**
```css
.button {
  anchor-name: --my-button;
}
```

**Tooltip (Positioned Element):**
```css
.tooltip {
  position: absolute;
  position-anchor: --my-button;
  top: anchor(bottom);
  left: anchor(center);
}
```

**In the UI:**
1. Select button → Set "anchor-name" to `--my-button`
2. Select tooltip → Set "position" to `absolute`
3. Select tooltip → Set "position-anchor" to `--my-button`
4. Select tooltip → Set "top" to `anchor(bottom)`
5. Select tooltip → Set "left" to `anchor(center)`

---

## Challenges & Considerations

### 1. Browser Support Detection

**Issue:** Not all browsers support anchor positioning yet

**Options:**
- Add browser compatibility warning in UI
- Show warning when anchor properties are used
- Skip for v1 (assume modern browsers)

### 2. Anchor Name Validation

**Issue:** Position-anchor references must match existing anchor-name values

**Options:**
- No validation (v1) - let CSS fail naturally
- Warning if reference doesn't exist (v2)
- Dropdown showing available anchors (v2+)

### 3. anchor() Function Syntax

**Issue:** Complex syntax: `anchor(--my-anchor bottom 10px)`

**Options:**
- Simple text field (v1) - users type manually
- Structured input with dropdowns (v2)
- Visual anchor picker (v3)

**Recommendation:** Start simple (text field), iterate based on user feedback

### 4. Property Grouping

**Issue:** Where to show these controls?

**Options:**
- New "Anchor" group (always visible)
- Add to "Position" group (if exists)
- Show conditionally based on `position` value

**Recommendation:** New group, always visible (like Grid/Flex groups)

---

## Files to Create/Modify

### New Files (2)
- `libs/models/src/lib/css-models/anchor.ts`
- `apps/boxout/src/app/properties-panel/groups/properties-anchor.component.ts`

### Modified Files (3-4)
- `libs/models/src/lib/css-models/css.ts`
- `libs/models/src/lib/css-models/index.ts`
- `apps/boxout/src/app/properties-panel/properties-panel.component.ts` (import & template)
- `apps/boxout/src/app/core/services/ai-schema-generator.service.ts`
- (Optional) `libs/models/src/lib/css-models/box-sizing.ts` - if enhancing top/left/right/bottom

---

## Open Questions for Tomorrow

1. **Scope:** Just anchor-name and position-anchor, or also enhance top/left/right/bottom?
2. **UI placement:** New "Anchor" group or integrate with existing positioning?
3. **Browser support:** Show warning or assume modern browsers?
4. **Validation:** Any validation or let CSS handle it?
5. **Conditional display:** Always show or only for positioned elements?

---

## References

- [MDN: CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- [Chrome DevRel: Anchor Positioning](https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/)
- [CSS Tricks: Anchor Positioning](https://css-tricks.com/css-anchor-positioning/)

---

**Status:** Ready for implementation
**Next Steps:** Review plan, answer open questions, execute checklist