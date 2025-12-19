import { Component, Input } from '@angular/core';

import { CanvasItem } from '../../core/models/canvas-item.model';

@Component({
  selector: 'app-preset-text',
  imports: [],
  template: ``,
})
export class PresetTextComponent {
  @Input() preset: CanvasItem | undefined;
}
