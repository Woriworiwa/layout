import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-panel-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="property-label">{{ label }}</div>
    <ng-content></ng-content>
  `,
  styles: `
    :host {
      /*display: grid;*/
      /*grid-template-columns: minmax(0, 1fr) repeat(1, minmax(5px, 2fr));*/
      /*column-gap: 10px;*/
      /*grid-template-rows: auto;*/
    }

    .property-label {
      display: flex;
      align-items: center;
      white-space: nowrap;;
    }
  `
})
export class PropertyPanelRowComponent {
  @Input() label: string = '';
}
