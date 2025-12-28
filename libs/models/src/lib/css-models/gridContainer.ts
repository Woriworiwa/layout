import type * as CSS from 'csstype';

/**
 * GridContainer property names for grid-specific container controls.
 * Single source of truth - interface is derived from this array.
 */
export const GRID_CONTAINER_PROPERTY_NAMES = [
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid grid container property names.
 */
export type GridContainerPropertyName =
  (typeof GRID_CONTAINER_PROPERTY_NAMES)[number];

/**
 * GridContainer interface for CSS properties-panel specific to grid containers.
 */
export interface GridContainer extends Pick<
  CSS.Properties,
  GridContainerPropertyName
> {}
