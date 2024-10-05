import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject, OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {ContainerComponent} from "../canvas-components/frame/container.component";
import {CanvasItem, CanvasItemMouseEvent} from "../../models/canvas-item.model";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {ContextMenuService} from "../../services/context-menu.service";
import {CssStyleSerializerPipe} from "../../pipes/css-style-serializer.pipe";
import {SelectionService} from "../../services/selection.service";
import {CanvasToolbarComponent} from "./toolbar/canvas-toolbar.component";
import {PanZoomService} from "../../services/pan-zoom.service";
import {DragDropService} from "../../services/drag-drop.service";
import {MessageService} from "primeng/api";
import {CopyPasteService} from "../../services/copy-paste.service";
import {CopyPasteDirective} from "../../directives/copy-paste.directive";
import {PresetsService} from "../../services/presets.service";
import {CanvasService} from "../../services/canvas.service";
import {CssPrismComponent} from "../prisms/css-prism.component";
import {SortablejsModule} from "nxt-sortablejs";
import { Options } from 'sortablejs'

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, ContainerComponent, CdkDropList, CdkDrag, CdkDropListGroup, InsertComponent, CssStyleSerializerPipe, CanvasToolbarComponent, CssPrismComponent, SortablejsModule],
  providers: [ContextMenuService, CopyPasteService, PresetsService],
  hostDirectives: [CopyPasteDirective],
  host: {
    '[class.surface-100]': 'true',
  },
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnInit{
  frames: CanvasItem[] = [];
  selectedFrameKey: string | undefined;
  translateY = 0;
  translateX = 0;
  scale = 1;
  copyItemId: string | undefined;

  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;

  /* this mode means that the canvas is ready to be dragged*/
  @HostBinding('class.pan-mode-active')
  isPanModeActive = false;

  /* this mode means that the user is actually dragging (mouse pressed down)*/
  @HostBinding('class.is-panning')
  isPanning = false;

  @ViewChild("wrapper")
  wrapper!: ElementRef;

  @ViewChild("selectionOverlay", {read: ViewContainerRef})
  selectionOverlay!: ViewContainerRef;

  @ViewChild("cssPrism",  {read: ElementRef})
  cssPrism!: ElementRef;

  canvasDragOptions: Options;
  childDragOptions: Options;

  constructor(private canvasService: CanvasService,
              private renderer: Renderer2,
              protected selectionService: SelectionService,
              private contextMenuService: ContextMenuService,
              protected panZoomService: PanZoomService,
              protected dragDropService: DragDropService,
              private messageService: MessageService,
              @Inject(DOCUMENT) document: Document) {
    this.canvasDragOptions = this.dragDropService.createGroup({ swapThreshold: 0.8, ghostClass: 'drag-background-lvl-1'});
    this.childDragOptions = this.dragDropService.createGroup({ swapThreshold: 0.9, group: 'child', ghostClass: 'drag-background-lvl-2'});
9
    this.canvasService.items$.subscribe(rootFrames => {
      this.frames = rootFrames;
      /* focus the selected frame, most of the times the focus will be set by the mouse when the user clicks on an item,
      * but when programatically add new items, we need to focus them.
      * Items should be focused in order to listen to keyboard events*/
      /*TODO: Find another way other than setTimeout*/
      setTimeout(() => {
        document.getElementById(`${this.selectionService.selectedItem?.key}`)?.focus()
      }, 0);
    });

    this.selectionService.selectedItem$.subscribe(frame => {
      this.setCssPrismPosition();
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
        // this.translateX -= event.deltaX;

        this.setCssPrismPosition();
      }
    }

    this.setTransformStyles();
  }

  /*click*/
  @HostListener('click', ['$event'])
  onClick() {
    this.selectionService.setSelectedItemKey(undefined);
    this.contextMenuService.hide();
  }

  /*mouse down*/
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.panZoomService.setIsPanning(this.isPanModeActive);
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
    if (this.isPanning) {
      this.translateX += event.movementX;
      this.translateY += event.movementY;
      this.setTransformStyles();
      this.setCssPrismPosition();
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





  // onDrop(event: CdkDragDrop<string | undefined, any>) {
  //
  // }

  ngAfterViewInit() {
    this.selectionService.initialize(this.selectionOverlay, this.wrapper);
  }

  ngOnInit() {
    this.panZoomService.state$.subscribe(state => {
      this.isPanModeActive = state.panModeActive;
      this.isPanning = state.isPanning;
    });
  }

  onFrameClicked(event: CanvasItemMouseEvent) {
    if (this.isPanModeActive) {
      return;
    }

    this.selectionService.setSelectedItemKey(event.canvasItem.key);
    this.contextMenuService.hide();
  }

  onMouseOver(event: CanvasItemMouseEvent) {
    this.selectionService.setHoverItemKey(event.canvasItem.key);
  }

  onMouseOut() {
    this.selectionService.setHoverItemKey(undefined);
  }

  onContextMenu(event: CanvasItemMouseEvent) {
    this.selectionService.setSelectedItemKey(event.canvasItem.key);
    this.selectionService.showContextMenu(event.mouseEvent);
  }

  onChildTextContentChanged(content: { key: string, content: string }) {
    this.canvasService.updateTextContent(content.key, content.content);
  }

  private setTransformStyles() {
    this.renderer.setStyle(this.wrapper.nativeElement, 'transform', `scale(${this.scale})  translateY(${this.translateY}px) translateX(${this.translateX}px)`);
  }

  private setCssPrismPosition() {
    const coordinates = this.selectionService.getSelectionCoordinates();
    if (coordinates && this.cssPrism) {
      this.renderer.setStyle(this.cssPrism.nativeElement, 'transform', `translateY(${coordinates.top + this.translateY}px)`);
      // this.renderer.setStyle(this.cssPrism.nativeElement, 'left', `${coordinates.right}px)`);
    }
  }
}
