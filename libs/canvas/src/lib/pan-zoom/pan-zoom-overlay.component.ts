import {
  Component,
  HostListener,
  inject,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PanZoomService } from './pan-zoom.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pan-zoom-overlay',
  standalone: true,
  template: '',
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
export class PanZoomOverlayComponent implements OnInit, OnDestroy {
  private panZoomService = inject(PanZoomService);
  private destroy$ = new Subject<void>();

  @HostBinding('class.visible')
  protected isVisible = false;

  @HostBinding('class.panning')
  protected isPanning = false;

  ngOnInit(): void {
    this.panZoomService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isVisible = state.panModeActive;
        this.isPanning = state.isPanning;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (this.panZoomService.isPanning) {
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
