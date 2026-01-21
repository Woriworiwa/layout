import { Injectable, signal, computed } from '@angular/core';
import {
  PreviewTheme,
  previewThemes,
  DEFAULT_PREVIEW_THEME_ID,
} from './preview-theme-data';

/**
 * Service for managing preview theme state using signals.
 * Provides theme selection and CSS style generation.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewThemeService {
  /** All available themes */
  readonly themes = signal<PreviewTheme[]>(previewThemes);

  /** Currently selected theme ID */
  readonly selectedThemeId = signal<string>(DEFAULT_PREVIEW_THEME_ID);

  /** Currently selected theme object */
  readonly selectedTheme = computed<PreviewTheme | undefined>(() => {
    const id = this.selectedThemeId();
    return this.themes().find((t) => t.id === id);
  });

  /** Options formatted for PrimeNG SelectButton */
  readonly themeOptions = computed(() =>
    this.themes().map((t) => ({
      label: t.label,
      value: t.id,
    }))
  );

  /**
   * Select a theme by ID.
   * @param id The theme ID to select
   */
  selectTheme(id: string): void {
    const theme = this.themes().find((t) => t.id === id);
    if (theme) {
      this.selectedThemeId.set(id);
    }
  }

  /**
   * Generate complete CSS styles from the selected theme.
   * @returns CSS string with body, frame, text, and additional styles
   */
  generateThemeStyles(): string {
    const theme = this.selectedTheme();
    if (!theme) {
      return '';
    }

    return `
    body {
      ${theme.bodyStyles}
    }

    .frame {
      ${theme.frameStyles}
    }

    .text {
      ${theme.textStyles}
    }

    ${theme.additionalStyles || ''}
    `;
  }
}
