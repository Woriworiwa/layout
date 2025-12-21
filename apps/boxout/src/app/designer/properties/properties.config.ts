import { InjectionToken } from '@angular/core';

/**
 * Injection token for providing the properties configuration. It controls how the properties will look and behave.
 * wherever you import properties component, you can provide this token to change the properties configuration.
 * If you do not provide this configuration the properties configuration is set to {@link DEFAULT_PROPERTIES_CONFIG}.
 *
 * example: when you show the properties in the tutorial component, you want to show properties as select buttons instead of dropdowns.
 */
export const PROPERTIES_CONFIG = new InjectionToken<PropertiesConfig>(
  'properties.config description',
);

export interface PropertiesConfig {
  labelPosition?: 'top' | 'left' | 'none';
  selectControlsLayout?: 'dropdown' | 'selectButton';
}

export const DEFAULT_PROPERTIES_CONFIG: PropertiesConfig = {
  labelPosition: 'left',
  selectControlsLayout: 'selectButton',
};
