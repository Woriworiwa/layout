import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";

@Injectable()
export class CopyPasteService {
  private copyItemKey: string | undefined;

  constructor(private canvasStore: CanvasStore) {
  }

  copy() {
    this.copyItemKey = this.canvasStore.selectedCanvasItem()?.key;
  }

  paste() {
    this.canvasStore.pasteItem(this.copyItemKey, this.canvasStore.selectedCanvasItem()?.key);
  }
}
