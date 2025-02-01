import {ElementRef, Injectable, ViewContainerRef} from "@angular/core";
import {CanvasService} from "../canvas.service";
import {CanvasItem} from "../../../core/models/canvas-item.model";
import {MetaLabelComponent} from "./meta-label.component";
import {delay} from "rxjs";

@Injectable()
export class MetaLayerService {
  overlay!: ViewContainerRef;
  canvas!: ElementRef;

  constructor(private canvasService: CanvasService) {
  }

  initialize(overlay: ViewContainerRef, canvas: ElementRef) {
    this.overlay = overlay;
    this.canvas = canvas;

    this.canvasService.items$
      .pipe(delay(50))
      .subscribe((items) => {
        // TODO: this is POC, need to optimize because we are now clearing and re-rendering all labels
        this.overlay.clear();
        this.updateLayer(items);
      })
  }

  private updateLayer(items: CanvasItem[]) {
    items.forEach((item) => {
      this.renderLabel(item);
      item.children?.forEach((child) => {
        this.renderLabel(child);
      });
    });
  }

  private renderLabel(item: CanvasItem) {
    if (!item.label) {
      return;
    }

    const element: HTMLElement = this.getTargetElement(item);
    if (!element) {
      return;
    }

    const label = this.overlay.createComponent(MetaLabelComponent);
    this.addItem(label.instance, element, item);
  }

  addItem(component: MetaLabelComponent, element: HTMLElement, sourceItem: CanvasItem) {
    component.top = element.offsetTop;
    component.left = element.offsetLeft;
    component.label = sourceItem.label;
    component.ngOnChanges();
  }

  private getTargetElement(hoverFrame: CanvasItem) {
    return this.canvas?.nativeElement.querySelector(`#${hoverFrame?.key}`);
  }
}
