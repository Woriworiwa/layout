import {Component, inject, input} from '@angular/core';

import {FormControl} from "@angular/forms";
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";

@Component({
  imports: [],
  standalone: true,
  template: `<p>works!</p>`,
  styles: ``,
})
export class BaseFormItemComponent {
  label = input<string>('');
  control = input<FormControl<any>>(new FormControl<any>(''));

  protected propertiesConfig: PropertiesConfig;

  constructor() {
    this.propertiesConfig = inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;
  }
}
