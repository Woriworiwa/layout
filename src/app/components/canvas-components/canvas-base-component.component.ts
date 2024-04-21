import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasItem, CanvasItemClickEvent} from "../../models/canvas-item.model";
import {Serializer} from "../../data/serializers/serializer";
import {CssStyleSerializer} from "../../data/serializers/css-style.serializer";
import {CanvasStore} from "../../store/canvas.store";
import {SelectionService} from "../../services/selection.service";

@Component({
  selector: 'app-canvas-base-component',
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class CavnasBaseComponent{
  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<CanvasItemClickEvent>();

  constructor(private baseElementRef: ElementRef,
              private baseRenderer: Renderer2,
              private baseCanvasStore: CanvasStore,
              private baseSelectionService: SelectionService) {
  }

  @HostListener('click', ['$event'])
  onClick($event: any) {
    $event.stopPropagation();
    // this.contextMenuService.hide();
    this.clicked.emit({canvasItem: this.item!, mouseEvent: $event});
  }

  ngOnChanges() {
    const serializer: Serializer = new CssStyleSerializer();
    const serializedStyles: string[] = [];

    if (this.item) {
      serializedStyles.push(...serializer.serialize([this.item]));
      this.baseRenderer.setProperty(this.baseElementRef.nativeElement, 'style', serializedStyles.join(';'));
    }

    if (this.item?.key === this.baseCanvasStore.selectedFrame()?.key) {
      setTimeout(() => {
        this.baseSelectionService.renderSelectionItem(this.item!, this.baseElementRef.nativeElement);
      }, 0);
    }
  }
}
