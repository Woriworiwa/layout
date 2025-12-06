import { Component, ContentChild, inject, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";
import { SliderComponent } from './slider.component';
import { SelectButtonComponent } from './select-button.component';

@Component({
  selector: 'app-property-row',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div [ngClass]="{'label-top': propertiesConfig.labelPosition === 'top',
                     'label-left': propertiesConfig.labelPosition === 'left'}">
      @if (propertiesConfig.labelPosition !== 'none') {
        <div class="flex whitespace-nowrap text-xs" [class]="contentTypeClass">{{ label }}</div>
      }
      <ng-content></ng-content>
    </div>
    `,
  styles: `
    :host {
      display: block;
      margin-bottom: 2px;
    }

    .label-left {
      display: grid;
      grid-template-columns: minmax(0, 2fr) repeat(1, minmax(5px, 5fr));
    }

    .label-top {
      display: flex;
      flex-direction: column;
    }
  `
})
export class PropertyRowComponent {
  @Input() label = '';

  @ContentChild(SliderComponent) sliderComponent?: SliderComponent;
  @ContentChild(SelectButtonComponent) selectButtonComponent?: SelectButtonComponent;

  propertiesConfig: PropertiesConfig;
  contentTypeClass = '';

  constructor() {
    this.propertiesConfig = inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;
  }

  ngAfterContentInit() {
    if (this.sliderComponent || this.selectButtonComponent) {
      this.contentTypeClass = 'self-center';
    }
  }
}
