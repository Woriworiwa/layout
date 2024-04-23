import {ComponentRef, ElementRef, Injectable, ViewContainerRef} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {CanvasItem} from "../models/canvas-item.model";
import {CanvasSelectionItemComponent} from "../components/canvas/selection-item/canvas-selection-item.component";
import {CanvasHoverItemComponent} from "../components/canvas/selection-item/canvas-hover-item.component";

@Injectable()
export class SelectionService {
  overlay!: ViewContainerRef;
  canvas!: ElementRef;

  canvasSelectionItem!: ComponentRef<CanvasSelectionItemComponent>
  canvasHoverItem!: ComponentRef<CanvasHoverItemComponent>

  constructor(private canvasStore: CanvasStore) {
  }

  initialize(overlay: ViewContainerRef, canvas: ElementRef) {
    this.overlay = overlay;
    this.canvas = canvas;

    this.canvasStore.selectedFrame$
      .subscribe((selectedFrame) => {
          if (!selectedFrame) {
            this.removeItem(this.canvasSelectionItem);
          } else {
            this.renderItem('selection', selectedFrame!);
          }
        }
      )

    this.canvasStore.hoverFrame$
      .subscribe((hoverFrame) => {
          if (!hoverFrame) {
            this.removeItem(this.canvasHoverItem);
          } else {
            if (this.canvasStore.selectedFrame()?.key === hoverFrame.key) {
              return;
            }

            this.renderItem('hover', hoverFrame!);
          }
        }
      )
  }

  private getTargetElement(hoverFrame: CanvasItem) {
    return this.canvas.nativeElement.querySelector(`#${hoverFrame?.key}`);
  }

  renderItem(itemType: 'selection' | 'hover', canvasItem: CanvasItem) {
    const element: HTMLElement = this.getTargetElement(canvasItem);
    if (!element) {
      return;
    }

    if (itemType === 'selection') {
      if (this.canvasSelectionItem) {
        this.removeItem(this.canvasSelectionItem);
      }
      this.canvasSelectionItem = this.overlay.createComponent(CanvasSelectionItemComponent)
      this.addItem(this.canvasSelectionItem.instance, canvasItem, element);
    } else if(itemType === 'hover') {
      if (this.canvasHoverItem) {
        this.removeItem(this.canvasHoverItem);
      }
      this.canvasHoverItem = this.overlay.createComponent(CanvasHoverItemComponent)
      this.addItem(this.canvasHoverItem.instance, canvasItem, element);
    }
  }

  private addItem(component: CanvasSelectionItemComponent | CanvasHoverItemComponent, canvasItem: CanvasItem, element: HTMLElement) {
    const canvasBoundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const canvasItemBoundingRect = element.getBoundingClientRect();

    component.width = element.offsetWidth;
    component.height = element.offsetHeight;
    component.top = canvasItemBoundingRect.top - canvasBoundingRect.top;
    component.left = canvasItemBoundingRect.left - canvasBoundingRect.left;
    component.canvasItem = canvasItem;
    component.ngOnChanges();
  }

  private removeItem(item: ComponentRef<CanvasSelectionItemComponent | CanvasHoverItemComponent>) {
    const index = this.overlay.indexOf(item?.hostView)
    if (index != -1) this.overlay.remove(index)
  }
}