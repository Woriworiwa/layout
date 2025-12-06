import { Component, ContentChild, inject, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";
import { SliderComponent } from './slider.component';

@Component({
  selector: 'app-property-row',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div
      [ngClass]="{'label-top': propertiesConfig.labelPosition === 'top', 'label-left': propertiesConfig.labelPosition === 'left'}">
      @if (propertiesConfig.labelPosition !== 'none') {
        <div class="property-label text-xs mb-2">{{ label }}</div>
      }
      <div [class]="contentTypeClass">
        <ng-content></ng-content>
      </div>
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
      align-items: start;
    }

    .label-top {
      display: flex;
      flex-direction: column;
    }

    .property-label {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding-top: 4px;
    }
  `
})
export class PropertyGroupRowComponent {
  @Input() label = '';

  @ContentChild(SliderComponent) someComponent?: SliderComponent;

  propertiesConfig: PropertiesConfig;
  contentTypeClass = '';

  constructor() {
    this.propertiesConfig = inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;
  }

  ngAfterContentInit() {
    if (this.someComponent) {
      this.contentTypeClass = 'self-center';
    }
  }
}
