import { CanvasItem, Css } from '@layout/models';
import { Serializer } from './serializer';
import { TailwindCssConverter } from '../tailwind-css-converter';

/**
 * Serializer that converts CSS properties to Tailwind class names.
 *
 * This serializer delegates to TailwindCssConverter for the actual conversion.
 * It maintains the Serializer interface for compatibility with the serialization system.
 *
 * @example
 * ```typescript
 * const serializer = new CssTailwindSerializer();
 * const classes = serializer.serialize([canvasItem]);
 * // Returns: ['flex', 'gap-4', 'justify-center']
 * ```
 */
export class CssTailwindSerializer extends Serializer<void> {
  private converter: TailwindCssConverter;

  constructor(converter?: TailwindCssConverter) {
    super();
    // Allow injection for testing, otherwise create a new instance
    this.converter = converter ?? new TailwindCssConverter();
  }

  /**
   * Serialize a canvas item's CSS to Tailwind classes.
   *
   * @param items Array of canvas items (only first item is processed)
   * @param _options Unused options parameter (for interface compatibility)
   * @returns Array of Tailwind class names
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serialize(items: CanvasItem[], _options?: void): string[] {
    if (items.length !== 1) {
      return [];
    }

    const css = items[0].css as Css;
    if (!css) {
      return [];
    }

    return this.converter.cssToTailwind(css);
  }
}
