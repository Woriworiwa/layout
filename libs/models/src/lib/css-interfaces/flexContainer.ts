import type * as CSS from 'csstype';

/**
 * FlexContainer property names for flexbox-specific container controls.
 * Single source of truth - interface is derived from this array.
 */
export const FLEX_CONTAINER_PROPERTY_NAMES = [
  'flexDirection',
  'flexWrap',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid flex container property names.
 */
export type FlexContainerPropertyName =
  (typeof FLEX_CONTAINER_PROPERTY_NAMES)[number];

/**
 * FlexContainer interface for CSS properties specific to flex containers.
 */
export interface FlexContainer extends Pick<
  CSS.Properties,
  FlexContainerPropertyName
> {}
