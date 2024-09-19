import {Component, ElementRef, Input, OnChanges, Renderer2} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {InsertComponent} from "../../insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {CanvasItem} from "../../../models/canvas-item.model";

@Component({
  selector: 'app-canvas-hover-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, ContextMenuComponent, InsertComponent, OverlayPanelModule, SharedModule],
  templateUrl: './canvas-hover-item.component.html',
  styleUrls: ['./canvas-hover-item.component.scss']
})
export class CanvasHoverItemComponent implements OnChanges{
  @Input() width = 0;
  @Input() height = 0;
  @Input() top = 0;
  @Input() left = 0;
  @Input() canvasItem: CanvasItem | undefined = undefined;
  @Input() visibility: 'visible' | 'hidden' = 'visible';

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
