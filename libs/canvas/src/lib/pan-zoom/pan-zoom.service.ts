import {
  afterRenderEffect,
  ElementRef,
  Injectable,
  Renderer2,
  signal,
  inject,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private currentStateSubject: BehaviorSubject<{
    panModeActive: boolean;
    isPanning: boolean;
  }> = new BehaviorSubject<{ panModeActive: boolean; isPanning: boolean }>({
    panModeActive: false,
    isPanning: false,
  });

  state$: Observable<{ panModeActive: boolean; isPanning: boolean }> =
    this.currentStateSubject.asObservable();

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

  set isPanModeActive(active: boolean) {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      panModeActive: active,
    });
  }

  get isPanning() {
    return this.currentStateSubject.getValue().isPanning;
  }

  set isPanning(isPanning: boolean) {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isPanning: isPanning,
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

  panHorizontally(delta: number) {
    this.translateX.update((value) => value - delta);
  }

  panVertically(delta: number) {
    this.translateY.update((value) => value - delta);
  }
}
