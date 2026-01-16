# Guide: Adding CSS Properties to the Layout Generator

**Last Updated:** January 7, 2026
**Based on:** grid-template-areas implementation (commit 9bef13c)

This guide documents the exact pattern for adding new CSS properties to the layout generator. Following this pattern ensures consistency with the existing architecture and minimal implementation time.

---

## Quick Reference: Implementation Checklist

- [ ] **Step 1:** Add property to CSS model (GridContainer, GridItem, FlexContainer, etc.)
- [ ] **Step 2:** Create/update UI component if needed (TextField, TextAreaField, ButtonGroup, NumberField)
- [ ] **Step 3:** Add form control to property group component
- [ ] **Step 4:** Add UI row to property group template
- [ ] **Step 5:** Add presets (if applicable)
- [ ] **Step 6:** Update AI schema generator
- [ ] **Step 7:** Build and test

**Estimated Time:** 15-45 minutes depending on complexity

---

## Architecture Overview

### Key Principle: Model-Driven Development

The architecture uses **single source of truth arrays** that drive everything else:

```typescript
export const GRID_CONTAINER_PROPERTY_NAMES = [
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',  // ← Add here
  // ...
] as const satisfies readonly (keyof CSS.Properties)[];
```

**What this gives you automatically:**
- ✅ TypeScript type inference from `CSS.Properties`
- ✅ Automatic serialization (camelCase → kebab-case)
- ✅ Type-safe interfaces via `Pick<CSS.Properties, PropertyName>`
- ✅ Compile-time validation (TypeScript will error if property doesn't exist in CSS.Properties)

### Data Flow

```
User Input → FormControl → PropertiesService.updateCssWithSplit()
    ↓
CanvasService.updateCss() (orchestration)
    ↓
CanvasStore.updateItemCss() (pure function, returns new array)
    ↓
CanvasService.setItems() (persists state)
    ↓
Observable update → Component re-render
    ↓
CssStyleSerializer converts CSS object to inline styles
```

### CSS Object Structure

```typescript
export interface Css {
  display?: Layout;
  container?: Container;      // Shared between Flex & Grid (gap, justify-content, etc.)
  flexContainer?: FlexContainer;  // Flex-specific
  flexItem?: FlexItem;
  gridContainer?: GridContainer;  // Grid-specific
  gridItem?: GridItem;
  boxSizing?: BoxSizing;
}
```

---

## Step-by-Step Implementation Pattern

### Step 1: Add Property to CSS Model

**Location:** `libs/models/src/lib/css-models/`

**Files:**
- `gridContainer.ts` - Grid container properties
- `grid-item.ts` - Grid item properties
- `flexContainer.ts` - Flex container properties
- `flex-item.ts` - Flex item properties
- `container.ts` - Shared container properties (gap, justify-content, etc.)
- `box-sizing.ts` - Box model properties (width, height, padding, margin, etc.)
- `display.ts` - Display property

**Example (grid-template-areas):**

```typescript
// libs/models/src/lib/css-models/gridContainer.ts

export const GRID_CONTAINER_PROPERTY_NAMES = [
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',  // ← ADD THIS
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
] as const satisfies readonly (keyof CSS.Properties)[];

// Interface is auto-generated via Pick utility type
export interface GridContainer extends Pick<
  CSS.Properties,
  GridContainerPropertyName
> {}
```

**Important:**
- Property name MUST exist in `csstype`'s `CSS.Properties` interface
- Use camelCase (will be converted to kebab-case automatically)
- Position logically (related properties together)

---

### Step 2: Choose/Create UI Component

**Location:** `apps/boxout/src/app/properties-panel/components/`

**Available Components:**

| Component | Use Case | Example Properties |
|-----------|----------|-------------------|
| `TextFieldComponent` | Single-line string input | grid-template-columns, flex-basis |
| `TextAreaFieldComponent` | Multi-line string input | grid-template-areas |
| `NumberField` | Numeric values with units | width, height, gap, padding |
| `ButtonGroupComponent` | Enum/predefined values | display, flex-direction, align-items |

**When to Create New Component:**
- Only if existing components don't fit the use case
- Follow the pattern from existing components (extend `BaseFormItemComponent`)

**Example - TextAreaFieldComponent (created for grid-template-areas):**

```typescript
// Clone from TextFieldComponent, key changes:
import { Textarea } from 'primeng/textarea';  // Instead of InputText

template: `
  <textarea pTextarea [formControl]="control()!" [rows]="rows()"></textarea>
  <!-- Rest same as TextField -->
`,

styles: `
  textarea {
    font-family: 'Courier New', Courier, monospace;  // Monospace for alignment
    resize: vertical;
  }
`
```

---

### Step 3: Add Form Control to Property Group

**Location:** `apps/boxout/src/app/properties-panel/groups/`

**Files:**
- `grid-container.component.ts` - Grid container properties
- `grid-item.component.ts` - Grid item properties
- `flex-container.component.ts` - Flex container properties
- `flex-item.component.ts` - Flex item properties
- `sizing-spacing.component.ts` - Box model properties

**Add to `createFormGroup()` method:**

```typescript
// apps/boxout/src/app/properties-panel/groups/grid-container.component.ts

override createFormGroup() {
  // ...
  const formGroup = this.formBuilder.group({
    gridTemplateColumns: new FormControl<Property.GridTemplateColumns | null | undefined>(null),
    gridTemplateRows: new FormControl<Property.GridTemplateRows | null | undefined>(null),
    gridTemplateAreas: new FormControl<Property.GridTemplateAreas | null | undefined>(null),  // ← ADD
    // ...
  });

  // No changes needed to valueChanges subscription - it automatically handles all form controls
  return formGroup;
}
```

**Important:**
- Use `Property.PropertyName` type from `csstype`
- Always include `| null | undefined` for optional properties
- No need to modify `valueChanges` subscription - it processes all controls automatically

---

### Step 4: Add UI Row to Template

**Location:** `apps/boxout/src/app/properties-panel/groups/` (HTML templates)

**Pattern:**

```html
<app-property-row label="property-name">
  <app-{component-type}
    [control]="getFormControl('propertyName')"
    [presets]="propertyNamePresets"
    placeholder="helpful example"
  ></app-{component-type}>
</app-property-row>
```

**Example (grid-template-areas):**

```html
<!-- Insert after gridTemplateRows for logical grouping -->
<app-property-row label="grid-template-areas">
  <app-text-area-field
    [control]="getFormControl('gridTemplateAreas')"
    [presets]="gridTemplateAreasPresets"
    [rows]="3"
    placeholder='e.g., "header header"&#10;"sidebar main"'
  ></app-text-area-field>
</app-property-row>
```

**Notes:**
- `label` uses kebab-case (matches CSS property name)
- `getFormControl()` uses camelCase (matches form control name)
- `&#10;` is HTML entity for newline in placeholders
- Position logically with related properties

**Don't forget to import the component:**

```typescript
import { TextAreaFieldComponent } from '../components/text-area-field.component';

@Component({
  imports: [
    // ...
    TextAreaFieldComponent,  // ← ADD
  ],
})
```

---

### Step 5: Add Presets (Optional but Recommended)

**Add as class property in the component:**

```typescript
gridTemplateAreasPresets = [
  {
    label: 'Blog Layout',
    value: '"header header"\n"content sidebar"\n"footer footer"',
  },
  {
    label: 'Magazine',
    value: '"header header header"\n"featured featured sidebar"\n"article1 article2 sidebar"\n"footer footer footer"',
  },
  // ...
];
```

**Preset Guidelines:**
- 3-7 presets (too many is overwhelming)
- Cover common use cases
- Use descriptive labels
- Values should be valid CSS

**Common Preset Patterns:**

| Property Type | Preset Examples |
|--------------|----------------|
| Columns/Rows | '1fr', '1fr 1fr', 'repeat(3, 1fr)', 'auto 1fr' |
| Sizes | 'auto', '100px', '1fr', 'min-content', 'max-content' |
| Enums | Handled by ButtonGroup (no need for presets) |
| Multi-line | Use `\n` for newlines in preset values |

---

### Step 6: Update AI Schema Generator

**Location:** `apps/boxout/src/app/core/services/ai-schema-generator.service.ts`

**Why:** The AI schema generator creates JSON schemas for AI code generation. It MUST include all CSS properties or TypeScript will error at compile time.

**Pattern:**

```typescript
private readonly PROPERTY_VALUE_MAP: RequireAllProperties = {
  // ... existing properties

  gridTemplateAreas: {
    type: 'custom',
    description: 'string with newlines (e.g., "\\"header header\\"\\n\\"nav main\\"")',
  },

  // ... more properties
};
```

**Description Types:**

| Type | When to Use | Example |
|------|-------------|---------|
| `string[]` | Enum/predefined values | `['flex', 'grid']` |
| `{ type: 'custom', description: string }` | Custom string values | grid-template-columns, flex-basis |
| `{ type: 'unit', description: string }` | Values with units | width, height |

**Getting Enum Options:**

```typescript
// For enums defined in @layout/models
display: DisplayOptions.filter((opt) => opt === 'flex' || opt === 'grid') as string[],
justifyContent: JustifyContentOptions.filter((opt) => opt !== undefined) as string[],
```

---

## Common Scenarios

### Scenario 1: Adding a Simple String Property

**Example:** `grid-auto-columns`

1. Add to model: `libs/models/src/lib/css-models/gridContainer.ts`
2. Add form control: `new FormControl<Property.GridAutoColumns | null | undefined>(null)`
3. Add UI row with `TextFieldComponent` and presets
4. Update AI schema: `{ type: 'custom', description: '...' }`

**Time:** ~15 minutes

---

### Scenario 2: Adding an Enum Property

**Example:** `flex-direction`

1. Add to model: `libs/models/src/lib/css-models/flexContainer.ts`
2. Import enum from `@layout/models` (or create if doesn't exist)
3. Add form control
4. Add UI row with `ButtonGroupComponent` and `[options]="FlexDirectionOptions"`
5. Update AI schema with filtered enum values

**Time:** ~20 minutes

---

### Scenario 3: Adding a Numeric Property with Units

**Example:** `width`, `padding`

1. Add to model: `libs/models/src/lib/css-models/box-sizing.ts`
2. Add form control with `updateOn: 'blur'` option
3. Add UI row with `NumberField` component
4. Update AI schema with unit type
5. Check if property needs auto-postfix in `libs/serialization/src/lib/constants.ts`

**Time:** ~20 minutes

---

### Scenario 4: Adding a Multi-line String Property

**Example:** `grid-template-areas` (what we just did)

1. Add to model
2. Use `TextAreaFieldComponent` (or create if doesn't exist)
3. Add form control
4. Add UI row with `[rows]="3"` and newline placeholder
5. Add presets with `\n` for newlines
6. Update AI schema

**Time:** ~45 minutes (includes component creation)

---

## Files Reference

### Core Files You'll Touch

**Models (always required):**
```
libs/models/src/lib/css-models/
  ├── gridContainer.ts       # Grid container properties
  ├── grid-item.ts          # Grid item properties
  ├── flexContainer.ts      # Flex container properties
  ├── flex-item.ts          # Flex item properties
  ├── container.ts          # Shared container properties
  ├── box-sizing.ts         # Box model properties
  └── display.ts            # Display property
```

**Property Groups (add form controls & UI):**
```
apps/boxout/src/app/properties-panel/groups/
  ├── grid-container.component.ts      # Grid container UI
  ├── grid-item.component.ts           # Grid item UI
  ├── flex-container.component.ts      # Flex container UI
  ├── flex-item.component.ts           # Flex item UI
  └── sizing-spacing.component.ts          # Box sizing UI
```

**UI Components:**
```
apps/boxout/src/app/properties-panel/components/
  ├── text-field.component.ts          # Single-line input
  ├── text-area-field.component.ts     # Multi-line input
  ├── number-field.ts                  # Numeric input with units
  ├── button-group.component.ts        # Enum selector
  └── property-row.component.ts        # Row wrapper (don't modify)
```

**AI Integration (always required):**
```
apps/boxout/src/app/core/services/
  └── ai-schema-generator.service.ts   # Add to PROPERTY_VALUE_MAP
```

### Files You'll Never Touch

**These work automatically:**
- `libs/serialization/` - Serialization is automatic (camelCase → kebab-case)
- `libs/canvas/src/lib/canvas.service.ts` - Generic CSS handling
- `libs/canvas/src/lib/canvas.store.ts` - Pure data operations
- `apps/boxout/src/app/properties-panel/properties.service.ts` - Generic CSS updates

**Exception:** Only touch `libs/serialization/src/lib/constants.ts` if property needs auto-postfix (like `gap` gets "px")

---

## Serialization Notes

### Automatic Conversion

The serializer automatically handles:
- camelCase → kebab-case: `gridTemplateAreas` → `grid-template-areas`
- String values: Passed through as-is
- Numeric values: Converted to strings

### Multi-line Strings

Multi-line strings are serialized exactly as stored:

**Input:**
```typescript
gridTemplateAreas: '"header header"\n"sidebar main"\n"footer footer"'
```

**Output CSS:**
```css
grid-template-areas: "header header"
"sidebar main"
"footer footer";
```

### Auto-Postfix Properties

Some properties get automatic unit postfix (defined in `libs/serialization/src/lib/constants.ts`):

```typescript
export const POSTFIXED_PROPERTIES = ['gap'];
export const POSTFIX_UNIT = 'px';
```

**When to add:** Numeric properties that always use the same unit (px, em, etc.)

---

## Testing Checklist

### Build Test
```bash
npx nx build boxout
```

### Manual Testing
1. **Basic Functionality:**
   - [ ] Create container with the layout type (grid/flex)
   - [ ] Property input appears in properties panel
   - [ ] Input value updates
   - [ ] Clear button works

2. **Presets:**
   - [ ] Preset menu appears
   - [ ] Each preset populates correctly
   - [ ] Preset values are valid

3. **Canvas Rendering:**
   - [ ] Property applies visually on canvas
   - [ ] Invalid values don't break rendering

4. **Serialization:**
   - [ ] Export to CSS (inline) - check format
   - [ ] Export to CSS (class) - check format
   - [ ] Export to HTML - property appears
   - [ ] Export to JSON - property appears

5. **State Management:**
   - [ ] Undo/redo works
   - [ ] Value persists on item re-selection

### TypeScript Compilation

If you see this error:
```
Type '{ ... }' is missing the following properties from type 'RequireAllProperties': propertyName
```

**Fix:** Add the property to `PROPERTY_VALUE_MAP` in `ai-schema-generator.service.ts`

---

## Example: Full Implementation of grid-template-areas

**Commit:** 9bef13c
**Time:** ~45 minutes total (including TextAreaFieldComponent creation)

### Files Modified/Created

1. ✅ `libs/models/src/lib/css-models/gridContainer.ts` - Added 'gridTemplateAreas'
2. ✅ `libs/models/src/lib/css-models/grid-item.ts` - Added 'gridArea'
3. ✅ `apps/boxout/src/app/properties-panel/components/text-area-field.component.ts` - NEW
4. ✅ `apps/boxout/src/app/properties-panel/groups/grid-container.component.ts` - Form control + presets + UI
5. ✅ `apps/boxout/src/app/properties-panel/groups/grid-item.component.ts` - Form control + presets + UI
6. ✅ `apps/boxout/src/app/core/services/ai-schema-generator.service.ts` - AI schema updates

**Total:** 6 files (1 new, 5 modified), 180 insertions

---

## Next Features to Add

### High Priority (Related to Layout)

1. **CSS Anchor Positioning** (New!)
   - `anchor-name` (container property)
   - `position-anchor` (item property)
   - `anchor()` function support in positioning properties
   - **Complexity:** Medium (new positioning paradigm)

2. **Container Queries**
   - `container-type` (container property)
   - `container-name` (container property)
   - **Complexity:** Low (similar to display property)

3. **Aspect Ratio**
   - `aspect-ratio` (box-sizing property)
   - **Complexity:** Very Low (single property, like width/height)

4. **Position System Enhancement**
   - `position: sticky`, `position: fixed`, `position: absolute`
   - `top`, `right`, `bottom`, `left`
   - `inset` (shorthand)
   - **Complexity:** Low-Medium

### Implementation Estimates

| Feature | New Components | Files Modified | Est. Time |
|---------|---------------|----------------|-----------|
| Aspect Ratio | 0 | 3 | 15 min |
| Container Queries | 0 | 4 | 20 min |
| Position System | 0 | 5 | 30 min |
| CSS Anchor Positioning | Possibly 1 | 6-8 | 60-90 min |

---

## Architecture Decisions (Historical Context)

### Why Model Arrays?

**Decision:** Use `const` arrays with `satisfies readonly (keyof CSS.Properties)[]`

**Benefits:**
- Single source of truth
- Compile-time validation
- Automatic type inference
- No manual interface definitions

### Why Split Container vs Layout-Specific?

**Decision:** `container` (shared) vs `gridContainer`/`flexContainer` (specific)

**Reason:**
- `gap`, `justifyContent`, `alignItems` work for both Grid and Flex
- Avoids duplication
- `PropertiesService.updateCssWithSplit()` handles the merge/split automatically

### Why No Validation?

**Decision:** Let CSS fail naturally instead of validating syntax

**Reason:**
- CSS is forgiving (invalid properties just don't apply)
- Users see results immediately on canvas
- Keeps implementation simple
- Can add validation warnings in v2 if needed

---

## Tips for Future Implementations

1. **Start with the model** - Everything else follows from there
2. **Check existing components first** - Don't create new ones unnecessarily
3. **Copy-paste is OK** - Form control patterns are repetitive by design
4. **Presets are valuable** - They guide users and showcase capabilities
5. **Test the build early** - Catches AI schema issues immediately
6. **Position properties logically** - Group related properties together in UI
7. **Follow existing patterns exactly** - The architecture is intentionally consistent

---

## Questions & Troubleshooting

### Q: Property doesn't show up in properties panel?

Check:
1. Is display type correct? (grid-template-areas only shows for `display: grid`)
2. Did you add the form control?
3. Did you add the UI row in the template?
4. Did you import the component in the `imports` array?

### Q: Build fails with "missing properties from RequireAllProperties"?

**Fix:** Add the property to `PROPERTY_VALUE_MAP` in `ai-schema-generator.service.ts`

### Q: Property value doesn't persist?

Check:
1. Is the form control name correct (camelCase)?
2. Does `valueChanges` subscription exist in `createFormGroup()`?
3. Is `PropertiesService` method correct? (`updateCssWithSplit` for container/layout-specific, `updateCssCategory` for others)

### Q: Serialization output is wrong?

Check:
1. Property name in model matches `CSS.Properties` (camelCase)
2. Value format is correct (string, not object)
3. If needs auto-postfix, add to `POSTFIXED_PROPERTIES`

---

**Document Version:** 1.0
**Last Implementation:** grid-template-areas (Jan 7, 2026)
**Next Planned:** CSS Anchor Positioning
