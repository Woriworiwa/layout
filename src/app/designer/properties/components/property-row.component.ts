import { Component, ContentChild, inject, input, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";
import { SliderComponent } from './slider.component';
import { SelectButtonComponent } from './select-button.component';
import { ButtonGroupComponent } from './button-group.component';
import { TextFieldComponent } from './text-field.component';
import { PropertiesFilterDirective } from '../properties-filter.directive';

@Component({
  selector: 'app-property-row',
  imports: [CommonModule, PropertiesFilterDirective],
  standalone: true,
  template: `
    <div *appPropertiesFilter
         class="mb-1"
         [ngClass]="{
          'label-top': propertiesConfig.labelPosition === 'top',
          'label-left': propertiesConfig.labelPosition === 'left'}">
      @if (propertiesConfig.labelPosition !== 'none') {
        <div class="flex whitespace-nowrap text-xs font-mono" [class]="contentTypeClass">
          {{ label() }}
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    :host.hidden {
      display: none;
    }

    .label-left {
      display: grid;
      grid-template-columns: minmax(0, 2fr) repeat(1, minmax(5px, 5fr));
    }

    .label-top {
      display: flex;
      flex-direction: column;
    }
  `,
})
export class PropertyRowComponent {
  label = input<string>('');

  @ContentChild(SliderComponent) sliderComponent?: SliderComponent;
  @ContentChild(SelectButtonComponent)
  selectButtonComponent?: SelectButtonComponent;
  @ContentChild(ButtonGroupComponent)
  buttonGroupComponent?: ButtonGroupComponent;
  @ContentChild(TextFieldComponent)
  textFieldComponent?: TextFieldComponent;

  propertiesConfig: PropertiesConfig;
  contentTypeClass = '';

  // Track visibility state for filtering
  isVisible = signal(true);

  constructor() {
    this.propertiesConfig =
      inject(PROPERTIES_CONFIG, { optional: true }) ??
      DEFAULT_PROPERTIES_CONFIG;
  }

  ngAfterContentInit() {
    if (this.sliderComponent || this.selectButtonComponent || this.buttonGroupComponent ||
         this.textFieldComponent) {
      this.contentTypeClass = 'self-center';
    } else {
      this.contentTypeClass = 'mt-1';
    }
  }
}
