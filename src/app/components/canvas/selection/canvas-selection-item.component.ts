import {Component, ElementRef, HostListener, Input, Renderer2, SimpleChange, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {InsertComponent} from "../../insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {CanvasItem} from "../../../models/canvas-item.model";

@Component({
  selector: 'app-canvas-selection-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, ContextMenuComponent, InsertComponent, OverlayPanelModule, SharedModule],
  templateUrl: './canvas-selection-item.component.html',
  styleUrls: ['./canvas-selection-item.component.scss']
})
export class CanvasSelectionItemComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Input() canvasItem: CanvasItem | undefined = undefined;
  @Input() visibility: 'visible' | 'hidden' = 'visible';

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
