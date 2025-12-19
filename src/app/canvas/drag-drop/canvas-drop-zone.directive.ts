import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import { AssetDragDropService } from './asset-drag-drop.service';
import { CANVAS_WRAPPER_ID } from '../../core/constants';
import { InsertPosition } from '../../core/enums';
import { DragDropService } from './drag-drop.service';

/**
 * Directive that handles drag and drop events for the canvas wrapper element.
 * Manages visual feedback and drop target tracking when assets are dragged over the canvas.
 * When used as a host directive, it queries for the wrapper element within the component.
 */
@Directive({
  selector: '[appCanvasDropZone]',
  standalone: true,
})
export class CanvasDropZoneDirective implements AfterViewInit {
  private assetDragDropService = inject(AssetDragDropService);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private dragDropService = inject(DragDropService);
  private wrapperElement?: HTMLElement;

  ngAfterViewInit() {
    // When used as a host directive, find the wrapper element within the component
    this.wrapperElement = this.elementRef.nativeElement.querySelector(
      `#${CANVAS_WRAPPER_ID}`,
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

    // Only handle if dropping on empty canvas (not on a child element)
    if ($event.target === this.wrapperElement) {
      $event.preventDefault();
      this.assetDragDropService.setDropTarget(
        CANVAS_WRAPPER_ID,
        InsertPosition.AFTER,
      );
      this.renderer.addClass(this.wrapperElement, 'drop-inside');
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: DragEvent) {
    if ($event.target === this.wrapperElement) {
      this.renderer.removeClass(this.wrapperElement, 'drop-inside');
    }
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();
    this.renderer.removeClass(this.wrapperElement, 'drop-inside');
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
