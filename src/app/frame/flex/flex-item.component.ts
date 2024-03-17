import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NbCardModule} from "@nebular/theme";
import { Frame } from '../../core/models/frame.model';

@Component({
  selector: 'app-flex-item',
  standalone: true,
  imports: [CommonModule, NbCardModule],
  template: `
      <ng-content></ng-content>
  `,
  styles: `
  :host {
    flex-grow: 1;
  }
  `
})
export class FlexItemComponent {
  @Input() frame: Frame | undefined
}
