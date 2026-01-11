import { CanvasItem } from '@layout/models';
import { Serializer } from './serializer';
import { Css } from '@layout/models';
import { POSTFIX_UNIT, POSTFIXED_PROPERTIES } from '../constants';

export class CssStyleSerializer extends Serializer {
  constructor() {
    super();
  }

  serialize(items: CanvasItem[]): string[] {
    if (items.length !== 1) {
      return [];
    }

    const css = items[0].css as Css;
    if (!css) {
      return [];
    }

    const cssProperties: string[] = [];

    /* loop through the root keys (spacing, sizing, display, container,...) */
    CssStyleSerializer.serializeItems(css, cssProperties);

    return cssProperties;
  }

  private static serializeItems(css: Css, cssProperties: string[]) {
    for (const key of Object.keys(css)) {
      const value = css[key as keyof Css];

      if (value == null) {
        continue;
      }

      /* loop through the subkeys of the root keys */
      for (const key of Object.keys(value)) {
        // Convert camelCase to kebab-case for CSS property names
        const cssPropertyName = key
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        let cssPropertyValue: string = value[key as keyof Css[keyof Css]];

        if (cssPropertyValue == null) {
          continue;
        }

        if (POSTFIXED_PROPERTIES.includes(key)) {
          cssPropertyValue += POSTFIX_UNIT;
        }

        cssProperties.push(`${cssPropertyName}: ${cssPropertyValue}`);
      }
    }
  }
}
