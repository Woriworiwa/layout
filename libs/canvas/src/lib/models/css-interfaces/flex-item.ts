import type * as CSS from 'csstype';

/**
 * FlexItem property names for flexbox item controls.
 * Single source of truth - interface is derived from this array.
 */
export const FLEX_ITEM_PROPERTY_NAMES = [
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid flex item property names.
 */
export type FlexItemPropertyName = (typeof FLEX_ITEM_PROPERTY_NAMES)[number];

/**
 * FlexItem interface for CSS properties specific to flex items.
 */
export interface FlexItem extends Pick<CSS.Properties, FlexItemPropertyName> {}
