import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';

import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { InsertButtonsComponent } from './insert-buttons.component';
import { CanvasItem } from '@layout/models';

@Component({
  selector: 'app-selection-item',
  imports: [ContextMenuComponent, InsertButtonsComponent],
  templateUrl: './selection-item.component.html',
  styleUrls: ['./selection-item.component.scss'],
})
export class SelectionItemComponent implements OnChanges {
  private renderer = inject(Renderer2);
  protected elementRef = inject(ElementRef);

  @Input() width = 0;
  @Input() height = 0;
  @Input() top = 0;
  @Input() left = 0;
  @Input() canvasItem: CanvasItem | undefined = undefined;
  @Input() visibility: 'visible' | 'hidden' = 'visible';
  @Input() showAddButton = true;

  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;

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
