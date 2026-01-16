import { Injectable } from '@angular/core';
import {
  SPACING_PROPERTY_NAMES,
  SIZING_PROPERTY_NAMES,
  FLEXBOX_GRID_PROPERTY_NAMES,
  LAYOUT_PROPERTY_NAMES,
  AlignContentOptions,
  AlignItemsOptions,
  AlignSelfOptions,
  DisplayOptions,
  FlexDirectionOptions,
  FlexWrapOptions,
  GridAutoFlowOptions,
  JustifyContentOptions,
  JustifyItemsOptions,
  JustifySelfOptions,
  Unit,
  CanvasItemType,
} from '@layout/models';

/**
 * Union type of all valid CSS property names from all interfaces.
 * Provides compile-time type safety for PROPERTY_VALUE_MAP.
 */
type CssPropertyName =
  | (typeof LAYOUT_PROPERTY_NAMES)[number]
  | (typeof FLEXBOX_GRID_PROPERTY_NAMES)[number]
  | (typeof SPACING_PROPERTY_NAMES)[number]
  | (typeof SIZING_PROPERTY_NAMES)[number];

/**
 * Value definition for a CSS property in the schema.
 */
type PropertyValueDef =
  | string[]
  | { type: 'unit'; description: string }
  | { type: 'custom'; description: string };

/**
 * Strict mapped type that REQUIRES all CSS properties-panel to be present.
 * Unlike Record<>, this will cause a TypeScript error if any property is missing.
 */
type RequireAllProperties = {
  [K in CssPropertyName]: PropertyValueDef;
};

/**
 * Service that generates AI schema from CSS interface definitions.
 * Provides runtime schema generation for the AI generation service.
 */
@Injectable({ providedIn: 'root' })
export class AiSchemaGeneratorService {
  /**
   * Maps property names to their enum options or value descriptions.
   *
   * IMPORTANT: This map MUST contain ALL properties-panel from all CSS interfaces.
   * TypeScript will error at compile-time if any property is missing,
   * ensuring this service stays in sync with CSS model changes.
   */
  private readonly PROPERTY_VALUE_MAP: RequireAllProperties = {
    // Display
    display: DisplayOptions.filter(
      (opt) => opt === 'flex' || opt === 'grid',
    ) as string[],

    // FlexboxGrid (shared)
    gap: {
      type: 'custom',
      description: 'numeric value only (auto-postfixed with "px")',
    },
    justifyContent: JustifyContentOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    alignItems: AlignItemsOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    alignContent: AlignContentOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    justifyItems: JustifyItemsOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    placeItems: ['start', 'end', 'center', 'stretch'],

    // FlexboxGrid - Flexbox container properties
    flexDirection: FlexDirectionOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    flexWrap: FlexWrapOptions.filter((opt) => opt !== undefined) as string[],

    // FlexboxGrid - Flexbox item properties
    flexGrow: { type: 'custom', description: 'number (0-10)' },
    flexShrink: { type: 'custom', description: 'number (0-10)' },
    flexBasis: {
      type: 'unit',
      description: `string with unit (${Object.values(Unit).join(', ')}, auto)`,
    },
    alignSelf: AlignSelfOptions.filter((opt) => opt !== undefined) as string[],

    // FlexboxGrid - Grid container properties
    gridTemplateColumns: {
      type: 'custom',
      description:
        'string (e.g., "repeat(3, 1fr)", "100px 200px 100px", "1fr 2fr")',
    },
    gridTemplateRows: {
      type: 'custom',
      description:
        'string (e.g., "repeat(3, 1fr)", "100px 200px", "auto 1fr auto")',
    },
    gridTemplateAreas: {
      type: 'custom',
      description:
        'string with newlines (e.g., "\\"header header header\\"\\n\\"nav main aside\\"\\n\\"footer footer footer\\"")',
    },
    gridAutoFlow: GridAutoFlowOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],
    gridAutoColumns: {
      type: 'custom',
      description: 'string (e.g., "minmax(100px, 1fr)", "100px", "auto")',
    },
    gridAutoRows: {
      type: 'custom',
      description: 'string (e.g., "minmax(100px, auto)", "100px", "auto")',
    },

