import { Provider } from '@angular/core';
import { PresetService } from './preset.service';
import { PRESET_PROVIDER } from '@layout/shared';

/**
 * Provides all presets-related services required for the presets functionality.
 * Use this in your root component's providers array.
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [
 *     ...providePresets(),
 *     // other providers
 *   ]
 * })
 * export class AppComponent {}
 * ```
 */
export function providePresets(): Provider[] {
  return [
    PresetService,
    { provide: PRESET_PROVIDER, useExisting: PresetService },
  ];
}
