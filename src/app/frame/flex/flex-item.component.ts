import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NbCardModule} from "@nebular/theme";
import { Frame } from '../../core/models/frame.model';

@Component({
  selector: 'app-flex-item',
  standalone: true,
  imports: [CommonModule, NbCardModule],
  template: `
    <nb-card>
      <nb-card-header>{{ frame?.name }}</nb-card-header>
      <nb-card-body>
        lorem ipsum
        <ng-content></ng-content>
      </nb-card-body>
    </nb-card>
  `,
  styles: ``
})
export class FlexItemComponent {
  @Input() frame: Frame | undefined
}
