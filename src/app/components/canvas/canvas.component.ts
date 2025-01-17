import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject, OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {ContainerComponent} from "./canvas-components/container/container.component";
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
import {CopyPasteService} from "../../services/copy-paste.service";
import {CopyPasteDirective} from "../../directives/copy-paste.directive";
import {PresetsService} from "../../services/presets.service";
import {CanvasService} from "../../services/canvas.service";
import {SortablejsModule} from "nxt-sortablejs";
import {Options} from 'sortablejs'
import {PanZoomDirective} from "../../directives/pan-zoom.directive";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-canvas',
    imports: [CommonModule, ContainerComponent, CanvasToolbarComponent, SortablejsModule],
    providers: [CopyPasteService, PresetsService, DragDropService, PanZoomService],
    hostDirectives: [CopyPasteDirective, PanZoomDirective],
    host: {
        '[class.surface-100]': 'true',
    },
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;
  frames: CanvasItem[] = [];
  canvasDragOptions: Options | undefined;
  childDragOptions: Options | undefined;
  private destroy$ = new Subject<boolean>();

  @ViewChild("wrapper")
  wrapper!: ElementRef;

  @ViewChild("selectionOverlay", {read: ViewContainerRef})
  selectionOverlay!: ViewContainerRef;

  constructor(private canvasService: CanvasService,
              protected selectionService: SelectionService,
              private contextMenuService: ContextMenuService,
              protected panZoomService: PanZoomService,
              protected dragDropService: DragDropService,
              @Inject(DOCUMENT) document: Document) {

    this.initDragDrop();

    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rootFrames => {
        this.frames = rootFrames;
        /* focus the selected frame, most of the times the focus will be set by the mouse when the user clicks on an item,
        * but when programatically add new items, we need to focus them.
        * Items should be focused in order to listen to keyboard events*/
        /*TODO: Find another way other than setTimeout*/
        setTimeout(() => {
          document.getElementById(`${this.selectionService.selectedItem?.key}`)?.focus()
        }, 0);
      });

    this.panZoomService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.initDragDrop();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*click*/
  @HostListener('click', ['$event'])
  clearSelection() {
    this.selectionService.setSelectedItemKey(undefined);
    this.contextMenuService.hide();
  }

  ngAfterViewInit() {
    this.selectionService.initialize(this.selectionOverlay, this.wrapper);
    this.panZoomService.initialize(this.wrapper);
  }

  onFrameClicked(event: CanvasItemMouseEvent) {
    if (this.panZoomService.isPanModeActive) {
      return;
    }

    this.selectionService.setSelectedItemKey(event.canvasItem.key);
    this.contextMenuService.hide();
  }

  onMouseOver(event: CanvasItemMouseEvent) {
    if (this.panZoomService.isPanning || this.panZoomService.isPanModeActive) {
      return;
    }

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

  private initDragDrop() {
    this.canvasDragOptions = this.dragDropService.createGroup({
      swapThreshold: 0.8,
      ghostClass: 'drag-background-lvl-1',
      disabled: this.panZoomService.isPanModeActive || this.panZoomService.isPanning
    });
    this.childDragOptions = this.dragDropService.createGroup({
      swapThreshold: 0.9,
      group: 'child',
      ghostClass: 'drag-background-lvl-2',
      disabled: this.panZoomService.isPanModeActive || this.panZoomService.isPanning
    });
  }
}
