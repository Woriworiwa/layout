import {Component, ElementRef, HostBinding, HostListener, Renderer2, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FrameComponent} from "../element-components/frame/frame.component";
import {CanvasStore} from "../../store/canvas.store";
import {Frame} from "../../models/frame.model";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent],
  template: `
    <app-frame [frame]="rootFrame"
               [selectedFrameKey]="selectedFrameKey"
               (clicked)="onFrameClicked($event)"
               (frameContentChanged)="onContentChanged($event)"></app-frame>
  `,
  styles: `
    :host {
      height: 100%;
      background-color: #eeeeee;
      padding: 30px;
      overflow: clip;

      > app-frame {
        /*height: 100%;*/
        background: #eeeeee;
      }

      &.grab-mode {
        cursor: grab ;

        &.is-grabbing {
          cursor: grabbing;
        }
      }
    }
  `
})
export class CanvasComponent {
  rootFrame: Frame | undefined;
  selectedFrameKey: string | undefined;
  translateY = 0;
  translateX = 0;
  scale = 1;

  @HostBinding('class.grab-mode')
  isGrabMode = false;

  @HostBinding('class.is-grabbing')
  isGrabbing = false;

  @ViewChild(FrameComponent, {read: ElementRef})
  childFrame!: ElementRef;

  constructor(protected canvasStore: CanvasStore,
              private renderer: Renderer2) {
    this.canvasStore.rootFrame$.subscribe(rootFrame => this.rootFrame = rootFrame);
    this.canvasStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrameKey = selectedFrame?.key);
  }

  @HostListener('mousewheel', ['$event'])
  onClick(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event.ctrlKey) {
      if (event.deltaY > 0) {
        this.scale -= 0.1;
      } else {
        this.scale += 0.1;
      }
    } else {
      if (event.shiftKey) {
        this.translateX += event.deltaY;
      } else {
        this.translateY += event.deltaY;
      }
    }

    this.setTransformStyles();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
     if (event.button === 0) {
      this.isGrabbing = this.isGrabMode;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.isGrabbing = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isGrabbing) {
      this.translateX += event.movementX;
      this.translateY += event.movementY;
      this.setTransformStyles();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.isGrabMode = true;
    }
  }

  @HostListener('document:keyup ', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.isGrabMode = false;
    }
  }

  onFrameClicked(key: string) {
    this.canvasStore.setSelectedFrameKey(key);
  }

  onContentChanged(content: { key: string, content: string }) {
    console.log(content);
  }

  private setTransformStyles() {
    this.renderer.setStyle(this.childFrame.nativeElement, 'transform', `scale(${this.scale})  translateY(${this.translateY}px) translateX(${this.translateX}px)`);
  }
}
