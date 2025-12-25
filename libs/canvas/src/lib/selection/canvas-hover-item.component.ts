import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  inject,
} from '@angular/core';

import { SharedModule } from 'primeng/api';
import { CanvasItem } from '@layout/models';

@Component({
  selector: 'app-canvas-hover-item',
  imports: [SharedModule],
  templateUrl: './canvas-hover-item.component.html',
  styleUrls: ['./canvas-hover-item.component.scss'],
})
export class CanvasHoverItemComponent implements OnChanges {
  private renderer = inject(Renderer2);
  protected elementRef = inject(ElementRef);

  @Input() width = 0;
  @Input() height = 0;
  @Input() top = 0;
  @Input() left = 0;
  @Input() canvasItem: CanvasItem | undefined = undefined;
  @Input() visibility: 'visible' | 'hidden' = 'visible';
  @Input() showAddButton = true;

  ngOnChanges() {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'visibility',
      this.visibility,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'width',
      `${this.width}px`,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'height',
      `${this.height}px`,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'left',
      `${this.left}px`,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'top',
      `${this.top}px`,
    );
  }
}
