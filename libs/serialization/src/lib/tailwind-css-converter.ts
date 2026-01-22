import { Injectable } from '@angular/core';
import { Css } from '@layout/models';
import { TAILWIND_DATA } from '@layout/shared';
import {
  TAILWIND_TO_CSS_MAP,
  CSS_PROPERTY_TO_TAILWIND_PREFIX,
  TailwindToCssMapping,
  buildCssToTailwindMap,
} from './tailwind-to-css-map';

/**
 * Result of parsing a Tailwind class string.
 */
export interface TailwindParseResult {
  /** CSS properties extracted from supported Tailwind classes */
  css: Partial<Css>;
  /** Classes that couldn't be mapped to CSS properties (variants, unsupported utilities, etc.) */
  unsupportedClasses: string[];
}

/**
 * Patterns for parsing arbitrary value Tailwind classes.
 * Example: gap-[17px], w-[200px], p-[1.5rem]
 */
interface ArbitraryValuePattern {
  /** Regex pattern to match the class */
  pattern: RegExp;
  /** CSS category in the Css interface */
  category: keyof Css;
  /** CSS property name (camelCase) */
  property: string;
}

const ARBITRARY_VALUE_PATTERNS: ArbitraryValuePattern[] = [
  // Spacing
  { pattern: /^p-\[(.+)\]$/, category: 'spacing', property: 'padding' },
  { pattern: /^m-\[(.+)\]$/, category: 'spacing', property: 'margin' },

  // Sizing
  { pattern: /^w-\[(.+)\]$/, category: 'sizing', property: 'width' },
  { pattern: /^h-\[(.+)\]$/, category: 'sizing', property: 'height' },

  // FlexboxGrid
  { pattern: /^gap-\[(.+)\]$/, category: 'flexboxGrid', property: 'gap' },
  { pattern: /^basis-\[(.+)\]$/, category: 'flexboxGrid', property: 'flexBasis' },
  { pattern: /^grow-\[(.+)\]$/, category: 'flexboxGrid', property: 'flexGrow' },
  { pattern: /^shrink-\[(.+)\]$/, category: 'flexboxGrid', property: 'flexShrink' },
  { pattern: /^grid-cols-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridTemplateColumns' },
  { pattern: /^grid-rows-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridTemplateRows' },
  { pattern: /^col-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridColumn' },
  { pattern: /^row-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridRow' },
  { pattern: /^col-start-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridColumnStart' },
  { pattern: /^col-end-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridColumnEnd' },
  { pattern: /^row-start-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridRowStart' },
  { pattern: /^row-end-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridRowEnd' },
  { pattern: /^auto-cols-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridAutoColumns' },
  { pattern: /^auto-rows-\[(.+)\]$/, category: 'flexboxGrid', property: 'gridAutoRows' },
];

/**
 * Bidirectional converter between CSS properties and Tailwind classes.
 *
 * This service provides two-way conversion:
 * - `cssToTailwind()`: Convert CSS model properties to Tailwind class names
 * - `tailwindToCss()`: Parse Tailwind class string into CSS model properties
 *
 * Only properties defined in the Css interface are supported. Unsupported
 * Tailwind classes (colors, typography, responsive variants, etc.) are
 * returned separately for preservation.
 */
@Injectable({ providedIn: 'root' })
export class TailwindCssConverter {
  /** Map from CSS declarations to Tailwind classes (built from TAILWIND_DATA) */
  private cssDeclarationToTailwindMap: Map<string, string> = new Map();

  /** Map from "category.property:value" to Tailwind class */
  private cssToTailwindMap: Map<string, string>;

  constructor() {
    this.buildCssDeclarationMap();
    this.cssToTailwindMap = buildCssToTailwindMap();
  }

  /**
   * Convert CSS model to Tailwind classes.
   *
   * @param css The CSS model object
   * @returns Array of Tailwind class names
   *
   * @example
   * ```typescript
   * const classes = converter.cssToTailwind({
   *   layout: { display: 'flex' },
   *   flexboxGrid: { gap: '1rem', justifyContent: 'center' }
   * });
   * // Returns: ['flex', 'gap-4', 'justify-center']
   * ```
   */
  cssToTailwind(css: Css | undefined): string[] {
    if (!css) {
      return [];
    }

    const tailwindClasses: string[] = [];

    // Iterate through categories (layout, spacing, sizing, flexboxGrid)
    for (const category of Object.keys(css) as (keyof Css)[]) {
      const categoryValue = css[category];
      if (categoryValue == null) {
        continue;
      }

      // Iterate through properties within the category
      for (const property of Object.keys(categoryValue)) {
        const rawValue = (categoryValue as Record<string, unknown>)[property];
        if (rawValue == null) {
          continue;
        }

        const tailwindClass = this.convertPropertyToTailwind(
          category,
          property,
          rawValue
        );
        if (tailwindClass) {
          tailwindClasses.push(tailwindClass);
        }
      }
    }

    return tailwindClasses;
  }

  /**
   * Parse a Tailwind class string into CSS model properties.
   *
   * @param classString Space-separated Tailwind classes
   * @returns Object containing parsed CSS and unsupported classes
   *
   * @example
   * ```typescript
   * const result = converter.tailwindToCss('flex gap-4 justify-center bg-blue-500');
   * // Returns: {
   * //   css: {
   * //     layout: { display: 'flex' },
   * //     flexboxGrid: { gap: '1rem', justifyContent: 'center' }
   * //   },
   * //   unsupportedClasses: ['bg-blue-500']
   * // }
   * ```
   */
  tailwindToCss(classString: string): TailwindParseResult {
    const css: Partial<Css> = {};
    const unsupportedClasses: string[] = [];

    if (!classString || !classString.trim()) {
      return { css, unsupportedClasses };
    }

    const classes = classString.trim().split(/\s+/).filter(Boolean);

    for (const className of classes) {
      // Skip classes with variant prefixes (responsive, state, etc.)
      if (this.hasVariantPrefix(className)) {
        unsupportedClasses.push(className);
        continue;
      }

      // Try to parse the class
      const mapping = this.parseClass(className);

      if (mapping) {
        // Apply the mapping to the CSS object
        this.applyMapping(css, mapping);
      } else {
        unsupportedClasses.push(className);
      }
    }

    return { css, unsupportedClasses };
  }

  /**
   * Build the CSS declaration to Tailwind map from TAILWIND_DATA.
   * Example: "display: flex" -> "flex"
   */
  private buildCssDeclarationMap(): void {
    const utilities = TAILWIND_DATA.utilities;

    for (const utility of utilities) {
      const normalizedDetail = utility.detail.trim();
      const cssKey = normalizedDetail.endsWith(';')
        ? normalizedDetail.slice(0, -1).trim()
        : normalizedDetail;

      this.cssDeclarationToTailwindMap.set(cssKey, utility.label);
    }
  }

  /**
   * Convert a single CSS property to a Tailwind class.
   */
  private convertPropertyToTailwind(
    category: keyof Css,
    property: string,
    rawValue: unknown
  ): string | null {
    // Convert to string
    const valueStr = String(rawValue);

    // Try exact match first using our curated map
    const mapKey = `${category}.${property}:${valueStr}`;
    const exactMatch = this.cssToTailwindMap.get(mapKey);
    if (exactMatch) {
      return exactMatch;
    }

    // Try CSS declaration match (from TAILWIND_DATA)
    const cssPropertyName = this.camelToKebab(property);
    const cssDeclaration = `${cssPropertyName}: ${valueStr}`;
    const declarationMatch = this.cssDeclarationToTailwindMap.get(cssDeclaration);
    if (declarationMatch) {
      return declarationMatch;
    }

    // Fall back to arbitrary value syntax
    return this.generateArbitraryValue(cssPropertyName, valueStr);
  }

  /**
   * Parse a Tailwind class into a CSS mapping.
   */
  private parseClass(className: string): TailwindToCssMapping | null {
    // Try exact match from our map
    const exactMapping = TAILWIND_TO_CSS_MAP[className];
    if (exactMapping) {
      return exactMapping;
    }

    // Try arbitrary value patterns
    const arbitraryMapping = this.parseArbitraryValue(className);
    if (arbitraryMapping) {
      return arbitraryMapping;
    }

    return null;
  }

  /**
   * Parse arbitrary value syntax (e.g., gap-[17px], w-[200px]).
   */
  private parseArbitraryValue(className: string): TailwindToCssMapping | null {
    for (const pattern of ARBITRARY_VALUE_PATTERNS) {
      const match = className.match(pattern.pattern);
      if (match) {
        // Convert underscores back to spaces (Tailwind arbitrary value syntax)
        const value = match[1].replace(/_/g, ' ');
        return {
          category: pattern.category,
          property: pattern.property,
          value,
        };
      }
    }

    // Handle generic arbitrary property syntax: [property:value]
    const genericMatch = className.match(/^\[([a-z-]+):(.+)\]$/);
    if (genericMatch) {
      const cssProperty = genericMatch[1];
      const value = genericMatch[2].replace(/_/g, ' ');
      const mapping = this.findCategoryForProperty(cssProperty);
      if (mapping) {
        return {
          category: mapping.category,
          property: mapping.property,
          value,
        };
      }
    }

    return null;
  }

  /**
   * Find the CSS category for a kebab-case CSS property name.
   */
  private findCategoryForProperty(
    cssProperty: string
  ): { category: keyof Css; property: string } | null {
    // Convert kebab-case to camelCase
    const camelProperty = this.kebabToCamel(cssProperty);

    // Check each category
    const categoryPropertyMap: Record<keyof Css, string[]> = {
      layout: ['display'],
      spacing: ['padding', 'margin'],
      sizing: ['width', 'height'],
      flexboxGrid: [
        'gap', 'justifyContent', 'alignItems', 'alignContent', 'justifyItems',
        'placeItems', 'flexDirection', 'flexWrap', 'flexGrow', 'flexShrink',
        'flexBasis', 'alignSelf', 'gridTemplateColumns', 'gridTemplateRows',
        'gridTemplateAreas', 'gridAutoFlow', 'gridAutoColumns', 'gridAutoRows',
        'gridColumn', 'gridRow', 'gridArea', 'gridColumnStart', 'gridColumnEnd',
        'gridRowStart', 'gridRowEnd', 'justifySelf',
      ],
    };

    for (const [category, properties] of Object.entries(categoryPropertyMap)) {
      if (properties.includes(camelProperty)) {
        return { category: category as keyof Css, property: camelProperty };
      }
    }

    return null;
  }

  /**
   * Apply a mapping to the CSS object, creating nested structure as needed.
   */
  private applyMapping(css: Partial<Css>, mapping: TailwindToCssMapping): void {
    if (!css[mapping.category]) {
      css[mapping.category] = {} as Css[keyof Css];
    }

    (css[mapping.category] as Record<string, unknown>)[mapping.property] = mapping.value;
  }

  /**
   * Check if a class has a variant prefix (responsive, state, dark, etc.).
   */
  private hasVariantPrefix(className: string): boolean {
    // Variant prefixes contain a colon before the utility name
    // Examples: md:flex, hover:bg-blue-500, dark:text-white
    return className.includes(':');
  }

  /**
   * Check if a CSS value already has a unit.
   */
  private hasUnit(value: string): boolean {
    return /[a-z%]+$/i.test(value.trim());
  }

  /**
   * Convert camelCase to kebab-case.
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Convert kebab-case to camelCase.
   */
  private kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Generate Tailwind arbitrary value syntax for properties without exact matches.
   */
  private generateArbitraryValue(property: string, value: string): string {
    const propertyMap: Record<string, string> = {
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
      'flex-basis': 'basis',
      'order': 'order',
      'grid-template-columns': 'grid-cols',
      'grid-template-rows': 'grid-rows',
      'grid-column': 'col',
      'grid-row': 'row',
      'grid-auto-flow': 'grid-flow',
      'display': 'display',
    };

    const prefix = propertyMap[property];
    const sanitizedValue = value.replace(/ /g, '_');

    if (prefix) {
      return `${prefix}-[${sanitizedValue}]`;
    }

    // Generic arbitrary property syntax
    return `[${property}:${sanitizedValue}]`;
  }
}
