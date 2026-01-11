import type * as CSS from 'csstype';

/**
 * Layout property names.
 * Single source of truth - interface is derived from this array.
 */
export const LAYOUT_PROPERTY_NAMES = [
  'display',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid layout property names.
 */
export type LayoutPropertyName = (typeof LAYOUT_PROPERTY_NAMES)[number];

/**
 * Layout interface for CSS layout properties.
 */
export interface Layout extends Pick<CSS.Properties, LayoutPropertyName> {}
