import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  Renderer2,
  inject,
  input,
  output,
} from '@angular/core';

import { CanvasItem } from '@layout/models';
import { Serializer } from '@layout/serialization';
import { CssStyleSerializer } from '@layout/serialization';
import { SelectionService } from '../selection/selection.service';
import { Subject, takeUntil } from 'rxjs';
import { CanvasService } from '../canvas.service';
import { CanvasItemMouseEvent } from './canvas-item-mouse-event';

@Component({
  selector: 'app-canvas-base-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ``,
})
export class CanvasItemBaseComponent implements OnDestroy, OnChanges {
  item = input.required<CanvasItem>();
  itemClick = output<CanvasItemMouseEvent>();
  itemMouseOver = output<CanvasItemMouseEvent>();
  itemMouseOut = output<CanvasItemMouseEvent>();
  itemContextMenu = output<CanvasItemMouseEvent>();

  private baseElementRef = inject(ElementRef);
  private baseRenderer = inject(Renderer2);
  private baseCanvasService = inject(CanvasService);
  private baseSelectionService = inject(SelectionService);
  private destroy$ = new Subject();

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();

    this.itemClick.emit({ canvasItem: this.item(), mouseEvent: $event });
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event: MouseEvent) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();

    this.itemMouseOver.emit({ canvasItem: this.item(), mouseEvent: $event });
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: MouseEvent) {
    $event.stopPropagation();

    this.itemMouseOut.emit({ canvasItem: this.item(), mouseEvent: $event });
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    this.itemContextMenu.emit({ canvasItem: this.item(), mouseEvent: $event });
  }

  ngOnChanges() {
    this.updateCssAndSelection();

    this.baseCanvasService.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.baseSelectionService.selectedItem?.key === this.item().key) {
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
    if (this.item()) {
      serializedStyles.push(...serializer.serialize([this.item()]));
      if (serializedStyles.length) {
        this.baseRenderer.setProperty(
          this.baseElementRef.nativeElement,
          'style',
          serializedStyles.join(';'),
        );
      }

      // Apply Tailwind classes
      const tailwindClasses = this.item().tailwindClasses || '';
      if (tailwindClasses) {
        this.baseRenderer.setAttribute(
          this.baseElementRef.nativeElement,
          'class',
          tailwindClasses,
        );
      } else {
        this.baseRenderer.removeAttribute(
          this.baseElementRef.nativeElement,
          'class',
        );
      }
    }

    // Re-render the selection item to update any changes to the size of the item
    if (this.item()?.key === this.baseSelectionService.selectedItem?.key) {
      setTimeout(() => {
        this.baseSelectionService.renderItem('selection', this.item());
      }, 0);
    }
  }
}
