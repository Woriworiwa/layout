import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, Renderer2, inject } from '@angular/core';

import {CanvasItem} from "../../../core/models/canvas-item.model";
import {Serializer} from "../../../core/serialization/serializers/serializer";
import {CssStyleSerializer} from "../../../core/serialization/serializers/css-style.serializer";
import {SelectionService} from "../selection/selection.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../canvas.service";
import {CanvasItemMouseEvent} from "../canvas-item-mouse-event";

@Component({
    selector: 'app-canvas-base-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    template: ``
})
export class CanvasItemComponent implements OnDestroy, OnChanges {
  private baseElementRef = inject(ElementRef);
  private baseRenderer = inject(Renderer2);
  private baseCanvasService = inject(CanvasService);
  private baseSelectionService = inject(SelectionService);

  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOver = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOut = new EventEmitter<CanvasItemMouseEvent>();
  @Output() contextMenu = new EventEmitter<CanvasItemMouseEvent>();

  private destroy$ = new Subject();

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();

    if (!this.item) {
      return;
    }

    this.clicked.emit({canvasItem: this.item, mouseEvent: $event});
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event: MouseEvent) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();

    if (!this.item) {
      return;
    }

    this.mouseOver.emit({canvasItem: this.item, mouseEvent: $event});
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: MouseEvent) {
    $event.stopPropagation();

    if (!this.item) {
      return;
    }

    this.mouseOut.emit({canvasItem: this.item, mouseEvent: $event});
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    if (!this.item) {
      return;
    }

    this.contextMenu.emit({canvasItem: this.item, mouseEvent: $event});
  }

  ngOnChanges() {
    this.updateCssAndSelection();

    this.baseCanvasService.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.baseSelectionService.selectedItem?.key === this.item?.key) {
          this.updateCssAndSelection();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected updateCssAndSelection() {
    const serializer: Serializer = new CssStyleSerializer();
    const serializedStyles: string[] = [];

    // Serialize the styles
    if (this.item) {
      serializedStyles.push(...serializer.serialize([this.item]));
      if (serializedStyles.length) {
        this.baseRenderer.setProperty(this.baseElementRef.nativeElement, 'style', serializedStyles.join(';'));
      }
    }

    // Re-render the selection item to update any changes to the size of the item
    if (this.item?.key === this.baseSelectionService.selectedItem?.key) {
      setTimeout(() => {
        if (!this.item) {
          return;
        }

        this.baseSelectionService.renderItem('selection', this.item);
      }, 0);
    }
  }
}
