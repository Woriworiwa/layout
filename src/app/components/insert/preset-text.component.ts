import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasItem} from "../../models/canvas-item.model";

@Component({
  selector: 'app-preset-text',
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class PresetTextComponent {
  @Input() preset: CanvasItem | undefined;
}
