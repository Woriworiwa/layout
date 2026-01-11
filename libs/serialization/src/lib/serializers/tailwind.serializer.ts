import { CanvasItem, Css } from '@layout/models';
import { Serializer } from './serializer';
import { TAILWIND_DATA } from '@layout/shared';
import { POSTFIX_UNIT, POSTFIXED_PROPERTIES } from '../constants';

export class TailwindSerializer extends Serializer {
  private cssToTailwindMap: Map<string, string> = new Map();

  constructor() {
    super();
    this.buildReverseMap();
  }

  /**
   * Check if a CSS value already has a unit (px, rem, em, %, etc.)
   */
  private hasUnit(value: string): boolean {
    return /[a-z%]+$/i.test(value.trim());
  }

  /**
   * Build a reverse map from CSS declarations to Tailwind class names
   * Example: "display: flex;" -> "flex"
   */
  private buildReverseMap(): void {
    const utilities = TAILWIND_DATA.utilities;

    for (const utility of utilities) {
      // Normalize the CSS detail by trimming and ensuring it ends with semicolon
      const normalizedDetail = utility.detail.trim();
      const cssKey = normalizedDetail.endsWith(';')
        ? normalizedDetail.slice(0, -1).trim()
        : normalizedDetail;

      this.cssToTailwindMap.set(cssKey, utility.label);
    }
  }

  serialize(items: CanvasItem[]): string[] {
    if (items.length !== 1) {
      return [];
    }

    const css = items[0].css as Css;
    if (!css) {
      return [];
    }

    const tailwindClasses: string[] = [];

    /* loop through the root keys (spacing, sizing, display, container,...) */
    this.serializeItems(css, tailwindClasses);

    return tailwindClasses;
  }

  private serializeItems(css: Css, tailwindClasses: string[]): void {
    for (const key of Object.keys(css)) {
      const value = css[key as keyof Css];

      if (value == null) {
        continue;
      }

      /* loop through the subkeys of the root keys */
      for (const subKey of Object.keys(value)) {
        // Convert camelCase to kebab-case for CSS property names
        const cssPropertyName = subKey
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        let cssPropertyValue: string = value[subKey as keyof Css[keyof Css]];

        if (cssPropertyValue == null) {
          continue;
        }

        // Only add px postfix if the value doesn't already have a unit
        if (POSTFIXED_PROPERTIES.includes(subKey)) {
          if (!this.hasUnit(cssPropertyValue)) {
            cssPropertyValue += POSTFIX_UNIT;
          }
        }

        const tailwindClass = this.getTailwindClass(cssPropertyName, cssPropertyValue);
        if (tailwindClass) {
          tailwindClasses.push(tailwindClass);
        }
      }
    }
  }

  /**
   * Convert a CSS property-value pair to a Tailwind class
   * Falls back to arbitrary value syntax if no exact match found
   */
  private getTailwindClass(property: string, value: string): string {
    const cssDeclaration = `${property}: ${value}`;

    // Try exact match first
    const exactMatch = this.cssToTailwindMap.get(cssDeclaration);
    if (exactMatch) {
      return exactMatch;
    }

    // Fall back to arbitrary value syntax
    return this.generateArbitraryValue(property, value);
  }

  /**
   * Generate Tailwind arbitrary value syntax
   * Example: "padding: 17px" -> "p-[17px]"
   */
  private generateArbitraryValue(property: string, value: string): string {
    // Map CSS properties to Tailwind prefixes
    const propertyMap: Record<string, string> = {
      // Box Sizing
      'padding': 'p',
      'padding-top': 'pt',
      'padding-right': 'pr',
      'padding-bottom': 'pb',
      'padding-left': 'pl',
      'margin': 'm',
      'margin-top': 'mt',
      'margin-right': 'mr',
      'margin-bottom': 'mb',
      'margin-left': 'ml',
      'width': 'w',
      'height': 'h',
      'min-width': 'min-w',
      'min-height': 'min-h',
      'max-width': 'max-w',
      'max-height': 'max-h',

      // Flexbox
      'gap': 'gap',
      'row-gap': 'gap-y',
      'column-gap': 'gap-x',
      'flex-direction': 'flex',
      'flex-wrap': 'flex',
      'justify-content': 'justify',
      'align-items': 'items',
      'align-content': 'content',
      'flex': 'flex',
      'flex-grow': 'grow',
      'flex-shrink': 'shrink',
      'order': 'order',

      // Grid
      'grid-template-columns': 'grid-cols',
      'grid-template-rows': 'grid-rows',
      'grid-column': 'col',
      'grid-row': 'row',
      'grid-auto-flow': 'grid-flow',

      // Display (though these should be matched exactly)
      'display': 'display',
    };

    const prefix = propertyMap[property];
    if (prefix) {
      return `${prefix}-[${value}]`;
    }

    // If no mapping found, use the property name as-is
    return `[${property}:${value}]`;
  }
}
