import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DEFAULT_PROPERTIES_CONFIG, PROPERTIES_CONFIG, PropertiesConfig} from "../properties.config";

@Component({
  selector: 'app-property-panel-row',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div
      [ngClass]="{'label-top': propertiesConfig.labelPosition === 'top', 'label-left': propertiesConfig.labelPosition === 'left'}">
      <div *ngIf="propertiesConfig.labelPosition !== 'none'" class="property-label">{{ label }}</div>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 8px;
    }

    .label-left {
      display: grid;
      grid-template-columns: minmax(0, 4fr) repeat(1, minmax(5px, 5fr));
    }

    .label-top {
      display: flex;
      flex-direction: column;
    }

    .property-label {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin: 0 10px;
    }
  `
})
export class PropertyGroupRowComponent {
  @Input() label = '';

  propertiesConfig: PropertiesConfig;

  constructor() {
    this.propertiesConfig = inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;
  }
}
