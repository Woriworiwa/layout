import { Component, input, inject } from '@angular/core';
import { Popover } from 'primeng/popover';
import { SharedModule } from 'primeng/api';
// TODO: Refactor to remove dependency on PresetsComponent
// import { PresetsComponent } from '../../designer/presets/presets.component';
import { CanvasItem } from '@layout/models';
import { InsertPosition } from '../enums';
import { CanvasService } from '../canvas.service';
import { CANVAS_WRAPPER_ID } from '../constants';

@Component({
  selector: 'app-insert-buttons',
  imports: [SharedModule],
  templateUrl: './insert-buttons.component.html',
  styleUrls: ['./insert-buttons.component.scss'],
})
export class InsertButtonsComponent {
  private canvasService = inject(CanvasService);

  canvasItem = input<CanvasItem | undefined>(undefined);

  protected readonly insertPositionEnum = InsertPosition;
  protected currentInsertPosition: InsertPosition = InsertPosition.AFTER;

  protected onQuickInsert(position: InsertPosition, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onInsertAsset('empty-flex', position);
  }

  protected onShowAssetsMenu(
    position: InsertPosition,
    event: Event,
    popover: Popover,
  ): void {
    event.stopPropagation();
    event.preventDefault();
    this.currentInsertPosition = position;
    popover.toggle(event);
  }

  protected onInsertAsset(presetId: string, position: InsertPosition): void {
    const targetId = this.canvasItem()?.key || CANVAS_WRAPPER_ID;
    // Don't auto-select when inserting from selection buttons - keep current selection
    this.canvasService.addPreset(presetId, targetId, position, false);
  }

  protected onShowFullAssets(
    position: InsertPosition,
    currentPopover: Popover,
    fullAssetsPopover: Popover,
  ): void {
    this.currentInsertPosition = position;
    currentPopover.hide();
    fullAssetsPopover.show(undefined);
  }
}
