import { Component, ElementRef, Input, OnChanges, Renderer2, ViewChild, inject } from "@angular/core";

import {Button} from "primeng/button";
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {InsertComponent} from "../../../designer/insert/insert.component";
import {Popover} from "primeng/popover";
import {SharedModule} from "primeng/api";
import {CanvasItem} from "../../../core/models/canvas-item.model";
import {SelectButton} from "primeng/selectbutton";
import {InsertPosition} from "../../../core/enums";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-canvas-selection-item',
  imports: [Button, ContextMenuComponent, InsertComponent, Popover, SharedModule, SelectButton, FormsModule],
    templateUrl: './canvas-selection-item.component.html',
    styleUrls: ['./canvas-selection-item.component.scss']
})
export class CanvasSelectionItemComponent implements OnChanges{
  private renderer = inject(Renderer2);
  protected elementRef = inject(ElementRef);

  @Input() width = 0;
  @Input() height = 0;
  @Input() top = 0;
  @Input() left = 0;
  @Input() canvasItem: CanvasItem | undefined = undefined;
  @Input() visibility: 'visible' | 'hidden' = 'visible';
  @Input() showAddButton = true;

  insertPosition: InsertPosition = InsertPosition.AFTER;

  insertPositions: { name: string, value: InsertPosition }[] = [
    { name: 'Before', value: InsertPosition.BEFORE },
    { name: 'Inside', value: InsertPosition.INSIDE },
    { name: 'After', value: InsertPosition.AFTER }
  ];

  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;

  ngOnChanges() {
      this.renderer.setStyle(this.elementRef.nativeElement, 'visibility', this.visibility);
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.width}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.height}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${this.left}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${this.top}px`);
  }
}
