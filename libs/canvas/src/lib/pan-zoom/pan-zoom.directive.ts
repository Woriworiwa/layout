import { Directive, HostListener, inject } from '@angular/core';
import { PanZoomService } from './pan-zoom.service';

@Directive({
  selector: '[appPanZoom]',
  standalone: true,
})
export class PanZoomDirective {
  private panZoomService = inject(PanZoomService);

  /*Zoom with mouse wheel*/
  @HostListener('wheel', ['$event'])
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
  @HostListener('keydown.space')
  onKeyDown() {
    this.panZoomService.activatePanMode();
  }

  /*keyup with space*/
  @HostListener('keyup.space')
  onKeyUp() {
    this.panZoomService.deactivatePanMode();
    this.panZoomService.isPanning = false;
  }
}
