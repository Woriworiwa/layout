import { Directive, HostBinding, HostListener, inject } from "@angular/core";
import {PanZoomService} from "./pan-zoom.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[appPanZoom]',
  standalone: true,
})
export class PanZoomDirective {
  private panZoomService = inject(PanZoomService);

  constructor() {
    this.panZoomService.state$
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        this.isPanModeActive = state.panModeActive;
      });
  }

  /* this mode means that the canvas is ready to be dragged*/
  @HostBinding('class.pan-mode-active')
  isPanModeActive = false;

  /*Zoom with mouse wheel*/
  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event.ctrlKey) {
      if (event.deltaY > 0) {
        this.panZoomService.zoomOut();
      } else {
        this.panZoomService.zoomIn();
      }
    } else {
      if (event.shiftKey) {
        this.panZoomService.panHorizontally(event.deltaY);
      } else {
        this.panZoomService.panVertically(event.deltaY);
      }
    }
  }

  /*mouse move*/
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.panZoomService.isPanning) {
      this.panZoomService.panHorizontally(-event.movementX);
      this.panZoomService.panVertically(-event.movementY);
    }
  }

  /*mouse up*/
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.isPanning = false;
    }
  }

  /*mouse down*/
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.isPanning = this.isPanModeActive;
    }
  }

  /*keydown with space*/
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.panZoomService.isPanModeActive = true;
    }
  }

  /*keyup with space*/
  @HostListener('document:keyup ', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.panZoomService.isPanModeActive = false;
    }
  }
}
