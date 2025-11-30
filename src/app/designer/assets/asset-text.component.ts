import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CanvasItem } from "../../core/models/canvas-item.model";

@Component({
  selector: 'app-asset-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ``
})
export class AssetTextComponent {
  preset = input<CanvasItem | undefined>(undefined);
}
