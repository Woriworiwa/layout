import {
  afterRenderEffect,
  ElementRef,
  Injectable,
  Renderer2,
  signal,
  inject,
} from '@angular/core';

export interface PanZoomState {
  panModeActive: boolean;
  isPanning: boolean;
}

@Injectable()
export class PanZoomService {
  private renderer = inject(Renderer2);

  readonly ZOOM_STEP = 0.03;
  readonly MINIMUM_ZOOM = 0.3;
  readonly MAXIMUM_ZOOM = 10;

  private canvas: ElementRef | undefined;
  public scale = signal(1);
  private translateY = signal(0);
  private translateX = signal(0);

  state = signal<PanZoomState>({
    panModeActive: false,
    isPanning: false,
  });

  constructor() {
    afterRenderEffect(() => {
      if (!this.canvas) {
        return;
      }

      this.renderer.setStyle(
        this.canvas?.nativeElement,
        'transform',
        `scale(${this.scale()})  translateY(${this.translateY()}px) translateX(${this.translateX()}px)`,
      );
    });
  }

  activatePanMode() {
    this.state.update((x) => {
      return {
        ...x,
        panModeActive: true,
      };
    });
  }

  deactivatePanMode() {
    this.state.update((x) => {
      return {
        ...x,
        panModeActive: false,
      };
    });
  }

  set isPanning(isPanning: boolean) {
    this.state.update((x) => {
      return {
        ...x,
        isPanning: isPanning,
      };
    });
  }

  initialize(target: ElementRef) {
    this.canvas = target;
  }

  zoomOut() {
    if (this.scale() <= this.MINIMUM_ZOOM) {
      return;
    }

    this.scale.update((value) => value - this.ZOOM_STEP);
  }

  zoomIn() {
    if (this.scale() >= this.MAXIMUM_ZOOM) {
      return;
    }

    this.scale.update((value) => value + this.ZOOM_STEP);
  }

  zoomToFit() {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  zoomTo(scale: number) {
    const clampedScale = Math.max(
      this.MINIMUM_ZOOM,
      Math.min(this.MAXIMUM_ZOOM, scale),
    );
    this.scale.set(clampedScale);
  }

  panHorizontally(delta: number) {
    this.translateX.update((value) => value - delta);
  }

  panVertically(delta: number) {
    this.translateY.update((value) => value - delta);
  }
}
