import { Injectable, inject } from '@angular/core';
import { CANVAS_ROOT_ELEMENT_ID } from '../constants';
import { PanZoomService } from '../pan-zoom/pan-zoom.service';
import { UI_GUIDANCE_TOKEN } from './ui-guidance.token';

/**
 * Service to detect when users attempt to drag canvas elements
 * and guide them to use the layers panel instead
 */
@Injectable()
export class DragDropService {
  private uiGuidanceService = inject(UI_GUIDANCE_TOKEN);
  private dragAttemptTimeout: ReturnType<typeof setTimeout> | undefined;
  private panZoomService = inject(PanZoomService);

  /**
   * Handles mousedown event on canvas elements
   * Detects if user is attempting to drag a canvas element
   */
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Don't trigger if clicking on buttons, inputs, or other interactive elements
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.p-tree')
    ) {
      return;
    }

    const closestElement = target.closest('[id]');
    const isCanvasElement =
      closestElement?.id &&
      closestElement.id !== CANVAS_ROOT_ELEMENT_ID &&
      !target.closest('.asset-item');

    if (isCanvasElement && event.button === 0) {
      // left mouse button
      // Clear any existing timeout
      if (this.dragAttemptTimeout) {
        clearTimeout(this.dragAttemptTimeout);
      }

      // Set a timeout to detect if user is attempting to drag
      this.dragAttemptTimeout = setTimeout(() => {
        if (this.panZoomService.isPanning) {
          return; // Don't show guidance if panning
        }
        // Trigger guidance to show and highlight layers panel
        this.uiGuidanceService.highlightLayersPanel();
      }, 150); // Short delay to distinguish from clicks
    }
  }

  /**
   * Handles mouseup event
   * Clears the drag detection timeout if mouse is released quickly
   */
  onMouseUp(): void {
    if (this.dragAttemptTimeout) {
      clearTimeout(this.dragAttemptTimeout);
    }
  }

  /**
   * Cleanup method to clear any pending timeouts
   */
  destroy(): void {
    if (this.dragAttemptTimeout) {
      clearTimeout(this.dragAttemptTimeout);
    }
  }
}
