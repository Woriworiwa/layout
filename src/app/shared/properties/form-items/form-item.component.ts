import {Component, inject, Input} from '@angular/core';

import {FormControl} from "@angular/forms";
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";

@Component({
  imports: [],
  standalone: true,
  template: `<p>works!</p>`,
  styles: ``,
})
export class FormItemComponent {
  @Input() label = '';
  @Input() control: FormControl<any> = new FormControl<any>('');

  protected propertiesConfig: PropertiesConfig;

  constructor() {
    this.propertiesConfig = inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;
  }
}
