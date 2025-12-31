import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { AssetDragDropService } from './asset-drag-drop.service';
import { CANVAS_ROOT_ELEMENT_ID } from '../constants';
import { DragDropService } from './drag-drop.service';
import { InsertPosition } from '@layout/models';

/**
 * Directive that handles drag and drop events for the canvas.
 * Operates on the canvas component's host element, which is unaffected by zoom transforms.
 * This ensures the drop zone and visual feedback remain full-size regardless of canvas zoom level.
 */
@Directive({
  selector: '[appCanvasDropZone]',
  standalone: true,
  host: {
    '[class.drop-inside]': 'isDropZoneActive',
  },
})
export class CanvasDropZoneDirective implements AfterViewInit {
  private assetDragDropService = inject(AssetDragDropService);
  private elementRef = inject(ElementRef);
  private dragDropService = inject(DragDropService);
  private canvasWrapper?: HTMLElement;
  protected isDropZoneActive = false;

  ngAfterViewInit() {
    this.canvasWrapper = this.elementRef.nativeElement.querySelector(
      `#${CANVAS_ROOT_ELEMENT_ID}`,
    );
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    const presetData = $event.dataTransfer?.types.includes(
      'application/x-asset-preset',
    );
    if (!presetData) {
      return;
    }

    $event.preventDefault();
    if (!this.isDropZoneActive) {
      this.isDropZoneActive = true;
      this.assetDragDropService.setDropTarget(
        CANVAS_ROOT_ELEMENT_ID,
        InsertPosition.AFTER,
      );
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: DragEvent) {
    const relatedTarget = $event.relatedTarget as HTMLElement;

    // Only remove highlight if leaving the canvas wrapper and not moving to a child
    if (!relatedTarget || !this.canvasWrapper?.contains(relatedTarget)) {
      this.isDropZoneActive = false;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    // Always clear highlight on drop
    this.isDropZoneActive = false;

    const target = $event.target as HTMLElement;
    // Only prevent default if dropping on canvas wrapper itself
    if (target === this.canvasWrapper) {
      $event.preventDefault();
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.dragDropService.onMouseDown(event);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.dragDropService.onMouseUp();
  }
}
