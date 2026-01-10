import tailwindClasses from './tailwind-classes.json';

// Extract class names from the JSON
const TAILWIND_UTILITIES = tailwindClasses.utilities.map(u => u.label);

// Common Tailwind modifiers (pseudo-classes, responsive breakpoints, etc.)
const TAILWIND_MODIFIERS = [
  // Pseudo-classes
  'hover', 'focus', 'active', 'visited', 'target', 'focus-within', 'focus-visible',
  'disabled', 'enabled', 'checked', 'indeterminate', 'default', 'required', 'valid',
  'invalid', 'in-range', 'out-of-range', 'placeholder-shown', 'autofill', 'read-only',
  // Pseudo-elements
  'before', 'after', 'placeholder', 'file', 'marker', 'selection', 'first-line',
  'first-letter', 'backdrop',
  // Group states
  'group-hover', 'group-focus', 'group-active', 'group-visited', 'peer-hover',
  'peer-focus', 'peer-checked', 'peer-disabled', 'peer-invalid', 'peer-required',
  // Responsive breakpoints
  'sm', 'md', 'lg', 'xl', '2xl',
  // Dark mode
  'dark',
  // Motion preferences
  'motion-safe', 'motion-reduce',
  // Contrast preferences
  'contrast-more', 'contrast-less',
  // RTL/LTR
  'ltr', 'rtl',
  // Print
  'print',
  // Orientation
  'portrait', 'landscape',
  // Supports
  'supports',
  // Has
  'has',
  // Not
  'not',
  // First, last, odd, even, etc.
  'first', 'last', 'only', 'odd', 'even',
  'first-of-type', 'last-of-type', 'only-of-type',
  // Open/closed
  'open', 'closed'
];

/** @type LanguageFn */
// @ts-ignore
export function tailwind(hljs) {
  const regex = hljs.regex;

  return {
    name: 'Tailwind',
    case_insensitive: false,
    contains: [
      // Important modifier (!)
      {
        className: 'meta',
        begin: /!/,
        relevance: 10
      },
      // Arbitrary values in square brackets [like-this] or [123px]
      {
        className: 'string',
        begin: /\[/,
        end: /\]/,
        contains: [
          {
            className: 'number',
            begin: /\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|deg|rad|turn|s|ms)?/
          },
          {
            className: 'number',
            begin: /#[0-9a-fA-F]{3,8}/
          }
        ]
      },
      // Modifiers with colon (hover:, md:, dark:, etc.)
      {
        className: 'keyword',
        begin: '\\b(' + TAILWIND_MODIFIERS.join('|') + ')(?=:)',
        relevance: 10
      },
      // Separator colon
      {
        className: 'punctuation',
        begin: /:/,
        relevance: 0
      },
      // Tailwind utility classes
      {
        className: 'built_in',
        begin: '\\b(' + TAILWIND_UTILITIES.join('|') + ')\\b',
        relevance: 10
      },
      // Numeric values in class names (like p-4, mt-8, text-lg, etc.)
      {
        className: 'built_in',
        begin: /\b[a-z-]+-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|full|screen|min|max|fit)\b/,
        relevance: 10
      },
      // Color utilities with variants (like bg-red-500, text-blue-300)
      {
        className: 'built_in',
        begin: /\b(bg|text|border|ring|divide|outline|shadow|from|via|to|accent|caret|decoration|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white)-(50|100|200|300|400|500|600|700|800|900|950)\b/,
        relevance: 10
      },
      // Arbitrary properties
      {
        className: 'attr',
        begin: /\[[a-zA-Z-]+:[^\]]+\]/
      },
      // Negative values (like -mt-4, -ml-2)
      {
        className: 'built_in',
        begin: /-[a-z][a-z0-9-]*/,
        relevance: 5
      },
      // Generic word boundaries for other Tailwind-like classes
      {
        className: 'title',
        begin: /\b[a-z][a-z0-9-]*\b/,
        relevance: 0
      }
    ]
  };
}

export { tailwind as default };
