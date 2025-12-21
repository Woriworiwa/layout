import { Component, Input } from '@angular/core';

import { CanvasItem } from '@layout/models';

@Component({
  selector: 'app-preset-text',
  imports: [],
  template: ``,
})
export class PresetTextComponent {
  @Input() preset: CanvasItem | undefined;
}
