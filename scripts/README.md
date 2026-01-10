# Scripts Documentation

## Tailwind Class Generation

### Purpose
Generates a comprehensive list of Tailwind CSS classes with their CSS values for use in the code editor's autocomplete feature.

### Script: `generate-tailwind-classes.js`

**Location:** `/scripts/generate-tailwind-classes.js`

**Output:** `/libs/shared/src/lib/code-editor/tailwind-classes.json`

### What It Generates

#### 1. **Utilities** (641+ classes)
Standard Tailwind utility classes with their corresponding CSS:

**Layout & Display:**
- `block`, `inline-block`, `flex`, `grid`, `hidden`
- Display properties with exact CSS values

**Flexbox & Grid:**
- `flex-row`, `flex-col`, `grid-cols-1` through `grid-cols-12`
- Flex direction, wrap, and grid template columns

**Spacing (Padding & Margin):**
- All spacing scales: `p-0` through `p-64`
- Directional variants: `pt`, `pr`, `pb`, `pl`, `px`, `py`
- Margin equivalents: `m-0` through `m-64`
- Gap utilities: `gap-0` through `gap-64`
- Calculated values (1 unit = 0.25rem)

**Sizing (Width & Height):**
- Fixed values: `w-0`, `w-full`, `w-screen`
- Fractional values: `w-1/2`, `w-1/3`, `w-2/3`, `w-1/4`, `w-3/4`
- Height equivalents

**Typography:**
- Font sizes: `text-xs`, `text-sm`, `text-base`, `text-lg` through `text-5xl`
- Text alignment: `text-left`, `text-center`, `text-right`, `text-justify`

**Colors:**
- 8 color palettes: gray, red, yellow, green, blue, indigo, purple, pink
- 9 shades per color: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- 3 color utilities: `bg-*`, `text-*`, `border-*`
- Total: 216 color classes

#### 2. **Variants** (18 variants)
Pseudo-class and responsive modifiers:

**Interactive:**
- `hover:`, `focus:`, `active:`, `visited:`
- `focus-within:`, `focus-visible:`
- `disabled:`, `enabled:`

**Structural:**
- `first:`, `last:`, `odd:`, `even:`

**Responsive:**
- `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)

**Dark Mode:**
- `dark:`

### How to Run

```bash
# Generate the class list
node scripts/generate-tailwind-classes.js

# Or use npm script (if added to package.json)
npm run generate:tailwind-classes
```

### Output Format

```json
{
  "utilities": [
    {
      "label": "flex",
      "detail": "display: flex;",
      "type": "class"
    },
    {
      "label": "p-4",
      "detail": "padding: 1rem;",
      "type": "class"
    }
  ],
  "variants": [
    {
      "label": "hover:",
      "detail": "Apply on hover",
      "type": "variant"
    }
  ]
}
```

### Customization

#### Adding More Classes

Edit `generate-tailwind-classes.js` and add to the `utilities` array:

```javascript
utilities.push({
  pattern: 'my-custom-class',
  css: 'property: value;'
});
```

#### Adding Custom Colors

```javascript
const colors = ['gray', 'red', 'blue', 'brand', 'accent'];
// Will generate: bg-brand-500, text-accent-200, etc.
```

#### Adding Custom Spacing

```javascript
const spacingValues = ['0', '1', '2', '3', '4', 'custom'];
// Will generate: p-custom, m-custom, gap-custom
```

### Limitations

**Current Implementation:**
- Static list (doesn't read `tailwind.config.js`)
- Default Tailwind values only
- No plugin-specific classes
- No arbitrary values `[123px]` support

**Future Enhancements:**
1. Read actual `tailwind.config.js` to include custom values
2. Generate plugin classes (e.g., from `tailwindcss-primeui`)
3. Support arbitrary values
4. Include hover states with actual CSS (e.g., `hover:bg-blue-500` → background changes on hover)

### Integration

The generated JSON is consumed by:
- **`tailwind-autocomplete.ts`** - CodeMirror autocomplete extension
- **Properties Panel** - Tailwind Classes input field

### Regeneration

Run the script whenever:
- Tailwind CSS version is updated
- You want to add/remove utility classes
- Custom utilities need to be added

### Notes

- Generation takes < 1 second
- Output file is ~30KB (gzips well)
- No runtime overhead (loaded as static JSON)
- Compatible with CodeMirror's completion format
