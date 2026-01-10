import type * as CSS from 'csstype';

/**
 * Container property names for flex and grid layouts.
 * This is the single source of truth for all container properties - both the runtime
 * array and the Container type are derived from this definition.
 *
 * Includes:
 * - Shared container properties (gap, alignment, justification)
 * - Flexbox-specific properties (flexDirection, flexWrap)
 * - Grid-specific properties (gridTemplate*, gridAuto*)
 *
 * The `satisfies` operator ensures type safety - each property must be a valid
 * CSS.Properties key, while `as const` preserves the literal types for the array.
 */
export const CONTAINER_PROPERTY_NAMES = [
  // Shared container properties
  'gap',
  'justifyContent',
  'alignItems',
  'alignContent',
  'justifyItems',
  'placeItems',
  // Flexbox-specific properties
  'flexDirection',
  'flexWrap',
  // Grid-specific properties
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid container property names.
 * Derived from CONTAINER_PROPERTY_NAMES array.
 */
export type ContainerPropertyName = (typeof CONTAINER_PROPERTY_NAMES)[number];

/**
 * Container interface for CSS properties for flex and grid layouts.
 * The properties are derived from CONTAINER_PROPERTY_NAMES to ensure consistency
 * between compile-time types and runtime checks.
 */
export interface Container extends Pick<
  CSS.Properties,
  ContainerPropertyName
> {}
