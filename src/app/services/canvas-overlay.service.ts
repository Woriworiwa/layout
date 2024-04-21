import {ComponentRef, ElementRef, Injectable, ViewContainerRef} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {CanvasItem} from "../models/canvas-item.model";
import {CanvasSelectionItemComponent} from "../components/canvas/canvas-item/canvas-selection-item.component";

@Injectable()
export class CanvasOverlayService {
  overlay!: ViewContainerRef;
  canvas!: ElementRef;

  canvasSelectionItem!: ComponentRef<CanvasSelectionItemComponent>

  constructor(private canvasStore: CanvasStore) {
  }

  initialize(overlay: ViewContainerRef, canvas: ElementRef) {
    this.overlay = overlay;
    this.canvas = canvas;

    this.canvasStore.selectedFrame$
      .subscribe((selectedFrame) => {
          const element: HTMLElement = this.canvas.nativeElement.querySelector(`#${selectedFrame?.key}`);
          this.renderSelectionItem(selectedFrame!, element);
        }
      )
  }

  renderSelectionItem(canvasItem: CanvasItem, element: HTMLElement) {
    if (this.canvasSelectionItem) {
      this.removeChild();
    }

    const canvasBoundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const canvasItemBoundingRect = element.getBoundingClientRect();

    this.canvasSelectionItem = this.overlay.createComponent(CanvasSelectionItemComponent)
    this.canvasSelectionItem.instance.width = element.offsetWidth;
    this.canvasSelectionItem.instance.height = element.offsetHeight;
    this.canvasSelectionItem.instance.top = canvasItemBoundingRect.top - canvasBoundingRect.top;
    this.canvasSelectionItem.instance.left = canvasItemBoundingRect.left - canvasBoundingRect.left;
    this.canvasSelectionItem.instance.canvasItem = canvasItem;
    this.canvasSelectionItem.instance.ngOnChanges();
  }

  removeChild() {
    const index = this.overlay.indexOf(this.canvasSelectionItem.hostView)
    if (index != -1) this.overlay.remove(index)
  }
}
