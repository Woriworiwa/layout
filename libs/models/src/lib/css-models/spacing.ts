import type * as CSS from 'csstype';

/**
 * Spacing property names for padding and margin controls.
 * Single source of truth - interface is derived from this array.
 */
export const SPACING_PROPERTY_NAMES = [
  'padding',
  'margin',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid spacing property names.
 */
export type SpacingPropertyName = (typeof SPACING_PROPERTY_NAMES)[number];

/**
 * Spacing interface for CSS properties related to element spacing.
 */
export interface Spacing extends Pick<CSS.Properties, SpacingPropertyName> {}
