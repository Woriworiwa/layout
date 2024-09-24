import {Injectable} from "@angular/core";
import {CanvasService} from "./canvas.service";
import {SelectionService} from "./selection.service";

@Injectable()
export class CopyPasteService {
  private copyItemKey: string | undefined;

  constructor(private selectionService: SelectionService,
              private canvasService: CanvasService) {
  }

  copy() {
    this.copyItemKey = this.selectionService.selectedItem?.key;
  }

  paste() {
    this.canvasService.pasteItem(this.copyItemKey, this.selectionService.selectedItem?.key);
  }
}
