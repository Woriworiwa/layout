import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject, Input, OnDestroy,
  ViewChild,
  DOCUMENT
} from '@angular/core';

import {ContainerComponent} from "./canvas-items/container/container.component";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {CANVAS_WRAPPER_ID} from "../../core/constants";
import {ContextMenuService} from "./context-menu/context-menu.service";
import {SelectionService} from "./selection/selection.service";
import {CanvasToolbarComponent} from "./toolbar/canvas-toolbar.component";
import {PanZoomService} from "./pan-zoom.service";
import {DragDropService} from "./drag-drop.service";
import {CopyPasteService} from "./copy-paste.service";
import {KeyboardCommandsDirective} from "./keyboard-commands.directive";
import {PresetsService} from "../../designer/insert/presets.service";
import {CanvasService} from "./canvas.service";
import {SortablejsModule} from "nxt-sortablejs";
import {Options} from 'sortablejs'
import {PanZoomDirective} from "./pan-zoom.directive";
import {Subject, takeUntil} from "rxjs";
import {MetaLayerService} from "./meta-layer/meta-layer.service";
import {SelectionLayerComponent} from "./selection/selection-layer.component";
import {MetaLayerComponent} from "./meta-layer/meta-layer.component";
import {CanvasItemMouseEvent} from "./canvas-item-mouse-event";
import {CanvasSettings} from "./canvas.settings";

@Component({
  selector: 'app-canvas',
  imports: [ContainerComponent, CanvasToolbarComponent, SortablejsModule, SelectionLayerComponent, MetaLayerComponent],
  providers: [CopyPasteService, PresetsService, PanZoomService, MetaLayerService],
  hostDirectives: [KeyboardCommandsDirective, PanZoomDirective],
  host: {
    '[class.surface-100]': 'true',
  },
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @Input() settings: CanvasSettings = new CanvasSettings({allowAdd: true});

  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;
  frames: CanvasItem[] = [];
  canvasDragOptions: Options | undefined;
  childDragOptions: Options | undefined;
  private destroy$ = new Subject<boolean>();

  @ViewChild("wrapper")
  wrapperElementRef!: ElementRef;

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
      .subscribe(_ => {
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
    this.panZoomService.initialize(this.wrapperElementRef);
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
      group: 'canvas',
      disabled: this.panZoomService.isPanModeActive || this.panZoomService.isPanning || !this.settings.allowDragDrop
    });
    this.childDragOptions = this.dragDropService.createGroup({
      swapThreshold: 0.9,
      group: 'child',
      ghostClass: 'drag-background-lvl-2',
      disabled: this.panZoomService.isPanModeActive || this.panZoomService.isPanning || !this.settings.allowDragDrop
    });
  }
}
