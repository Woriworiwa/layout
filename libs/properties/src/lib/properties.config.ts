import { InjectionToken } from '@angular/core';

/**
 * Injection token for providing the properties-panel configuration. It controls how the properties-panel will look and behave.
 * wherever you import properties-panel component, you can provide this token to change the properties-panel configuration.
 * If you do not provide this configuration the properties-panel configuration is set to {@link DEFAULT_PROPERTIES_CONFIG}.
 *
 * example: when you show the properties-panel in the tutorial component, you want to show properties-panel as select buttons instead of dropdowns.
 */
export const PROPERTIES_CONFIG = new InjectionToken<PropertiesConfig>(
  'properties-panel.config description',
);

export interface PropertiesConfig {
  labelPosition?: 'top' | 'left' | 'none';
  selectControlsLayout?: 'dropdown' | 'selectButton';
  /**
   * When enabled, search will also match against button group option values.
   * For example, searching "flex" will show the "display" property because
   * it has "flex" as one of its options.
   */
  searchIncludesOptionValues?: boolean;
}

export const DEFAULT_PROPERTIES_CONFIG: PropertiesConfig = {
  labelPosition: 'left',
  selectControlsLayout: 'selectButton',
  searchIncludesOptionValues: true,
};
