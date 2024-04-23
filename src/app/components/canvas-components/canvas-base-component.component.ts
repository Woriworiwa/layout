import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
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

@Component({
  selector: 'app-canvas-base-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class CavnasBaseComponent{
  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOver = new EventEmitter<CanvasItemMouseEvent>();
  @Output() mouseOut = new EventEmitter<CanvasItemMouseEvent>();

  private destroy$ = new Subject();

  constructor(private baseElementRef: ElementRef,
              private baseRenderer: Renderer2,
              private baseCanvasStore: CanvasStore,
              private baseSelectionService: SelectionService) {
  }

  @HostListener('click', ['$event'])
  onClick($event: any) {
    $event.stopPropagation();
    // this.contextMenuService.hide();
    this.clicked.emit({canvasItem: this.item!, mouseEvent: $event});
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event: any) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.mouseOver.emit({canvasItem: this.item!, mouseEvent: $event});
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: any) {
    $event.stopPropagation();
    this.mouseOut.emit({canvasItem: this.item!, mouseEvent: $event});
  }

  ngOnChanges() {
    this.updateCssAndSelection();

    this.baseCanvasStore.frameCssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.baseCanvasStore.selectedFrame()?.key === this.item?.key) {
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
      this.baseRenderer.setProperty(this.baseElementRef.nativeElement, 'style', serializedStyles.join(';'));
    }

    // Re-render the selection item to update any changes to the size of the item
    if (this.item?.key === this.baseCanvasStore.selectedFrame()?.key) {
      setTimeout(() => {
        this.baseSelectionService.renderItem('selection', this.item!);
      }, 0);
    }


  }
}
