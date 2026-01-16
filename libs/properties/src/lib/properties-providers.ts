import { Provider } from '@angular/core';
import { PropertiesService } from './properties.service';
import { PropertiesKeyboardNavigationService } from './properties-keyboard-navigation.service';

/**
 * Provides all properties-related services required for the properties functionality.
 * Use this in your component's providers array when using properties components.
 *
 * Note: The PropertiesService is typically provided at the component level (e.g., in PropertiesPanelComponent)
 * rather than at the root level, as it manages component-specific state.
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [
 *     ...provideProperties(),
 *     // other providers
 *   ]
 * })
 * export class PropertiesPanelComponent {}
 * ```
 */
export function provideProperties(): Provider[] {
  return [
    PropertiesService,
    PropertiesKeyboardNavigationService,
  ];
}
