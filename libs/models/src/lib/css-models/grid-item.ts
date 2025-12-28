import type * as CSS from 'csstype';

/**
 * GridItem property names for grid item positioning and alignment.
 * Single source of truth - interface is derived from this array.
 */
export const GRID_ITEM_PROPERTY_NAMES = [
  'gridColumn',
  'gridRow',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRowStart',
  'gridRowEnd',
  'justifySelf',
  'alignSelf',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid grid item property names.
 */
export type GridItemPropertyName = (typeof GRID_ITEM_PROPERTY_NAMES)[number];

/**
 * GridItem interface for CSS properties-panel specific to grid items.
 */
export interface GridItem extends Pick<CSS.Properties, GridItemPropertyName> {}
