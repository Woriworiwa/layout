import type * as CSS from 'csstype';

/**
 * Sizing property names for element dimensions.
 * Single source of truth - interface is derived from this array.
 */
export const SIZING_PROPERTY_NAMES = [
  'height',
  'width',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid sizing property names.
 */
export type SizingPropertyName = (typeof SIZING_PROPERTY_NAMES)[number];

/**
 * Sizing interface for CSS properties related to element dimensions.
 */
export interface Sizing extends Pick<CSS.Properties, SizingPropertyName> {}
