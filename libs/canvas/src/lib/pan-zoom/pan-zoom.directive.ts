import { Directive, HostListener, inject } from '@angular/core';
import { PanZoomService } from './pan-zoom.service';

@Directive({
  selector: '[appPanZoom]',
  standalone: true,
})
export class PanZoomDirective {
  private panZoomService = inject(PanZoomService);

  /*Zoom with mouse wheel*/
  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: Event) {
    const wheelEvent = event as WheelEvent;
    wheelEvent.stopPropagation();
    wheelEvent.preventDefault();

    if (wheelEvent.ctrlKey) {
      if (wheelEvent.deltaY > 0) {
        this.panZoomService.zoomOut();
      } else {
        this.panZoomService.zoomIn();
      }
    } else {
      if (wheelEvent.shiftKey) {
        this.panZoomService.panHorizontally(wheelEvent.deltaY);
      } else {
        this.panZoomService.panVertically(wheelEvent.deltaY);
      }
    }
  }

  /*keydown with space*/
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.panZoomService.activatePanMode();
    }
  }

  /*keyup with space*/
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.panZoomService.deactivatePanMode()
      this.panZoomService.isPanning = false;
    }
  }
}
