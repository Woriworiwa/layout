import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {FrameComponent} from "../canvas-components/frame/frame.component";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem, CanvasItemMouseEvent} from "../../models/canvas-item.model";
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {ContextMenuService} from "../../services/context-menu.service";
import {CssStyleSerializerPipe} from "../../pipes/css-style-serializer.pipe";
import {SelectionService} from "../../services/selection.service";
import {CanvasToolbarComponent} from "./toolbar/canvas-toolbar.component";
import {PanZoomService} from "../../services/pan-zoom.service";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent, CdkDropList, CdkDrag, CdkDropListGroup, InsertComponent, CssStyleSerializerPipe, CanvasToolbarComponent],
  providers: [ContextMenuService, SelectionService, PanZoomService],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  frames: CanvasItem[] = [];
  selectedFrameKey: string | undefined;
  translateY = 0;
  translateX = 0;
  scale = 1;
  copyItemId: string | undefined;

  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;

  /* this mode means that the canvas is ready to be dragged*/
  @HostBinding('class.pan-mode-active')
  isGrabMode = false;

  /* this mode means that the user is actually dragging (mouse pressed down)*/
  @HostBinding('class.is-panning')
  isGrabbing = false;

  @ViewChild("wrapper")
  wrapper!: ElementRef;

  @ViewChild("selectionOverlay", { read: ViewContainerRef }) selectionOverlay!: ViewContainerRef;

  constructor(protected canvasStore: CanvasStore,
              private renderer: Renderer2,
              private selectionService: SelectionService,
              private contextMenuService: ContextMenuService,
              protected panZoomService: PanZoomService,
              @Inject(DOCUMENT) document: Document) {
    this.canvasStore.frames$.subscribe(rootFrames => {
      this.frames = rootFrames;

      /*focus the selected frame, this is needed to focus elements that are newly added*/
      setTimeout(() => {
        document.getElementById(`${this.canvasStore.selectedFrame()?.key}`)?.focus()
      }, 0);
    });
  }

  /*Zoom with mouse wheel*/
  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
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
  onClick(event: MouseEvent) {
    this.canvasStore.setSelectedFrameKey(undefined);
    this.contextMenuService.hide();
  }

  /*mouse down*/
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
     if (event.button === 0) {
      this.panZoomService.setIsPanning(this.isGrabMode);
    }
  }

  /*mouse up*/
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.setIsPanning(false);
    }
  }

  /*mouse move*/
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isGrabbing) {
      this.translateX += event.movementX;
      this.translateY += event.movementY;
      this.setTransformStyles();
    }
  }

  /*keydown*/
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.panZoomService.setPanModeActive(true);
    }
  }

  /*keyup*/
  @HostListener('document:keyup ', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.panZoomService.setPanModeActive(false);
    }
  }

  ngAfterViewInit() {
    this.selectionService.initialize(this.selectionOverlay, this.wrapper);
  }

  ngOnInit() {
    this.panZoomService.state$.subscribe(state => {
      this.isGrabMode = state.panModeActive;
      this.isGrabbing = state.isPanning;
    })
  }

  onFrameClicked(event: CanvasItemMouseEvent) {
    if (this.isGrabMode) {
      return;
    }

    this.canvasStore.setSelectedFrameKey(event.canvasItem.key);
    this.contextMenuService.hide();
  }

  onMouseOver(event: CanvasItemMouseEvent) {
    this.canvasStore.setHoverFrameKey(event.canvasItem.key);
  }

  onMouseOut(event: CanvasItemMouseEvent) {
    this.canvasStore.setHoverFrameKey(undefined);
  }

  onContextMenu(event: CanvasItemMouseEvent) {
    this.canvasStore.setSelectedFrameKey(event.canvasItem.key);
    this.selectionService.showContextMenu(event.mouseEvent);
  }

  onChildTextContentChanged(content: { key: string, content: string }) {
    this.canvasStore.updateTextContent(content.key, content.content);
  }

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveFrameChild(event.container.data || event.container.id, event.previousContainer.id, event.previousIndex, event.currentIndex);
  }

  private setTransformStyles() {
    this.renderer.setStyle(this.wrapper.nativeElement, 'transform', `scale(${this.scale})  translateY(${this.translateY}px) translateX(${this.translateX}px)`);
  }

  onCopy($event: CanvasItem) {
    this.copyItemId = $event.key;
  }

  onPaste($event: CanvasItem) {
    this.canvasStore.pasteItem(this.copyItemId, $event.key);
  }
}
