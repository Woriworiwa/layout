import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild, DOCUMENT, inject, Renderer2 } from '@angular/core';

import {ContainerComponent} from "./canvas-items/container/container.component";
import {CanvasItem} from "../core/models/canvas-item.model";
import {CANVAS_WRAPPER_ID} from "../core/constants";
import {ContextMenuService} from "./context-menu/context-menu.service";
import {SelectionService} from "./selection/selection.service";
import {CanvasToolbarComponent} from "./toolbar/canvas-toolbar.component";
import {PanZoomService} from "./pan-zoom/pan-zoom.service";
import {CopyPasteService} from "./copy-paste/copy-paste.service";
import {KeyboardCommandsDirective} from "./keyboard/keyboard-commands.directive";
import {AssetService} from "../designer/assets/asset.service";
import {CanvasService} from "./canvas.service";
import {PanZoomDirective} from "./pan-zoom/pan-zoom.directive";
import {Subject, takeUntil} from "rxjs";
import {MetaLayerService} from "./meta-layer/meta-layer.service";
import {SelectionLayerComponent} from "./selection/selection-layer.component";
import {MetaLayerComponent} from "./meta-layer/meta-layer.component";
import {CanvasItemMouseEvent} from "./canvas-items/canvas-item-mouse-event";
import {CanvasSettings} from "./canvas.settings";
import {AssetDragDropService} from "./drag-drop/asset-drag-drop.service";
import {InsertPosition} from "../core/enums";
import {DragDropService} from "./drag-drop/drag-drop.service";

@Component({
  selector: 'app-canvas',
  imports: [ContainerComponent, CanvasToolbarComponent, SelectionLayerComponent, MetaLayerComponent],
  providers: [CopyPasteService, AssetService, PanZoomService, MetaLayerService, DragDropService],
  hostDirectives: [KeyboardCommandsDirective, PanZoomDirective],
  host: {
    '[class.surface-100]': 'true',
  },
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  private canvasService = inject(CanvasService);
  protected selectionService = inject(SelectionService);
  private contextMenuService = inject(ContextMenuService);
  protected panZoomService = inject(PanZoomService);
  private assetDragDropService = inject(AssetDragDropService);
  private renderer = inject(Renderer2);
  private document = inject<Document>(DOCUMENT);
  private dragDropService = inject(DragDropService);

  @Input() settings: CanvasSettings = new CanvasSettings({allowAdd: true});

  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;
  frames: CanvasItem[] = [];
  private destroy$ = new Subject<boolean>();

  @ViewChild("wrapper")
  wrapperElementRef!: ElementRef;

  constructor() {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rootFrames => {
        this.frames = rootFrames;
        /* focus the selected frame, most of the times the focus will be set by the mouse when the user clicks on an item,
        * but when programatically add new items, we need to focus them.
        * Items should be focused in order to listen to keyboard events*/
        /*TODO: Find another way other than setTimeout*/
        setTimeout(() => {
          this.document.getElementById(`${this.selectionService.selectedItem?.key}`)?.focus()
        }, 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.dragDropService.destroy();
  }

  /*click*/
  @HostListener('click', ['$event'])
  clearSelection() {
    this.selectionService.setSelectedItemKey(undefined);
    this.contextMenuService.hide();
  }

  @HostListener('dragover', ['$event'])
  onCanvasDragOver($event: DragEvent) {
    const presetData = $event.dataTransfer?.types.includes('application/x-asset-preset');
    if (!presetData) {
      return;
    }

    // Only handle if dropping on empty canvas (not on a child element)
    if ($event.target === this.wrapperElementRef?.nativeElement) {
      $event.preventDefault();
      this.assetDragDropService.setDropTarget(CANVAS_WRAPPER_ID, InsertPosition.AFTER);
      this.renderer.addClass(this.wrapperElementRef.nativeElement, 'drop-inside');
    }
  }

  @HostListener('dragleave', ['$event'])
  onCanvasDragLeave($event: DragEvent) {
    if ($event.target === this.wrapperElementRef?.nativeElement) {
      this.renderer.removeClass(this.wrapperElementRef.nativeElement, 'drop-inside');
    }
  }

  @HostListener('drop', ['$event'])
  onCanvasDrop($event: DragEvent) {
    if ($event.target === this.wrapperElementRef?.nativeElement) {
      $event.preventDefault();
      this.renderer.removeClass(this.wrapperElementRef.nativeElement, 'drop-inside');
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.dragDropService.onMouseDown(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    this.dragDropService.onMouseUp();
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
}
