import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { StreamLanguage } from '@codemirror/language';

// Simple tokenizer for Tailwind classes
const tailwindLanguage = StreamLanguage.define({
  name: 'tailwind',
  token(stream) {
    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    // Check for variant prefix (hover:, focus:, sm:, etc.)
    if (stream.match(/^[a-z0-9-]+:/)) {
      return 'keyword';
    }

    // Check for bracket notation [...]
    if (stream.match(/^\[/)) {
      stream.match(/[^\]]*\]/);
      return 'string';
    }

    // Match class name with optional numbers and slashes
    if (stream.match(/^[a-z][a-z0-9-]*(?:\/[0-9]+)?/)) {
      return 'variableName';
    }

    // Match numbers
    if (stream.match(/^[0-9]+/)) {
      return 'number';
    }

    // Skip separator characters
    if (stream.match(/^[:\-/]/)) {
      return 'operator';
    }

    // Move forward if nothing matches
    stream.next();
    return null;
  },
});

// Define highlighting colors
const tailwindHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#d73a49' }, // Red for variants (hover:, focus:)
  { tag: t.variableName, color: '#005cc5' }, // Blue for class names
  { tag: t.number, color: '#22863a' }, // Green for numbers
  { tag: t.operator, color: '#6f42c1' }, // Purple for separators
  { tag: t.string, color: '#e36209' }, // Orange for brackets
]);

// Export the extension
export function codemirrorsHighlighter(): Extension {
  return [
    tailwindLanguage,
    syntaxHighlighting(tailwindHighlightStyle),
  ];
}
