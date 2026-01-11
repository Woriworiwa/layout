import type * as CSS from 'csstype';

/**
 * Container property names for flex and grid layouts.
 * This is the single source of truth for all container properties - both the runtime
 * array and the Container type are derived from this definition.
 *
 * Includes:
 * - Shared container properties (gap, alignment, justification)
 * - Flexbox container properties (flexDirection, flexWrap)
 * - Flexbox item properties (flexGrow, flexShrink, flexBasis, alignSelf for flex items)
 * - Grid container properties (gridTemplate*, gridAuto*)
 * - Grid item properties (gridColumn, gridRow, gridArea, etc.)
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
  // Flexbox container properties
  'flexDirection',
  'flexWrap',
  // Flexbox item properties
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  // Grid container properties
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
  // Grid item properties
  'gridColumn',
  'gridRow',
  'gridArea',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRowStart',
  'gridRowEnd',
  'justifySelf',
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
