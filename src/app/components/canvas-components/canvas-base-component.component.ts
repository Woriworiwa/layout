import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnChanges, OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasItem, CanvasItemMouseEvent} from "../../models/canvas-item.model";
import {Serializer} from "../../data/serializers/serializer";
import {CssStyleSerializer} from "../../data/serializers/css-style.serializer";
import {CanvasStore} from "../../store/canvas.store";
import {SelectionService} from "../../services/selection.service";
import {Subject, takeUntil} from "rxjs";
import {DragulaService} from "ng2-dragula";

@Component({
  selector: 'app-canvas-base-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class CanvasBaseComponent implements OnDestroy, OnChanges {
  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOver = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOut = new EventEmitter<CanvasItemMouseEvent>();
  @Output() contextMenu = new EventEmitter<CanvasItemMouseEvent>();

  private destroy$ = new Subject();

  constructor(private baseElementRef: ElementRef,
              private baseRenderer: Renderer2,
              private baseCanvasStore: CanvasStore,
              private baseDragulaService: DragulaService,
              private baseSelectionService: SelectionService) {
  }

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

    this.baseCanvasStore.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.baseCanvasStore.selectedCanvasItem()?.key === this.item?.key) {
          this.updateCssAndSelection();
        }
      });

    this.baseDragulaService.drag(this.item?.key).subscribe(() => {
      if(!this.item) {
        return;
      }

      this.clicked.emit({canvasItem: this.item, mouseEvent: new MouseEvent('click')});
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
      this.baseRenderer.setProperty(this.baseElementRef.nativeElement, 'style', serializedStyles.join(';'));
    }

    // Re-render the selection item to update any changes to the size of the item
    if (this.item?.key === this.baseCanvasStore.selectedCanvasItem()?.key) {
      setTimeout(() => {
        if (!this.item) {
          return;
        }

        this.baseSelectionService.renderItem('selection', this.item);
      }, 0);
    }
  }
}
