import type * as CSS from 'csstype';

/**
 * Display property name.
 * Single source of truth - interface is derived from this array.
 */
export const LAYOUT_PROPERTY_NAMES = [
  'display',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid display property names.
 */
export type LayoutPropertyName = (typeof LAYOUT_PROPERTY_NAMES)[number];

/**
 * Display interface for CSS display property.
 */
export interface Layout extends Pick<CSS.Properties, LayoutPropertyName> {}
