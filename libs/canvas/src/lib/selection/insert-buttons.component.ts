import { Component, input, inject } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { CanvasItem } from '@layout/models';
import { CanvasService } from '../canvas.service';
import { CANVAS_ROOT_ELEMENT_ID } from '../constants';
import { InsertPosition } from '@layout/models';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-insert-buttons',
  imports: [SharedModule, Tooltip],
  templateUrl: './insert-buttons.component.html',
  styleUrls: ['./insert-buttons.component.scss'],
})
export class InsertButtonsComponent {
  canvasItem = input<CanvasItem | undefined>(undefined);

  private canvasService = inject(CanvasService);
  protected readonly insertPositionEnum = InsertPosition;

  protected onQuickInsert(position: InsertPosition, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onInsertAsset('empty-container', position);
  }

  protected onInsertAsset(presetId: string, position: InsertPosition): void {
    const targetId = this.canvasItem()?.key || CANVAS_ROOT_ELEMENT_ID;
    // Don't auto-select when inserting from selection buttons - keep current selection
    this.canvasService.addPreset(presetId, targetId, position, false);
  }
}
