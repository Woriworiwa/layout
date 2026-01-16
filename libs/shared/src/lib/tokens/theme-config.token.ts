import { InjectionToken } from '@angular/core';

/**
 * Interface for theme configuration used by components that need theme awareness.
 * Implement this in your app's theme service and provide it using THEME_CONFIG token.
 */
export interface ThemeConfig {
  darkMode: boolean;
}

/**
 * Injection token for theme configuration.
 * Provide this in your app to enable dark mode support in theme-aware components.
 *
 * @example
 * ```typescript
 * // In your app component
 * providers: [
 *   {
 *     provide: THEME_CONFIG,
 *     useFactory: () => {
 *       const themeService = inject(ThemeService);
 *       return themeService.config();
 *     }
 *   }
 * ]
 * ```
 */
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('theme.config');
