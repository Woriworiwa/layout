import {Component, ElementRef, HostBinding, HostListener, Renderer2, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FrameComponent} from "../canvas-components/frame/frame.component";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {CanvasItemComponent} from "./canvas-item/canvas-item.component";
import {ContextMenuService} from "../../services/context-menu.service";
import {AppSettingsStore} from "../../store/app-settings-store.service";
import {CssPipe} from "../../pipes/css.pipe";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent, CdkDropList, CdkDrag, CdkDropListGroup, InsertComponent, CanvasItemComponent, CssPipe],
  providers: [ContextMenuService],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  frames: CanvasItem[] = [];
  selectedFrameKey: string | undefined;
  translateY = 0;
  translateX = 0;
  scale = 1;

  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;

  @HostBinding('class.grab-mode')
  isGrabMode = false;

  @HostBinding('class.is-grabbing')
  isGrabbing = false;

  @ViewChild("wrapper")
  wrapper!: ElementRef;

  constructor(protected canvasStore: CanvasStore,
              private renderer: Renderer2,
              private appSettingsStore: AppSettingsStore) {
    this.canvasStore.frames$.subscribe(rootFrames => this.frames = rootFrames);
    this.canvasStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrameKey = selectedFrame?.key);
  }

  /*Zoom with mouse wheel*/
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
        this.translateX -= event.deltaY;
      } else {
        this.translateY -= event.deltaY;
      }
    }

    this.setTransformStyles();
  }

  /*click*/
  @HostListener('click', ['$event'])
  oneClick(event: MouseEvent) {
    this.canvasStore.setSelectedFrameKey(undefined);
  }

  /*mouse down*/
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

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveFrameChild(event.container.data || event.container.id, event.previousContainer.id, event.previousIndex, event.currentIndex);
  }

  private setTransformStyles() {
    this.renderer.setStyle(this.wrapper.nativeElement, 'transform', `scale(${this.scale})  translateY(${this.translateY}px) translateX(${this.translateX}px)`);
  }
}
