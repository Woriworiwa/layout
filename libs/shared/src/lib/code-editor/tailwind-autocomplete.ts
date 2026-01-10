import { Extension } from '@codemirror/state';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import tailwindData from './tailwind-classes.json';

interface TailwindClass {
  label: string;
  detail: string;
  type: 'class' | 'variant';
}

const tailwindClasses = tailwindData.utilities as TailwindClass[];
const tailwindVariants = tailwindData.variants as TailwindClass[];

/**
 * Get the current word being typed at the cursor position
 */
function getCurrentWord(context: CompletionContext): { from: number; text: string; hasVariant: boolean } {
  const line = context.state.doc.lineAt(context.pos);
  const textBeforeCursor = line.text.slice(0, context.pos - line.from);

  // Find the last space before cursor (start of current word)
  const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
  const wordStart = line.from + lastSpaceIndex + 1;
  const currentWord = textBeforeCursor.slice(lastSpaceIndex + 1);

  // Check if current word has a variant prefix (e.g., "hover:")
  const hasVariant = currentWord.includes(':');

  return {
    from: wordStart,
    text: currentWord,
    hasVariant
  };
}

/**
 * Filter and score completions based on the input
 */
function filterCompletions(input: string, classes: TailwindClass[]): TailwindClass[] {
  if (!input) {
    return classes.slice(0, 50); // Return first 50 when no input
  }

  const lowerInput = input.toLowerCase();

  return classes
    .filter(item => {
      const label = item.label.toLowerCase();
      // Exact match or starts with
      return label === lowerInput || label.startsWith(lowerInput) || label.includes(lowerInput);
    })
    .sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();

      // Exact match first
      if (aLabel === lowerInput) return -1;
      if (bLabel === lowerInput) return 1;

      // Starts with second
      if (aLabel.startsWith(lowerInput) && !bLabel.startsWith(lowerInput)) return -1;
      if (bLabel.startsWith(lowerInput) && !aLabel.startsWith(lowerInput)) return 1;

      // Alphabetical
      return aLabel.localeCompare(bLabel);
    })
    .slice(0, 100); // Limit to 100 results
}

/**
 * Tailwind CSS autocomplete source
 */
function tailwindCompletionSource(context: CompletionContext): CompletionResult | null {
  const { from, text, hasVariant } = getCurrentWord(context);

  // If the current word has a variant (e.g., "hover:f"), suggest classes after the variant
  if (hasVariant) {
    const variantParts = text.split(':');
    const variant = variantParts[0];
    const classPrefix = variantParts.slice(1).join(':');

    const filtered = filterCompletions(classPrefix, tailwindClasses);

    return {
      from,
      options: filtered.map(item => ({
        label: `${variant}:${item.label}`,
        type: 'keyword',
        detail: item.detail,
        info: item.detail,
      })),
    };
  }

  // Check if typing a variant (ends with ':')
  if (text.endsWith(':') || (text && !text.includes(':'))) {
    // Suggest both variants and classes
    const variantMatches = filterCompletions(text.replace(':', ''), tailwindVariants);
    const classMatches = filterCompletions(text, tailwindClasses);

    return {
      from,
      options: [
        ...variantMatches.map(item => ({
          label: item.label,
          type: 'keyword',
          detail: item.detail,
          info: item.detail,
        })),
        ...classMatches.map(item => ({
          label: item.label,
          type: 'property',
          detail: item.detail,
          info: item.detail,
        })),
      ],
    };
  }

  // Default: suggest classes
  const filtered = filterCompletions(text, tailwindClasses);

  return {
    from,
    options: filtered.map(item => ({
      label: item.label,
      type: 'property',
      detail: item.detail,
      info: item.detail,
    })),
  };
}

/**
 * Create Tailwind CSS autocomplete extension for CodeMirror
 */
export function tailwindAutocomplete(): Extension {
  return autocompletion({
    override: [tailwindCompletionSource],
    activateOnTyping: true,
    maxRenderedOptions: 100,
  });
}
