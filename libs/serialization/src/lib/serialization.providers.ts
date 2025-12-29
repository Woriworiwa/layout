import { Provider } from '@angular/core';
import { SerializationService } from './serialization.service';

/**
 * Provides all serialization-related services required for the serialization functionality.
 * Use this in your root component's providers array.
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [
 *     ...provideSerialization(),
 *     // other providers
 *   ]
 * })
 * export class AppComponent {}
 * ```
 */
export function provideSerialization(): Provider[] {
  return [
    SerializationService,
  ];
}