    // FlexboxGrid - Grid item properties
    gridColumn: {
      type: 'custom',
      description: 'string (e.g., "1 / 3", "span 2", "1")',
    },
    gridRow: {
      type: 'custom',
      description: 'string (e.g., "1 / 3", "span 2", "1")',
    },
    gridArea: {
      type: 'custom',
      description: 'string (e.g., "header", "nav", "main", "sidebar", "footer")',
    },
    gridColumnStart: {
      type: 'custom',
      description: 'string | number (e.g., "1", 2, "span 2")',
    },
    gridColumnEnd: {
      type: 'custom',
      description: 'string | number (e.g., "3", 4, "span 2")',
    },
    gridRowStart: {
      type: 'custom',
      description: 'string | number (e.g., "1", 2, "span 2")',
    },
    gridRowEnd: {
      type: 'custom',
      description: 'string | number (e.g., "3", 4, "span 2")',
    },
    justifySelf: JustifySelfOptions.filter(
      (opt) => opt !== undefined,
    ) as string[],

    // Spacing
    padding: {
      type: 'unit',
      description: `string with unit (${Object.values(Unit).join(', ')})`,
    },
    margin: {
      type: 'unit',
      description: `string with unit (${Object.values(Unit).join(', ')})`,
    },

    // Sizing
    width: {
      type: 'unit',
      description: `string with unit (${Object.values(Unit).join(', ')}, auto)`,
    },
    height: {
      type: 'unit',
      description: `string with unit (${Object.values(Unit).join(', ')}, auto)`,
    },
  };

  /**
   * Generates the complete CanvasItem schema for AI prompt.
   * This is the main public method used by AiGenerationService.
   */
  generateCanvasItemSchema(): string {
    const itemTypes = Object.values(CanvasItemType)
      .map((v) => `"${v}"`)
      .join(' | ');

    return `CanvasItem Schema:
{
  "itemType": ${itemTypes},
  "label": "string (optional, semantic description)",
  "content": "string (required for TEXT items only)",
  "children": CanvasItem[] (optional, for FLEX and GRID containers),
  ${this.generateCssSchema()}
}`;
  }

  /**
   * Converts a value definition to a schema string.
   */
  private valueToSchemaString(value: PropertyValueDef): string {
    if (Array.isArray(value)) {
      return value.map((v) => `"${v}"`).join(' | ');
    }
    return value.description;
  }

  /**
   * Generates a schema object for a CSS interface section.
   *
   * Since PROPERTY_VALUE_MAP is exhaustive (enforced by RequireAllProperties),
   * every property lookup is guaranteed to succeed.
   */
  private generateSchemaForProperties(
    propertyNames: readonly CssPropertyName[],
  ): Record<string, string> {
    const schema: Record<string, string> = {};

    for (const prop of propertyNames) {
      const valueDef = this.PROPERTY_VALUE_MAP[prop];

      // Runtime assertion: this should never fail due to RequireAllProperties,
      // but provides a clear error message if it somehow does
      if (!valueDef) {
        throw new Error(
          `Missing schema definition for CSS property "${prop}". ` +
            `This should be caught at compile-time by RequireAllProperties.`,
        );
      }

      schema[prop] = this.valueToSchemaString(valueDef);
    }

    return schema;
  }

  /**
   * Generates the complete CSS schema for AI prompt.
   */
  private generateCssSchema(): string {
    const displaySchema = this.generateSchemaForProperties(
      LAYOUT_PROPERTY_NAMES,
    );
    const flexboxGridSchema = this.generateSchemaForProperties(
      FLEXBOX_GRID_PROPERTY_NAMES,
    );
    const spacingSchema = this.generateSchemaForProperties(
      SPACING_PROPERTY_NAMES,
    );
    const sizingSchema = this.generateSchemaForProperties(
      SIZING_PROPERTY_NAMES,
    );

    // Build the schema string
    let schema = '"css": {\n';

    // Display
    schema += '  "display": {\n';
    Object.entries(displaySchema).forEach(([key, value]) => {
      schema += `    "${key}": ${value},\n`;
    });
    schema = schema.slice(0, -2) + '\n'; // Remove trailing comma
    schema += '  },\n';

    // FlexboxGrid (includes flex/grid container and item properties)
    schema += '  "flexboxGrid": {\n';
    Object.entries(flexboxGridSchema).forEach(([key, value]) => {
      schema += `    "${key}": ${value},\n`;
    });
    schema = schema.slice(0, -2) + '\n'; // Remove trailing comma
    schema += '  },\n';

    // Spacing
    schema += '  "spacing": {\n';
    Object.entries(spacingSchema).forEach(([key, value]) => {
      schema += `    "${key}": ${value},\n`;
    });
    schema = schema.slice(0, -2) + '\n'; // Remove trailing comma
    schema += '  },\n';

    // Sizing
    schema += '  "sizing": {\n';
    Object.entries(sizingSchema).forEach(([key, value]) => {
      schema += `    "${key}": ${value},\n`;
    });
    schema = schema.slice(0, -2) + '\n'; // Remove trailing comma
    schema += '  }\n';

    schema += '}';

    return schema;
  }
}
