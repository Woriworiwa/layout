import { Injectable, inject } from "@angular/core";
import {CanvasService} from "../canvas.service";
import {SelectionService} from "../selection/selection.service";

@Injectable()
export class CopyPasteService {
  private selectionService = inject(SelectionService);
  private canvasService = inject(CanvasService);

  private copyItemKey: string | undefined;

  copy() {
    this.copyItemKey = this.selectionService.selectedItem?.key;
  }

  paste() {
    this.canvasService.pasteItem(this.copyItemKey, this.selectionService.selectedItem?.key);
  }
}
