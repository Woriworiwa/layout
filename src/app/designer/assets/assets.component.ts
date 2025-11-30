import { ChangeDetectionStrategy, Component, Type, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CANVAS_WRAPPER_ID } from "../../core/constants";
import { AssetService } from "./asset.service";
import { CanvasService } from "../../canvas/canvas.service";
import { InsertPosition } from "../../core/enums";
import { CanvasItem } from "../../core/models/canvas-item.model";
import { Preset } from '../../core/models/preset.model';

interface AssetComponentItem {
  preset: Preset;
  component: Type<unknown>;
  inputs: { preset: CanvasItem };
}

@Component({
  selector: 'app-insert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: 'assets.component.html',
  styleUrls: ['assets.component.scss']
})
export class AssetsComponent {
  private readonly canvasService = inject(CanvasService);
  private readonly presetsService = inject(AssetService);

  parentFrameId = input<string | undefined>(undefined);
  insertPosition = input<InsertPosition>(InsertPosition.AFTER);

  componentAdded = output<boolean>();

  protected readonly components: readonly AssetComponentItem[];

  constructor() {
    this.components = this.presetsService.getAssetComponents() as AssetComponentItem[];
  }

  protected addItem(presetId: string): void {
    this.canvasService.addPreset(
      presetId,
      this.parentFrameId() || CANVAS_WRAPPER_ID,
      this.insertPosition()
    );
    this.componentAdded.emit(true);
  }
}
