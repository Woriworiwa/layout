import type * as CSS from "csstype";

/**
 * BoxSizing property names for size and spacing controls.
 * Single source of truth - interface is derived from this array.
 */
export const BOX_SIZING_PROPERTY_NAMES = [
  'padding',
  'height',
  'width'
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid box sizing property names.
 */
export type BoxSizingPropertyName = typeof BOX_SIZING_PROPERTY_NAMES[number];

/**
 * BoxSizing interface for CSS properties related to element sizing.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface BoxSizing extends Pick<CSS.Properties, BoxSizingPropertyName> {
}
