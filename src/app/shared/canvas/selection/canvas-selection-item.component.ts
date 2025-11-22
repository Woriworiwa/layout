import {Component, ElementRef, Input, OnChanges, Renderer2, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {InsertComponent} from "../../../designer/insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {CanvasItem} from "../../../core/models/canvas-item.model";
import {SelectButtonModule} from "primeng/selectbutton";
import {InsertPosition} from "../../../core/enums";
import {FormsModule} from "@angular/forms";
import {Popover} from "primeng/popover";

@Component({
    selector: 'app-canvas-selection-item',
  imports: [CommonModule, ButtonModule, ContextMenuComponent, InsertComponent, OverlayPanelModule, SharedModule, SelectButtonModule, FormsModule, Popover],
    templateUrl: './canvas-selection-item.component.html',
    styleUrls: ['./canvas-selection-item.component.scss']
})
export class CanvasSelectionItemComponent implements OnChanges{
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

  constructor(private renderer: Renderer2,
              protected elementRef: ElementRef) {
  }

  ngOnChanges() {
      this.renderer.setStyle(this.elementRef.nativeElement, 'visibility', this.visibility);
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.width}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.height}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${this.left}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${this.top}px`);
  }
}
