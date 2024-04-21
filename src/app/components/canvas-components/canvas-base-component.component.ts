import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasItem, CanvasItemClickEvent} from "../../models/canvas-item.model";
import {Serializer} from "../../data/serializers/serializer";
import {CssStyleSerializer} from "../../data/serializers/css-style.serializer";

@Component({
  selector: 'app-canvas-base-component',
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class CavnasBaseComponent{
  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<CanvasItemClickEvent>();

  constructor(private baseElementRef: ElementRef, private baseRenderer: Renderer2) {
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
  }
}
