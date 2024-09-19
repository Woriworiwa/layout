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
      display: grid;
      grid-template-columns: minmax(0, 4fr) repeat(1, minmax(5px, 5fr));
      margin-bottom: 8px;
      //display: contents;
    }

    .property-label {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin: 0 10px;
    }
  `
})
export class PropertyPanelRowComponent {
  @Input() label = '';
}
