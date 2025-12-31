import { Provider } from '@angular/core';

/**
 * Provides all renderer-related services required for the renderer functionality.
 * Use this in your root component's providers array.
 *
 * **Dependencies:**
 * - Requires `provideCanvas()` from `@layout/canvas`
 * - Requires `provideSerialization()` from `@layout/serialization`
 *
 * @example
 * ```typescript
 * import { provideCanvas } from '@layout/canvas';
 * import { provideSerialization } from '@layout/serialization';
 * import { provideRenderer } from '@layout/renderer';
 *
 * @Component({
 *   providers: [
 *     ...provideCanvas(),           // Required dependency
 *     ...provideSerialization(),    // Required dependency
 *     ...provideRenderer(),
 *     // other providers
 *   ]
 * })
 * export class AppComponent {}
 * ```
 */
export function provideRenderer(): Provider[] {
  return [
    // Add renderer services here as they are created
  ];
}
