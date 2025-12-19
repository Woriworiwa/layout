import type * as CSS from 'csstype';

/**
 * Display property name.
 * Single source of truth - interface is derived from this array.
 */
export const DISPLAY_PROPERTY_NAMES = [
  'display',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid display property names.
 */
export type DisplayPropertyName = (typeof DISPLAY_PROPERTY_NAMES)[number];

/**
 * Display interface for CSS display property.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Display extends Pick<CSS.Properties, DisplayPropertyName> {}
