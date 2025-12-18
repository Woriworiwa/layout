import type * as CSS from "csstype";

/**
 * Container property names that are shared between flex and grid layouts.
 * This is the single source of truth for container properties - both the runtime
 * array and the Container type are derived from this definition.
 *
 * The `satisfies` operator ensures type safety - each property must be a valid
 * CSS.Properties key, while `as const` preserves the literal types for the array.
 */
export const CONTAINER_PROPERTY_NAMES = [
  'gap',
  'justifyContent',
  'alignItems',
  'alignContent',
  'justifyItems',
  'placeItems'
] as const satisfies readonly (keyof CSS.Properties)[];

/**
 * Type representing valid container property names.
 * Derived from CONTAINER_PROPERTY_NAMES array.
 */
export type ContainerPropertyName = typeof CONTAINER_PROPERTY_NAMES[number];

/**
 * Container interface for CSS properties shared between flex and grid layouts.
 * The properties are derived from CONTAINER_PROPERTY_NAMES to ensure consistency
 * between compile-time types and runtime checks.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Container extends Pick<CSS.Properties, ContainerPropertyName> {
}
