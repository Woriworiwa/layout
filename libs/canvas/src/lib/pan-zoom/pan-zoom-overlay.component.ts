import {
  Component,
  HostListener,
  inject,
  effect,
  signal,
} from '@angular/core';
import { PanZoomService } from './pan-zoom.service';

@Component({
  selector: 'app-pan-zoom-overlay',
  standalone: true,
  template: '',
  host: {
    'data-testid': 'canvas-overlay',
    '[class.visible]': 'isVisible()',
    '[class.panning]': 'isPanning()',
  },
  styles: `
    :host {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      cursor: grab;
      display: none;
      pointer-events: none;

      &.visible {
        display: block;
        pointer-events: all;
      }

      &.panning {
        cursor: grabbing;
      }
    }
  `,
})
export class PanZoomOverlayComponent {
  private panZoomService = inject(PanZoomService);
  isVisible = signal(false);
  isPanning = signal(false);

  constructor() {
    effect(() => {
      const panZoomState = this.panZoomService.state();
      this.isVisible.set(panZoomState.panModeActive);
      this.isPanning.set(panZoomState.isPanning);
    });
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.isPanning = true;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.panZoomService.state().isPanning) {
      this.panZoomService.panHorizontally(-event.movementX);
      this.panZoomService.panVertically(-event.movementY);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.isPanning = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // Prevent click from reaching canvas and clearing selection
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.panZoomService.isPanning = false;
  }
}
